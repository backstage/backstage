/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Only used by performance tests, which run with dev dependencies available
// eslint-disable-next-line @backstage/no-undeclared-imports
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { FilterPredicate } from '@backstage/filter-predicates';
import { Knex } from 'knex';
import { Cursor } from '../../catalog/types';
import { DefaultEntitiesCatalog } from '../../service/DefaultEntitiesCatalog';
import { entitiesResponseToObjects } from '../../service/response';
import {
  DATASET_FIXTURES,
  getPerformanceDatabaseIds,
  getPerformanceDataset,
} from './lib/dataset';
import { describePerformanceTest } from './lib/env';
import {
  CapturedQuery,
  ExplainResult,
  PlanNode,
  captureQueries,
  correlatedSubPlans,
  describeNode,
  explain,
  hasMaterializedCte,
  hasTempBuffers,
  indexesUsed,
  planLoops,
  planNodes,
  seqScansOn,
  summarizePlan,
  topLevelSort,
} from './lib/explain';
import { measureRepeated } from './lib/measure';
import { applyPlanCheckResult } from './lib/planFindings';

/*
 * Automated version of the manual battery in query-battery/queries.md. Each
 * test runs one scenario through DefaultEntitiesCatalog, captures the SQL it
 * issues, runs EXPLAIN ANALYZE on every select, and fails if the plan shows
 * one of the anti-patterns that queries.md lists for that scenario, or one of
 * the global anti-patterns at the end of queries.md.
 *
 * Do not relax a check to make a test pass. If an invariant does not hold,
 * either fix the query, or add a named, commented exception that explains
 * why the plan is acceptable on that database.
 */

jest.setTimeout(600_000);

// Seeding the full dataset takes a while on a cold database
const DATASET_TIMEOUT_MS = 3 * 60 * 60 * 1000;

const credentials = mockCredentials.none();
const hub = DATASET_FIXTURES.hubComponentRef;
const claims = DATASET_FIXTURES.claims;
// A literal type, so that it can be used as a computed key in predicates
const readers = 'metadata.annotations.example.com/readers';
if (readers !== `metadata.annotations.${DATASET_FIXTURES.readersAnnotation}`) {
  throw new Error(`The readers key does not match the dataset fixture`);
}

/**
 * Global anti-pattern 6 in queries.md: a correlated SubPlan with a loop count
 * "in the tens of thousands".
 */
const MAX_SUBPLAN_LOOPS = 10_000;

const KNOWN = { known: true };

/** The permission predicate from queries.md, scenarios 15-19. */
const permission: FilterPredicate = {
  $all: [
    {
      $any: [
        { 'relations.ownedBy': { $in: claims } },
        { [readers]: { $in: claims } },
        { $not: { [readers]: { $exists: true } } },
      ],
    },
    { $any: [{ 'spec.custom': 'x' }, { $not: { kind: 'template' } }] },
    {
      $any: [
        { $not: { 'spec.a': { $exists: true } } },
        { $not: { 'spec.b': { $exists: true } } },
        { $not: { kind: 'template' } },
      ],
    },
  ],
};

// #region Query classification

const isSelect = (q: CapturedQuery) => /^\s*(select|with)\b/i.test(q.sql);
const isCount = (q: CapturedQuery) => /^\s*select count\(\*\)/i.test(q.sql);
const isFacets = (q: CapturedQuery) => /\bgroup by\b/i.test(q.sql);
const isPage = (q: CapturedQuery) => !isCount(q) && /\blimit\b/i.test(q.sql);
const isSetFilter = (q: CapturedQuery) => /\bcollate "C"/i.test(q.sql);

function single(
  queries: AnalyzedQuery[],
  predicate: (q: AnalyzedQuery) => boolean,
  label: string,
): AnalyzedQuery {
  const matches = queries.filter(predicate);
  if (matches.length !== 1) {
    throw new Error(
      `Expected one ${label} query, got ${matches.length}:\n${queries
        .map(q => q.sql)
        .join('\n')}`,
    );
  }
  return matches[0];
}

// #endregion

// #region Plan checks

interface AnalyzedQuery extends CapturedQuery, ExplainResult {}

/** A check returns a description of each violation it finds. */
type PlanCheck = (q: AnalyzedQuery) => string[];

