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
import type { TestDatabaseId } from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { ForwardedError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { randomBytes } from 'node:crypto';
import knexFactory, { Knex } from 'knex';
import { buildEntitySearch } from '../../../database/operations/stitcher/buildEntitySearch';

/**
 * Bump when the generated data changes in a way the size marker can't see.
 * CI additionally keys its snapshot on a hash of this file.
 */
export const DATASET_VERSION = 'v2';
const DEFAULT_DATASET_SIZE = 500_000;
const CHUNK_SIZE = 2_000;
const SEED = 20240607;
const PROVIDER_KEY = 'perf-provider';

/**
 * The seeded database that clones are made from. Nothing connects to it
 * while tests run, since Postgres can only copy an idle template.
 */
export const TEMPLATE_DATABASE = 'catalog_perf_template';
/** The read-only copy of the template that read-only suites query. */
export const DATASET_DATABASE = 'catalog_perf_dataset';
/** Prefix of the per-suite copies made by {@link cloneDataset}. */
export const CLONE_DATABASE_PREFIX = 'catalog_perf_clone_';

const PRELOAD_HINT =
  'Preload it before running the tests with `node --require @backstage/cli/config/nodeTransform.cjs plugins/catalog-backend/src/tests/performance/lib/preloadDataset.ts`, using the same PERFORMANCE_DATASET_SIZE and PERFORMANCE_DATABASE_IDS';

/** Names and values that scenarios in the query battery rely on. */
export const DATASET_FIXTURES = {
  /** A component that many subcomponents and apis relate to (scenario 12). */
  hubComponentRef: 'component:default/content_analytics_dbt',
  /** The rare annotation used by the permission scenarios (15-19). */
  readersAnnotation: 'example.com/readers',
  /** Claims for a user who owns some entities and is listed as a reader. */
  claims: [
    'user:default/user-1',
    'group:default/group-1',
    'group:default/group-2',
  ],
  /** Substring that appears in about 1% of component names (scenario 7). */
  nameSubstring: 'player',
};

/**
 * The database ids the performance suites should run against, from the
 * comma separated `PERFORMANCE_DATABASE_IDS`. Defaults to both supported
 * Postgres versions.
 */
export function getPerformanceDatabaseIds(): TestDatabaseId[] {
  const raw = process.env.PERFORMANCE_DATABASE_IDS;
  if (!raw?.trim()) {
    return ['POSTGRES_14', 'POSTGRES_18'];
  }
  const ids = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const invalid = ids.filter(id => !/^POSTGRES_\d+$/.test(id));
  if (invalid.length) {
    throw new Error(
      `PERFORMANCE_DATABASE_IDS may only contain Postgres ids, got ${invalid.join(
        ', ',
      )}`,
    );
  }
  return ids as TestDatabaseId[];
}

export function getDatasetSize(): number {
  const raw = process.env.PERFORMANCE_DATASET_SIZE;
  if (!raw) {
    return DEFAULT_DATASET_SIZE;
  }
  const size = Number(raw);
  if (!Number.isInteger(size) || size < 1000) {
    throw new Error(
      `PERFORMANCE_DATASET_SIZE must be an integer of at least 1000, got ${raw}`,
    );
  }
  return size;
}

/**
 * The connection to the Postgres server for `databaseId`, from the same
 * `BACKSTAGE_TEST_DATABASE_<ID>_CONNECTION_STRING` variable that
 * `TestDatabases` reads, pointed at `database`.
 */
export function serverConnection(
  databaseId: TestDatabaseId,
  database: string,
): Knex.PgConnectionConfig {
  const name = `BACKSTAGE_TEST_DATABASE_${databaseId.replace(
    '_',
    '',
  )}_CONNECTION_STRING`;
  const connectionString = process.env[name];
  if (!connectionString) {
    throw new Error(
      `The ${databaseId} performance dataset needs ${name}, the connection string of the Postgres server that holds it`,
    );
  }
  return { ...parseConnectionString(connectionString), database };
}

const datasets = new Map<string, Promise<{ knex: Knex; size: number }>>();

/**
 * Returns a connection to the preloaded, read-only dataset database for
 * `databaseId`. Do not mutate it; use {@link cloneDataset} for that.
 *
 * Fails if the dataset hasn't been preloaded with the current generator and
 * `PERFORMANCE_DATASET_SIZE`; see `preloadDataset.ts`.
 */
export function getPerformanceDataset(
  databaseId: TestDatabaseId = getPerformanceDatabaseIds()[0],
): Promise<{ knex: Knex; size: number }> {
  let dataset = datasets.get(databaseId);
  if (!dataset) {
    dataset = openDataset(databaseId);
    datasets.set(databaseId, dataset);
  }
  return dataset;
}

async function openDataset(databaseId: TestDatabaseId) {
  const size = getDatasetSize();
  const knex = knexFactory({
    client: 'pg',
    connection: serverConnection(databaseId, DATASET_DATABASE),
  });
  try {
    await assertDatasetMarker(knex, size, `${databaseId} ${DATASET_DATABASE}`);
  } catch (error) {
    await knex.destroy();
    throw error;
  }
  return { knex, size };
}

/**
 * Reads the dataset marker, or returns undefined if the database has none.
 * Throws if the database can't be reached.
 */
export async function readDatasetMarker(
  knex: Knex,
): Promise<{ version: string; entity_count: number } | undefined> {
  if (!(await knex.schema.hasTable('perf_dataset_meta'))) {
    return undefined;
  }
  return knex('perf_dataset_meta').first();
}

/** Whether `marker` describes a dataset of `size` from this generator. */
export function markerMatches(
  marker: { version: string; entity_count: number } | undefined,
  size: number,
): boolean {
  return marker?.version === DATASET_VERSION && marker.entity_count === size;
}

async function assertDatasetMarker(knex: Knex, size: number, label: string) {
  let marker;
  try {
    marker = await readDatasetMarker(knex);
  } catch (error) {
    throw new ForwardedError(
      `Could not read the ${label} performance dataset. ${PRELOAD_HINT}`,
      error,
    );
  }
  if (!markerMatches(marker, size)) {
    throw new Error(
      `The ${label} performance dataset is ${
        marker
          ? `${marker.version} with ${marker.entity_count} entities`
          : 'not seeded'
      }, expected ${DATASET_VERSION} with ${size} entities. ${PRELOAD_HINT}`,
    );
  }
}

/**
 * Makes a private copy of the template database on the server that `knex`
 * (a connection from {@link getPerformanceDataset}) points at. The returned
 * connection drops the copy when destroyed.
 *
 * Safe to call from parallel workers: the template is never connected to
 * while tests run, and Postgres allows concurrent copies of one template. No
 * sessions are terminated; if the template is in use, this fails instead.
 */
export async function cloneDataset(knex: Knex): Promise<Knex> {
  const config = connectionConfig(knex);
  // The random part avoids clashes with copies left behind by crashed runs
  const target = `${CLONE_DATABASE_PREFIX}${process.pid}_${randomBytes(
    4,
  ).toString('hex')}`;

  const admin = knexFactory({
    client: 'pg',
    connection: { ...config, database: 'postgres' },
  });
  try {
    await createDatabaseFromTemplate(admin, target, TEMPLATE_DATABASE);
  } catch (error) {
    throw new ForwardedError(
      `Could not copy ${TEMPLATE_DATABASE} to ${target}; it must exist and have no open connections. ${PRELOAD_HINT}`,
      error,
    );
  } finally {
    await admin.destroy();
  }

  const clone = knexFactory({
    client: 'pg',
    connection: { ...config, database: target },
  });
  const destroy = clone.destroy.bind(clone);
  const destroyAndDrop = async () => {
    await destroy();
    const dropper = knexFactory({
      client: 'pg',
      connection: { ...config, database: 'postgres' },
    });
    try {
      await dropper.raw('DROP DATABASE IF EXISTS ?? WITH (FORCE)', [target]);
    } finally {
      await dropper.destroy();
    }
  };
  // The destroy property of a knex instance is read-only, so wrap it
  return new Proxy(clone, {
    get: (obj, prop) =>
      prop === 'destroy' ? destroyAndDrop : Reflect.get(obj, prop),
  });
}

/**
 * Runs `CREATE DATABASE target TEMPLATE source`. On Postgres 15 and later
 * this uses the file copy strategy, which is much faster for a large
 * template than the default of copying through the WAL.
 */
export async function createDatabaseFromTemplate(
  admin: Knex,
  target: string,
  source: string,
) {
  const {
    rows: [{ server_version_num: version }],
  } = await admin.raw<{ rows: { server_version_num: string }[] }>(
    'SHOW server_version_num',
  );
  const strategy = Number(version) >= 150000 ? ' STRATEGY FILE_COPY' : '';
  await admin.raw(`CREATE DATABASE ?? TEMPLATE ??${strategy}`, [
    target,
    source,
  ]);
}

function parseConnectionString(
  connectionString: string,
): Knex.PgConnectionConfig {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
  };
}

