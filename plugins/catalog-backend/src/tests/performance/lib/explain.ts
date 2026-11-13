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

import { Knex } from 'knex';

/** A captured query, as emitted by knex's `query` event. */
export interface CapturedQuery {
  sql: string;
  bindings: readonly unknown[];
}

/** A node of a Postgres JSON explain plan. */
export interface PlanNode {
  'Node Type': string;
  'Relation Name'?: string;
  'Index Name'?: string;
  'Parent Relationship'?: string;
  'Subplan Name'?: string;
  'Temp Read Blocks'?: number;
  'Temp Written Blocks'?: number;
  'Shared Hit Blocks'?: number;
  'Shared Read Blocks'?: number;
  'Actual Total Time'?: number;
  Plans?: PlanNode[];
  [key: string]: unknown;
}

/** The result of `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`. */
export interface ExplainResult {
  plan: PlanNode;
  planningTimeMs: number;
  executionTimeMs: number;
}

/**
 * Runs `fn` and collects every query knex executes on `knex` while it runs.
 * Includes transaction control statements and the like; filter on `sql` if
 * you only want selects.
 */
export async function captureQueries<T>(
  knex: Knex,
  fn: () => Promise<T>,
): Promise<{ result: T; queries: CapturedQuery[] }> {
  const queries: CapturedQuery[] = [];
  const listener = (q: { sql: string; bindings?: readonly unknown[] }) => {
    queries.push({ sql: q.sql, bindings: q.bindings ?? [] });
  };
  knex.on('query', listener);
  try {
    const result = await fn();
    return { result, queries };
  } finally {
    knex.removeListener('query', listener);
  }
}

/**
 * Runs `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` for a captured query. Note
 * that ANALYZE executes the query, so only pass side-effect free statements.
 */
export async function explain(
  knex: Knex,
  q: CapturedQuery,
): Promise<ExplainResult> {
  // Use the raw driver connection since captured sql uses positional $n
  // placeholders that knex.raw would try to interpret.
  const connection = await knex.client.acquireConnection();
  try {
    const res = await connection.query({
      text: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${q.sql}`,
      values: [...q.bindings],
    });
    const root = res.rows[0]['QUERY PLAN'][0];
    return {
      plan: root.Plan,
      planningTimeMs: root['Planning Time'],
      executionTimeMs: root['Execution Time'],
    };
  } finally {
    knex.client.releaseConnection(connection);
  }
}

/** Returns every node in the plan, depth first, including the root. */
export function planNodes(plan: PlanNode): PlanNode[] {
  return [plan, ...(plan.Plans ?? []).flatMap(planNodes)];
}

/** Sequential scans (parallel or not) on the given table. */
export function seqScansOn(plan: PlanNode, table: string): PlanNode[] {
  return planNodes(plan).filter(
    n =>
      (n['Node Type'] === 'Seq Scan' ||
        n['Node Type'] === 'Parallel Seq Scan') &&
      n['Relation Name'] === table,
  );
}

/** The names of all indexes used anywhere in the plan. */
export function indexesUsed(plan: PlanNode): string[] {
  return [
    ...new Set(
      planNodes(plan)
        .map(n => n['Index Name'])
        .filter((n): n is string => Boolean(n)),
    ),
  ];
}

/** True if any node read or wrote temp blocks, i.e. spilled to disk. */
export function hasTempBuffers(plan: PlanNode): boolean {
  return planNodes(plan).some(
    n =>
      (n['Temp Read Blocks'] ?? 0) > 0 || (n['Temp Written Blocks'] ?? 0) > 0,
  );
}

/** True if the plan scans a materialized CTE. */
export function hasMaterializedCte(plan: PlanNode): boolean {
  return planNodes(plan).some(n => n['Node Type'] === 'CTE Scan');
}

/**
 * Correlated sub plans, i.e. sub plans that are re-evaluated per row. Plans
 * that are evaluated once (InitPlan) are not included.
 */
export function correlatedSubPlans(plan: PlanNode): PlanNode[] {
  return planNodes(plan).filter(n => n['Parent Relationship'] === 'SubPlan');
}

/**
 * True if the plan has a Sort at the top, ignoring pass-through nodes such as
 * Limit that only have a single child. Sorting the entire candidate set before
 * applying the limit shows up this way.
 */
export function topLevelSort(plan: PlanNode): boolean {
  const passThrough = new Set(['Limit', 'Result', 'Unique', 'Gather']);
  let node: PlanNode | undefined = plan;
  while (node && passThrough.has(node['Node Type'])) {
    node = node.Plans?.[0];
  }
  return (
    node?.['Node Type'] === 'Sort' || node?.['Node Type'] === 'Incremental Sort'
  );
}

/** The number of times a node was executed. */
export function planLoops(n: PlanNode): number {
  return Number(n['Actual Loops'] ?? 1);
}

/** A short description of a node, such as `Index Scan on search using idx`. */
export function describeNode(n: PlanNode): string {
  return [
    n['Node Type'],
    n['Subplan Name'] ? `(${n['Subplan Name']})` : '',
    n['Relation Name'] ? `on ${n['Relation Name']}` : '',
    n['Index Name'] ? `using ${n['Index Name']}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** A compact, indented plan for failure messages and reports. */
export function summarizePlan(n: PlanNode, depth = 0): string {
  const cond = n['Index Cond'] ?? n.Filter;
  const line = `${'  '.repeat(depth)}${describeNode(n)} (rows=${
    n['Actual Rows']
  } loops=${planLoops(n)}${cond ? ` cond=${String(cond).slice(0, 160)}` : ''})`;
  return [line, ...(n.Plans ?? []).map(c => summarizePlan(c, depth + 1))].join(
    '\n',
  );
}

/**
 * The number of shared buffers the plan touched, from cache or from disk. The
 * root node's counts include everything below it. Unlike timings, this does
 * not depend on what happens to be cached, or on how busy the machine is.
 */
export function sharedBuffers(plan: PlanNode): number {
  return (plan['Shared Hit Blocks'] ?? 0) + (plan['Shared Read Blocks'] ?? 0);
}