const noSeqScanOn =
  (table: string): PlanCheck =>
  q =>
    seqScansOn(q.plan, table).length ? [`Seq Scan on ${table}`] : [];

const usesIndex =
  (...anyOf: string[]): PlanCheck =>
  q => {
    const used = indexesUsed(q.plan);
    return anyOf.some(i => used.includes(i))
      ? []
      : [`uses none of ${anyOf.join(', ')} (used: ${used.join(', ')})`];
  };

/**
 * A blocking sort under the LIMIT. topLevelSort does not look through
 * Gather Merge, which sits above per-worker Sort nodes in parallel plans.
 */
const noTopLevelSort: PlanCheck = q => {
  let node: PlanNode | undefined = q.plan;
  while (node && ['Limit', 'Gather Merge'].includes(node['Node Type'])) {
    node = node.Plans?.[0];
  }
  return topLevelSort(q.plan) || (node && topLevelSort(node))
    ? ['Sort at the top of the plan']
    : [];
};

const noMaterializedCte: PlanCheck = q =>
  hasMaterializedCte(q.plan) ? ['materialized CTE'] : [];

const noTempBuffers: PlanCheck = q =>
  hasTempBuffers(q.plan) ? ['temp buffers (spill to disk)'] : [];

const noPerRowSubPlans: PlanCheck = q =>
  correlatedSubPlans(q.plan)
    .filter(n => planLoops(n) >= MAX_SUBPLAN_LOOPS)
    .map(
      n =>
        `correlated ${n['Subplan Name'] ?? 'SubPlan'} ran ${planLoops(
          n,
        )} times`,
    );

const noNestedLoopWithSeqScanInner: PlanCheck = q =>
  planNodes(q.plan)
    .filter(n => n['Node Type'] === 'Nested Loop')
    .flatMap(n => (n.Plans ?? []).filter(c => isInnerSeqScan(c)))
    .map(n => `Nested Loop with Seq Scan inner on ${innerRelation(n)}`);

const noHashJoin: PlanCheck = q =>
  planNodes(q.plan).some(n => n['Node Type'] === 'Hash Join')
    ? ['Hash Join']
    : [];

/** Fails if any node produced more than `max` rows over all its loops. */
const maxNodeRows =
  (max: number): PlanCheck =>
  q =>
    planNodes(q.plan)
      .filter(n => totalRows(n) > max)
      .map(n => `${describeNode(n)} produced ${totalRows(n)} rows`);

/** Fails unless an index scan of `index` has an Index Cond matching `cond`. */
const indexCondition =
  (index: string, cond: RegExp): PlanCheck =>
  q =>
    planNodes(q.plan).some(
      n =>
        n['Index Name'] === index && cond.test(String(n['Index Cond'] ?? '')),
    )
      ? []
      : [`no Index Cond matching ${cond} on ${index}`];

/** Fails if the ordered metadata.name scan inspected `max` or more entries. */
const maxOrderedCandidates =
  (max: number): PlanCheck =>
  q =>
    planNodes(q.plan)
      .filter(
        n =>
          n['Index Name'] === 'search_key_value_entity_idx' &&
          /metadata\.name/.test(String(n['Index Cond'] ?? '')),
      )
      .filter(n => totalRows(n) >= max)
      .map(n => `ordered metadata.name scan inspected ${totalRows(n)} rows`);

const compiledToSetOperations: PlanCheck = q =>
  isSetFilter(q) ? [] : ['filter was not compiled to set operations'];

/** The global anti-patterns from the end of queries.md. */
const globalChecks = (options?: { allowTempBuffers?: boolean }) => [
  noSeqScanOn('search'),
  noSeqScanOn('relations'),
  noMaterializedCte,
  ...(options?.allowTempBuffers ? [] : [noTempBuffers]),
  noNestedLoopWithSeqScanInner,
  noPerRowSubPlans,
];

function totalRows(n: PlanNode): number {
  return Number(n['Actual Rows'] ?? 0) * planLoops(n);
}