function connectionConfig(knex: Knex): Knex.PgConnectionConfig {
  const connection = knex.client.config.connection;
  if (typeof connection === 'string') {
    return parseConnectionString(connection);
  }
  // Knex hides the password from enumeration, so pick fields explicitly
  const c = connection as Knex.PgConnectionConfig;
  return {
    host: c.host,
    port: c.port ? Number(c.port) : undefined,
    user: c.user,
    password: c.password as string | undefined,
    database: c.database,
    ssl: c.ssl,
  };
}

/**
 * Replaces the catalog data in `knex` with a generated dataset of `size`
 * entities, and records the dataset marker. Expects migrations to have run.
 */
export async function seedDataset(knex: Knex, size: number) {
  await knex.raw(
    'CREATE TABLE IF NOT EXISTS perf_dataset_meta (version text NOT NULL, entity_count int NOT NULL)',
  );
  await knex.transaction(async trx => {
    await trx.raw('SET LOCAL synchronous_commit = off');
    await trx('perf_dataset_meta').delete();
    await trx.raw(
      'TRUNCATE refresh_state, final_entities, search, relations, refresh_state_references, stitch_queue CASCADE',
    );
    for (const chunk of generateChunks(size)) {
      await insertChunk(trx, chunk);
    }
    await trx('perf_dataset_meta').insert({
      version: DATASET_VERSION,
      entity_count: size,
    });
  });
}