function isInnerSeqScan(n: PlanNode): boolean {
  if (n['Parent Relationship'] !== 'Inner') {
    return false;
  }
  // Look through nodes that only cache their single child
  let node: PlanNode | undefined = n;
  while (node && ['Materialize', 'Memoize'].includes(node['Node Type'])) {
    node = node.Plans?.[0];
  }
  return (
    node?.['Node Type'] === 'Seq Scan' ||
    node?.['Node Type'] === 'Parallel Seq Scan'
  );
}

function innerRelation(n: PlanNode): string {
  return (
    planNodes(n).find(c => c['Relation Name'])?.['Relation Name'] ?? 'unknown'
  );
}

/**
 * Runs the plan checks. Pass `known: true` for a documented known issue: it
 * is reported separately in report mode, and flagged if it stops reproducing.
 */
function expectPlan(
  label: string,
  q: AnalyzedQuery | undefined,
  checks: PlanCheck[],
  options?: { known?: boolean },
) {
  if (!q) {
    throw new Error(`${label}: query was not captured`);
  }
  const planSummary = summarizePlan(q.plan);
  applyPlanCheckResult({
    test: expect.getState().currentTestName ?? label,
    label,
    violations: checks.flatMap(check => check(q)),
    known: options?.known,
    planSummary,
    details:
      `Execution time: ${q.executionTimeMs}ms\n` +
      `SQL: ${q.sql.slice(0, 2000)}\n` +
      `Plan:\n${planSummary}`,
  });
}

// #endregion