// #region Generator

interface GeneratedEntity {
  id: string;
  entity: Entity;
  /** Parent in refresh_state_references. */
  parent: { sourceKey?: string; sourceEntityRef?: string };
  relations: { type: string; target: string }[];
}

/** mulberry32, a small seeded PRNG. */
function createRandom(seed: number) {
  let a = seed;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (max: number) => Math.floor(next() * max),
    pick: <T>(items: readonly T[]) => items[Math.floor(next() * items.length)],
    chance: (p: number) => next() < p,
  };
}

type Random = ReturnType<typeof createRandom>;

function randomUuid(random: Random): string {
  const hex = (n: number) =>
    Array.from({ length: n }, () => random.int(16).toString(16)).join('');
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${'89ab'[random.int(4)]}${hex(
    3,
  )}-${hex(12)}`;
}

const COMPONENT_TYPES = ['service', 'website', 'library', 'job', 'tool'];
const API_TYPES = ['openapi', 'grpc', 'graphql', 'dataset', 'asyncapi'];
const RESOURCE_TYPES = ['database', 'queue', 'bucket', 'cache'];
const TEMPLATE_TYPES = ['service', 'website', 'library'];
const LIFECYCLES = ['production', 'experimental', 'deprecated'];
const TAGS = ['java', 'kotlin', 'typescript', 'python', 'go', 'data', 'ml'];

/** Entity counts per kind, laid out in this order by index. */
function layout(size: number) {
  const groups = Math.max(5, Math.floor(size / 500));
  const users = Math.max(10, Math.floor(size / 100));
  const systems = Math.max(5, Math.floor(size / 200));
  const locations = Math.max(2, Math.floor(size / 2000));
  const fixed = groups + users + systems + locations + 1; // +1 hub
  const rest = size - fixed;
  // The replica has 14 templates among about 739K entities. Keeping that
  // ratio keeps kind=template selective, so its facets plan (scenario 4)
  // matches the replica's. At least one template of each type.
  const templates = Math.max(
    TEMPLATE_TYPES.length,
    Math.round((rest * 14) / 739_000),
  );
  const apis = Math.floor(rest * 0.15);
  const resources = Math.floor(rest * 0.1);
  const subcomponents = Math.floor(rest * 0.1);
  const components =
    rest - templates - apis - resources - subcomponents; /* ~65% */
  return {
    groups,
    users,
    systems,
    locations,
    templates,
    apis,
    resources,
    subcomponents,
    components,
  };
}

function* generateChunks(size: number): Generator<GeneratedEntity[]> {
  const random = createRandom(SEED);
  const l = layout(size);
  const ref = (kind: string, name: string) =>
    stringifyEntityRef({ kind, namespace: 'default', name });
  const owner = () =>
    random.chance(0.9)
      ? ref('group', `group-${random.int(l.groups)}`)
      : ref('user', `user-${random.int(l.users)}`);
  const hub = DATASET_FIXTURES.hubComponentRef;
  // Every 100th component name contains the substring scenario 7 searches for
  const componentName = (n: number) =>
    n % 100 === 7 ? `svc-${n}-${DATASET_FIXTURES.nameSubstring}` : `svc-${n}`;
  const component = () =>
    ref('component', componentName(random.int(l.components)));

  const base = (
    kind: string,
    name: string,
    spec: JsonObject | undefined,
  ): Entity => {
    const annotations: Record<string, string> = {
      'backstage.io/managed-by-location': `url:https://example.com/repo-${random.int(
        5000,
      )}/blob/main/catalog-info.yaml`,
      'backstage.io/managed-by-origin-location': `url:https://example.com/repo-${random.int(
        5000,
      )}/blob/main/catalog-info.yaml`,
    };
    if (random.chance(0.005)) {
      // Rare annotation, so that "has readers" is selective
      annotations[DATASET_FIXTURES.readersAnnotation] = random.chance(0.5)
        ? ref('group', `group-${random.int(l.groups)}`)
        : ref('user', `user-${random.int(l.users)}`);
    }
    const tags = Array.from(new Set([random.pick(TAGS), random.pick(TAGS)]));
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind,
      metadata: {
        name,
        namespace: 'default',
        description: `Generated ${kind} ${name} used for catalog performance testing.`,
        annotations,
        labels: { tier: String(random.int(4)) },
        tags,
      },
      ...(spec ? { spec } : {}),
    };
  };

  // Ranges of entities by kind, in generation order
  const plan: { kind: string; count: number }[] = [
    { kind: 'location', count: l.locations },
    { kind: 'group', count: l.groups },
    { kind: 'user', count: l.users },
    { kind: 'system', count: l.systems },
    { kind: 'component', count: l.components },
    { kind: 'hub', count: 1 },
    { kind: 'api', count: l.apis },
    { kind: 'resource', count: l.resources },
    { kind: 'subcomponent', count: l.subcomponents },
    { kind: 'template', count: l.templates },
  ];

  let chunk: GeneratedEntity[] = [];
  for (const { kind, count } of plan) {
    for (let i = 0; i < count; i++) {
      const id = randomUuid(random);
      const relations: GeneratedEntity['relations'] = [];
      let parent: GeneratedEntity['parent'] = {
        sourceEntityRef: ref('location', `location-${random.int(l.locations)}`),
      };
      let entity: Entity;

      switch (kind) {
        case 'location':
          entity = base('Location', `location-${i}`, {
            type: 'url',
            target: `https://example.com/repo-${i}/catalog-info.yaml`,
          });
          parent = { sourceKey: PROVIDER_KEY };
          break;
        case 'group':
          entity = base('Group', `group-${i}`, {
            type: 'team',
            children: [],
          });
          break;
        case 'user':
          entity = base('User', `user-${i}`, {
            profile: { displayName: `User ${i}` },
          });
          break;
        case 'system':
          entity = base('System', `system-${i}`, { owner: owner() });
          relations.push({ type: 'ownedBy', target: owner() });
          break;
        case 'component': {
          const finalName = componentName(i);
          entity = base('Component', finalName, {
            type: random.pick(COMPONENT_TYPES),
            lifecycle: random.pick(LIFECYCLES),
            owner: owner(),
          });
          relations.push(
            { type: 'ownedBy', target: owner() },
            {
              type: 'partOf',
              target: ref('system', `system-${random.int(l.systems)}`),
            },
          );
          if (random.chance(0.5)) {
            relations.push({
              type: 'dependsOn',
              target: ref('resource', `res-${random.int(l.resources)}`),
            });
          }
          if (random.chance(0.3)) {
            relations.push({ type: 'dependsOn', target: component() });
          }
          break;
        }
        case 'hub':
          entity = base('Component', 'content_analytics_dbt', {
            type: 'service',
            lifecycle: 'production',
            owner: ref('group', 'group-1'),
          });
          relations.push({ type: 'ownedBy', target: ref('group', 'group-1') });
          break;
        case 'api': {
          const providedBy = random.chance(0.02) ? hub : component();
          entity = base('API', `api-${i}`, {
            type: random.pick(API_TYPES),
            lifecycle: random.pick(LIFECYCLES),
            owner: owner(),
          });
          relations.push(
            { type: 'ownedBy', target: owner() },
            { type: 'apiProvidedBy', target: providedBy },
          );
          break;
        }
        case 'resource':
          entity = base('Resource', `res-${i}`, {
            type: random.pick(RESOURCE_TYPES),
            owner: owner(),
          });
          relations.push({ type: 'ownedBy', target: owner() });
          break;
        case 'subcomponent': {
          const partOf = random.chance(0.02) ? hub : component();
          entity = base('SubComponent', `sub-${i}`, {
            type: random.chance(0.5) ? 'workflow' : 'task',
            lifecycle: random.pick(LIFECYCLES),
            owner: owner(),
          });
          relations.push(
            { type: 'ownedBy', target: owner() },
            { type: 'partOf', target: partOf },
          );
          break;
        }
        default: {
          const spec: JsonObject = {
            type: TEMPLATE_TYPES[i % TEMPLATE_TYPES.length],
            owner: owner(),
          };
          if (random.chance(0.3)) spec.custom = 'x';
          if (random.chance(0.3)) spec.a = 'a';
          if (random.chance(0.3)) spec.b = 'b';
          entity = base('Template', `template-${i}`, spec);
          relations.push({ type: 'ownedBy', target: owner() });
        }
      }

      chunk.push({ id, entity, parent, relations });
      if (chunk.length >= CHUNK_SIZE) {
        yield chunk;
        chunk = [];
      }
    }
  }
  if (chunk.length) {
    yield chunk;
  }
}

const INVERSE_RELATIONS: Record<string, string> = {
  ownedBy: 'ownerOf',
  partOf: 'hasPart',
  apiProvidedBy: 'providesApi',
  dependsOn: 'dependencyOf',
};

async function insertChunk(trx: Knex, chunk: GeneratedEntity[]) {
  const refreshState: unknown[] = [];
  const finalEntities: unknown[] = [];
  const search: unknown[] = [];
  const relations: unknown[] = [];
  const references: unknown[] = [];

  for (const { id, entity, parent, relations: rels } of chunk) {
    const entityRef = stringifyEntityRef(entity);
    const unprocessed = JSON.stringify(entity);

    // The stitched entity carries uid, etag and relations
    const finalEntity: Entity = {
      ...entity,
      metadata: { ...entity.metadata, uid: id, etag: id.slice(0, 16) },
      relations: rels.map(r => ({ type: r.type, targetRef: r.target })),
    };

    refreshState.push({
      entity_id: id,
      entity_ref: entityRef,
      unprocessed_entity: unprocessed,
      processed_entity: JSON.stringify(finalEntity),
      unprocessed_hash: id.slice(0, 16),
      result_hash: id.slice(0, 16),
      location_key: PROVIDER_KEY,
    });
    finalEntities.push({
      entity_id: id,
      entity_ref: entityRef,
      final_entity: JSON.stringify(finalEntity),
      hash: id.slice(0, 16),
    });
    for (const row of buildEntitySearch(id, finalEntity)) {
      search.push({
        entity_id: row.entity_id,
        key: row.key,
        original_value: row.original_value,
        value: row.value,
      });
    }
    for (const r of rels) {
      relations.push({
        originating_entity_id: id,
        source_entity_ref: entityRef,
        target_entity_ref: r.target,
        type: r.type,
      });
      // Bi-directional relations are emitted by the same entity
      relations.push({
        originating_entity_id: id,
        source_entity_ref: r.target,
        target_entity_ref: entityRef,
        type: INVERSE_RELATIONS[r.type],
      });
    }
    references.push({
      source_key: parent.sourceKey ?? null,
      source_entity_ref: parent.sourceEntityRef ?? null,
      target_entity_ref: entityRef,
    });
  }

  // Rows travel as a single json parameter, since knex expands array bindings
  await trx.raw(
    `INSERT INTO refresh_state (entity_id, entity_ref, unprocessed_entity, processed_entity, unprocessed_hash, result_hash, location_key, errors, next_update_at, last_discovery_at)
     SELECT entity_id, entity_ref, unprocessed_entity, processed_entity, unprocessed_hash, result_hash, location_key, '[]', '2031-01-01 23:00:00', '2021-04-01 13:37:00'
     FROM jsonb_to_recordset(?::jsonb) AS t(entity_id text, entity_ref text, unprocessed_entity text, processed_entity text, unprocessed_hash text, result_hash text, location_key text)`,
    [JSON.stringify(refreshState)],
  );
  await trx.raw(
    `INSERT INTO final_entities (entity_id, entity_ref, final_entity, hash, last_updated_at)
     SELECT entity_id, entity_ref, final_entity, hash, now()
     FROM jsonb_to_recordset(?::jsonb) AS t(entity_id text, entity_ref text, final_entity text, hash text)`,
    [JSON.stringify(finalEntities)],
  );
  await trx.raw(
    `INSERT INTO search (entity_id, key, original_value, value)
     SELECT entity_id, key, original_value, value
     FROM jsonb_to_recordset(?::jsonb) AS t(entity_id text, key text, original_value text, value text)`,
    [JSON.stringify(search)],
  );
  await trx.raw(
    `INSERT INTO relations (originating_entity_id, source_entity_ref, target_entity_ref, type)
     SELECT originating_entity_id, source_entity_ref, target_entity_ref, type
     FROM jsonb_to_recordset(?::jsonb) AS t(originating_entity_id text, source_entity_ref text, target_entity_ref text, type text)`,
    [JSON.stringify(relations)],
  );
  await trx.raw(
    `INSERT INTO refresh_state_references (source_key, source_entity_ref, target_entity_ref)
     SELECT source_key, source_entity_ref, target_entity_ref
     FROM jsonb_to_recordset(?::jsonb) AS t(source_key text, source_entity_ref text, target_entity_ref text)`,
    [JSON.stringify(references)],
  );
}

// #endregion