for (const databaseId of getPerformanceDatabaseIds()) {
  describePerformanceTest(`query battery on ${databaseId}`, () => {
    let knex: Knex;
    let size: number;
    let catalog: DefaultEntitiesCatalog;

    beforeAll(async () => {
      ({ knex, size } = await getPerformanceDataset(databaseId));
      catalog = new DefaultEntitiesCatalog({
        database: knex,
        logger: mockServices.logger.mock(),
      });
    }, DATASET_TIMEOUT_MS);

    afterAll(async () => {
      await knex?.destroy();
    });

    /**
     * Runs `fn` once untimed, returning the EXPLAIN ANALYZE results of every
     * select it issued, then times five more runs and records the median under
     * `name` (defaults to the test name). `fn` must be side effect free.
     */
    async function analyze<T>(
      fn: () => Promise<T>,
      name = expect.getState().currentTestName!,
    ): Promise<{ result: T; queries: AnalyzedQuery[] }> {
      // The captured run is the untimed warm-up for the timed runs below
      const { result, queries } = await captureQueries(knex, fn);
      const analyzed: AnalyzedQuery[] = [];
      // explain runs ANALYZE, which executes the statement, so selects only
      for (const q of queries.filter(isSelect)) {
        analyzed.push({ ...q, ...(await explain(knex, q)) });
      }
      await measureRepeated(name, fn, { warmups: 0 });
      return { result, queries: analyzed };
    }

    /** A timing name for one of several operations in the current test. */
    const opName = (operation: string) =>
      `${expect.getState().currentTestName} ${operation}`;

    /** Analyzes a single raw SQL statement, for the SQL-only scenarios. */
    async function analyzeSql(sql: string, bindings: Knex.RawBinding[]) {
      const { result, queries } = await analyze(() =>
        knex.raw<{ rows: Record<string, unknown>[] }>(sql, bindings),
      );
      return {
        rows: result.rows,
        q: single(queries, () => true, 'raw'),
      };
    }

    const kindNames = (
      items: Parameters<typeof entitiesResponseToObjects>[0],
    ) => entitiesResponseToObjects(items).map(e => (e as Entity).kind);

    it('1. paginated entity list (kind=component, ordered by name)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({
          filter: { kind: 'component' },
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          limit: 20,
          credentials,
        }),
      );
      expect(kindNames(result.items)).toEqual(Array(20).fill('Component'));

      expect(queries).toHaveLength(2);
      expectPlan('page', single(queries, isPage, 'page'), [
        ...globalChecks(),
        usesIndex('search_key_value_entity_idx'),
        noTopLevelSort,
      ]);
      expectPlan('count', single(queries, isCount, 'count'), globalChecks());
    });

    it('2. count query (kind=component)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({
          filter: { kind: 'component' },
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          limit: 20,
          credentials,
        }),
      );
      expect(result.totalItems).toBeGreaterThan(size / 2);

      // A Seq Scan on final_entities feeding a hash join is healthy here
      expectPlan('count', single(queries, isCount, 'count'), globalChecks());
    });

    it('3. paginated entity list (no filter)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({ limit: 20, credentials }),
      );
      expect(entitiesResponseToObjects(result.items)).toHaveLength(20);
      expect(result.totalItems).toBe(size);

      // queries.md shows the legacy entity_ref order; queryEntities now
      // orders by entity_id, so either index on final_entities is fine.
      expectPlan('page', single(queries, isPage, 'page'), [
        ...globalChecks(),
        noSeqScanOn('final_entities'),
        noTopLevelSort,
        usesIndex('final_entities_pkey', 'final_entities_entity_ref_uniq'),
      ]);
      expectPlan('count', single(queries, isCount, 'count'), globalChecks());
    });

    it('4. facets (kind=template, facet=spec.type)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.facets({
          filter: { kind: 'template' },
          facets: ['spec.type'],
          credentials,
        }),
      );
      expect(result.facets['spec.type'].map(f => f.value).sort()).toEqual([
        'library',
        'service',
        'website',
      ]);

      expectPlan('facets', single(queries, isFacets, 'facets'), [
        ...globalChecks(),
        usesIndex('search_facets_covering_idx', 'search_key_value_entity_idx'),
        noHashJoin,
      ]);
    });

    it('5. facets (kind=component, facet=spec.type), large result set', async () => {
      const { result, queries } = await analyze(() =>
        catalog.facets({
          filter: { kind: 'component' },
          facets: ['spec.type'],
          credentials,
        }),
      );
      expect(result.facets['spec.type']).toHaveLength(5);

      expectPlan('facets', single(queries, isFacets, 'facets'), globalChecks());
    });

    it('6. entity by ref lookup', async () => {
      const { result, queries } = await analyze(() =>
        catalog.entitiesBatch({ entityRefs: [hub], credentials }),
      );
      expect(entitiesResponseToObjects(result.items)).toEqual([
        expect.objectContaining({ kind: 'Component' }),
      ]);

      expectPlan(
        'lookup',
        single(queries, () => true, 'lookup'),
        [
          ...globalChecks(),
          noSeqScanOn('final_entities'),
          usesIndex('final_entities_entity_ref_uniq'),
        ],
      );
    });

    it('7. full text filter (kind=component)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({
          filter: { kind: 'component' },
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          fullTextFilter: { term: DATASET_FIXTURES.nameSubstring },
          limit: 20,
          credentials,
        }),
      );
      const names = entitiesResponseToObjects(result.items).map(
        e => e!.metadata.name,
      );
      expect(names).toHaveLength(20);
      expect(names.every(n => n.includes(DATASET_FIXTURES.nameSubstring))).toBe(
        true,
      );

      expectPlan('page', single(queries, isPage, 'page'), [
        ...globalChecks(),
        usesIndex('search_key_value_entity_idx'),
      ]);
      expectPlan('count', single(queries, isCount, 'count'), globalChecks());
    });

    it('8. relations traversal (entity ancestry)', async () => {
      const { result, queries } = await analyze(() =>
        catalog.entityAncestry(hub),
      );
      expect(result.items.length).toBeGreaterThanOrEqual(2);

      const steps = queries.filter(q =>
        q.sql.includes('refresh_state_references'),
      );
      expect(steps.length).toBe(result.items.length);
      for (const step of steps) {
        expectPlan('ancestry step', step, [
          ...globalChecks(),
          noSeqScanOn('refresh_state_references'),
          usesIndex('refresh_state_references_target_entity_ref_idx'),
          usesIndex('final_entities_entity_ref_uniq'),
        ]);
      }
    });

    it('9. stitching: incoming reference count', async () => {
      const { rows, q } = await analyzeSql(
        'SELECT count(*) AS count FROM refresh_state_references WHERE target_entity_ref = ?',
        [hub],
      );
      expect(Number(rows[0].count)).toBeGreaterThan(0);
      expectPlan('count', q, [
        ...globalChecks(),
        noSeqScanOn('refresh_state_references'),
        usesIndex('refresh_state_references_target_entity_ref_idx'),
      ]);
    });

    it('10. adversarial: unfiltered count', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({ limit: 0, credentials }),
      );
      expect(result.totalItems).toBe(size);

      // A Seq Scan on final_entities is healthy for a count of everything
      expectPlan('count', single(queries, isCount, 'count'), globalChecks());
    });

    // Known issue: query-battery/baseline.md, "Scenario 11", records a full
    // Parallel Seq Scan of both refresh_state and refresh_state_references on
    // the replica. Drop `known` once the anti-join uses the index.
    it('11. orphan detection anti-join', async () => {
      const { rows, q } = await analyzeSql(
        `SELECT refresh_state.entity_id, refresh_state.entity_ref
         FROM refresh_state
         LEFT OUTER JOIN refresh_state_references
           ON refresh_state_references.target_entity_ref = refresh_state.entity_ref
         WHERE refresh_state_references.target_entity_ref IS NULL
         LIMIT 100`,
        [],
      );
      // Every generated entity has a parent reference
      expect(rows).toEqual([]);
      expectPlan(
        'anti-join',
        q,
        [
          ...globalChecks(),
          noSeqScanOn('refresh_state_references'),
          usesIndex('refresh_state_references_target_entity_ref_idx'),
        ],
        KNOWN,
      );
    });

    // Known issue: query-battery/baseline.md, "Scenario 12", records that the
    // disjunction can't drive the query from either selective branch, so the
    // ordered name scan runs correlated subplans per entity. Drop
    // `known` once the branches drive the plan.
    it('12. ordered disjunction with selective branches', async () => {
      const workflows: FilterPredicate = {
        kind: 'subcomponent',
        'spec.type': 'workflow',
        'relations.partOf': hub,
      };
      const datasets: FilterPredicate = {
        kind: 'api',
        'spec.type': 'dataset',
        'relations.apiProvidedBy': hub,
      };
      const run = (filter: FilterPredicate, name?: string) =>
        analyze(
          () =>
            catalog.queryEntities({
              filter,
              orderFields: [{ field: 'metadata.name', order: 'asc' }],
              limit: 2000,
              totalItems: 'exclude',
              credentials,
            }),
          name,
        );

      const testName = expect.getState().currentTestName!;
      const workflowBranch = await run(workflows, `${testName} workflows only`);
      const datasetBranch = await run(datasets, `${testName} datasets only`);
      const combined = await run({ $any: [workflows, datasets] });

      const count = (r: typeof combined) =>
        entitiesResponseToObjects(r.result.items).length;
      expect(count(workflowBranch)).toBeGreaterThan(0);
      expect(count(datasetBranch)).toBeGreaterThan(0);
      expect(count(combined)).toBe(
        count(workflowBranch) + count(datasetBranch),
      );

      for (const [label, r] of [
        ['workflows only', workflowBranch],
        ['datasets only', datasetBranch],
      ] as const) {
        expectPlan(label, single(r.queries, isPage, 'page'), [
          ...globalChecks(),
          noSeqScanOn('final_entities'),
        ]);
      }
      expectPlan(
        'combined',
        single(combined.queries, isPage, 'page'),
        [
          ...globalChecks(),
          noSeqScanOn('final_entities'),
          // "Tens of thousands of ordered candidates inspected to return
          // approximately 2,000 rows"
          maxOrderedCandidates(10_000),
        ],
        KNOWN,
      );
    });

    /**
     * The number of api entities of type dataset, and the page size the deep
     * page scenarios use: a full page of 10,000 when the data allows it, but
     * never more than half of the matches, so the cursor always skips most of
     * them. queries.md requires the cursor to skip a substantial portion and
     * leave a full page; its fixed 'e' boundary assumes the replica's data.
     */
    async function deepPageShape() {
      const datasetFilter = (q: Knex.QueryBuilder) =>
        q
          .whereNotNull('final_entities.final_entity')
          .whereExists(sub =>
            sub
              .from('search as s')
              .select(knex.raw('1'))
              .whereRaw('s.entity_id = final_entities.entity_id')
              .where({ 's.key': 'kind', 's.value': 'api' }),
          )
          .whereExists(sub =>
            sub
              .from('search as s')
              .select(knex.raw('1'))
              .whereRaw('s.entity_id = final_entities.entity_id')
              .where({ 's.key': 'spec.type', 's.value': 'dataset' }),
          );
      const [{ count }] = await datasetFilter(
        knex('final_entities').count({ count: '*' }),
      );
      const matches = Number(count);
      const pageSize = Math.min(10_000, Math.floor(matches / 2));
      // The boundary row is followed by exactly pageSize + 1 matches
      const boundaryOffset = matches - pageSize - 2;
      return { datasetFilter, pageSize, boundaryOffset };
    }

    const datasetQuery: FilterPredicate = {
      kind: 'api',
      'spec.type': 'dataset',
    };

    it('13. deep dataset page with default id ordering', async () => {
      const { datasetFilter, pageSize, boundaryOffset } = await deepPageShape();
      const [boundary] = await datasetFilter(
        knex('final_entities').select('final_entities.entity_id'),
      )
        .orderBy('final_entities.entity_id')
        .offset(boundaryOffset)
        .limit(1);

      const cursor: Cursor = {
        orderFields: [],
        orderFieldValues: [boundary.entity_id],
        query: datasetQuery,
        isPrevious: false,
        totalItems: 0,
      };
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({ cursor, limit: pageSize, credentials }),
      );
      const ids = entitiesResponseToObjects(result.items).map(
        e => e!.metadata.uid!,
      );
      expect(ids).toHaveLength(pageSize);
      expect(result.pageInfo.nextCursor).toBeDefined();

      expectPlan('page', single(queries, isPage, 'page'), [
        ...globalChecks(),
        noTopLevelSort,
        // The cursor must be an index range condition, not a filter
        indexCondition('final_entities_pkey', /\bentity_id\)?(::text)? > /),
      ]);
    });

    // Known issue: query-battery/baseline.md, "Scenario 14: ordered scan with
    // a late cursor filter", records that the cursor is a filter rather than
    // an index range condition. Drop `known` once it is a range.
    it('14. deep dataset page ordered by name', async () => {
      const { datasetFilter, pageSize, boundaryOffset } = await deepPageShape();
      const [boundary] = await datasetFilter(
        knex('final_entities')
          .innerJoin('search', 'search.entity_id', 'final_entities.entity_id')
          .where('search.key', 'metadata.name')
          .whereNotNull('search.value')
          .select('search.value', 'final_entities.entity_id'),
      )
        .orderBy([
          { column: 'search.value' },
          { column: 'final_entities.entity_id' },
        ])
        .offset(boundaryOffset)
        .limit(1);

      const cursor: Cursor = {
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        orderFieldValues: [boundary.value, boundary.entity_id],
        query: datasetQuery,
        isPrevious: false,
        totalItems: 0,
      };
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({ cursor, limit: pageSize, credentials }),
      );
      expect(entitiesResponseToObjects(result.items)).toHaveLength(pageSize);
      expect(result.pageInfo.nextCursor).toBeDefined();

      expectPlan(
        'page',
        single(queries, isPage, 'page'),
        [
          ...globalChecks(),
          noTopLevelSort,
          // The cursor must be an index range condition, not a filter
          indexCondition(
            'search_key_value_entity_idx',
            /\bvalue\)?(::text)? > /,
          ),
        ],
        KNOWN,
      );
    });

    // Scenarios 15-19: conditional permission filters. On Postgres, facets
    // and count queries compile these filters into set operations on entity
    // ids, while page queries keep the correlated form, so each scenario
    // checks both variants.

    // queries.md: "For those queries [facets and counts in 15-18], a bounded
    // spill of an intermediate set at a small work_mem is acceptable."
    const setQueryChecks = [
      ...globalChecks({ allowTempBuffers: true }),
      compiledToSetOperations,
    ];

    const permissionPageChecks = [
      ...globalChecks(),
      usesIndex('search_key_value_entity_idx'),
      noTopLevelSort,
    ];

    it('15. permission-filtered list, count and kind facets', async () => {
      const facets = await analyze(
        () =>
          catalog.facets({ filter: permission, facets: ['kind'], credentials }),
        opName('facets'),
      );
      expect(facets.result.facets.kind.length).toBeGreaterThan(5);
      expectPlan(
        'facets',
        single(facets.queries, isFacets, 'facets'),
        setQueryChecks,
      );

      const list = await analyze(
        () =>
          catalog.queryEntities({
            filter: permission,
            orderFields: [{ field: 'metadata.name', order: 'asc' }],
            limit: 20,
            credentials,
          }),
        opName('list'),
      );
      expect(entitiesResponseToObjects(list.result.items)).toHaveLength(20);
      expectPlan(
        'page',
        single(list.queries, isPage, 'page'),
        permissionPageChecks,
      );
      expectPlan(
        'count',
        single(list.queries, isCount, 'count'),
        setQueryChecks,
      );
    });

    it('16. permission filter with a selective request filter', async () => {
      const filter: FilterPredicate = {
        $all: [permission, { kind: 'component' }],
      };
      const facets = await analyze(
        () => catalog.facets({ filter, facets: ['spec.type'], credentials }),
        opName('facets'),
      );
      expect(facets.result.facets['spec.type']).toHaveLength(5);
      expectPlan(
        'facets',
        single(facets.queries, isFacets, 'facets'),
        setQueryChecks,
      );

      const list = await analyze(
        () =>
          catalog.queryEntities({
            filter,
            orderFields: [{ field: 'metadata.name', order: 'asc' }],
            limit: 20,
            credentials,
          }),
        opName('list'),
      );
      expect(kindNames(list.result.items)).toEqual(Array(20).fill('Component'));
      expectPlan(
        'page',
        single(list.queries, isPage, 'page'),
        permissionPageChecks,
      );
      expectPlan(
        'count',
        single(list.queries, isCount, 'count'),
        setQueryChecks,
      );
    });

    it('17. permission-filtered facets for a rare facet key', async () => {
      const { result, queries } = await analyze(() =>
        catalog.facets({ filter: permission, facets: [readers], credentials }),
      );
      expect(result.facets[readers].length).toBeGreaterThan(0);

      expectPlan('facets', single(queries, isFacets, 'facets'), [
        ...setQueryChecks,
        usesIndex('search_facets_covering_idx'),
        noSeqScanOn('final_entities'),
      ]);
    });

    it('18. negated disjunction', async () => {
      const filter: FilterPredicate = {
        $not: {
          $any: [
            { 'relations.ownedBy': { $in: claims } },
            { [readers]: { $exists: true } },
          ],
        },
      };
      const facets = await analyze(
        () => catalog.facets({ filter, facets: ['kind'], credentials }),
        opName('facets'),
      );
      expect(facets.result.facets.kind.length).toBeGreaterThan(5);
      expectPlan(
        'facets',
        single(facets.queries, isFacets, 'facets'),
        setQueryChecks,
      );

      const list = await analyze(
        () =>
          catalog.queryEntities({
            filter,
            orderFields: [{ field: 'metadata.name', order: 'asc' }],
            limit: 20,
            credentials,
          }),
        opName('list'),
      );
      expect(entitiesResponseToObjects(list.result.items)).toHaveLength(20);
      expectPlan(
        'page',
        single(list.queries, isPage, 'page'),
        permissionPageChecks,
      );
      expectPlan(
        'count',
        single(list.queries, isCount, 'count'),
        setQueryChecks,
      );
    });

    it('19. paginated query with a large $in under $any', async () => {
      const { result, queries } = await analyze(() =>
        catalog.queryEntities({
          filter: {
            $any: [
              {
                kind: { $in: ['component', 'api', 'resource', 'subcomponent'] },
              },
              { 'relations.ownedBy': { $in: claims } },
            ],
          },
          orderFields: [{ field: 'metadata.name', order: 'asc' }],
          limit: 20,
          credentials,
        }),
      );
      expect(entitiesResponseToObjects(result.items)).toHaveLength(20);

      expectPlan('page', single(queries, isPage, 'page'), [
        ...permissionPageChecks,
        // LIMIT must stop the ordered walk early, rather than a pre-built set
        // of every entity in the broad branch being hashed up front
        maxNodeRows(1_000),
      ]);
      // queries.md only allows spills for the facets and counts of 15-18
      expectPlan('count', single(queries, isCount, 'count'), [
        ...globalChecks(),
        compiledToSetOperations,
      ]);
    });
  });
}
