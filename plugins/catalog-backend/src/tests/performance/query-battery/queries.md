# Catalog Query Performance Battery

Each scenario describes a user-facing action, the catalog method that
serves it, and what a healthy query plan looks like. The goal is to
detect performance regressions when database queries, indexes, or
schema change.

## How to run

**Preferred method**: Instantiate `DefaultEntitiesCatalog` (or call the
REST endpoints) with the parameters shown for each scenario, prefixed
with `EXPLAIN (ANALYZE, BUFFERS)` on the database side (e.g., via knex
debug logging or a database proxy that captures plans). This tests the
actual query the code produces.

**Alternative**: Run the reference SQL directly against a
production-scale replica using `psql`. The SQL is a snapshot of what the
code produced at the time of writing — verify it still matches before
drawing conclusions.

Record execution time, plan shape, and buffer usage in `baseline.md`. Keep one
readable representative full plan per scenario in `plans.md` and the exact
machine-diffable final-run output in `plans.json`.

**Run every scenario with and without permissions.** The plans of a request
with and without a conditional permission filter are very different, so each
scenario 1-14 and 20 has two variants: `_nop` (as written) and `_perm` (the
same request with the `<permission>` predicate from scenarios 15-19 combined
with its filter using `$all`). Scenarios 8, 9 and 11 do not go through the
permission layer and only have a `_nop` variant.

**Use several claim lists.** Long `$in` lists of 10 or more values are matched
differently from short ones, so measure the `_perm` variants with at least 3,
10 and 40 claims, and a list where a single claim owns a large share of the
catalog.

For a faster run that relies on documented assumptions, see the
[slim profile](./slim-profile.md). It must not be used without checking those
assumptions first.

---

## 1. Paginated entity list (kind=component, ordered by name)

**User action**: Opening the default catalog table view.

**Method call**:

```ts
catalog.queryEntities({
  filter: { kind: 'component' },
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
```

**Reference SQL**:

```sql
SELECT final_entities.entity_id, final_entities.final_entity, search.value
FROM search
INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
WHERE search.key = 'metadata.name'
  AND search.value IS NOT NULL
  AND final_entities.final_entity IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind' AND s.value = 'component'
  )
ORDER BY search.value ASC, final_entities.entity_id ASC
LIMIT 21;
```

**Healthy plan**: Index Scan on `search_key_value_entity_idx` driving
the query in sort order, LIMIT short-circuit after 21 rows. Execution
time <50ms on a production-scale catalog.

**Anti-patterns**:

- Materialized CTE (means the query shape forced full-set evaluation)
- Sort node above a Seq Scan (means the index isn't providing order)
- Execution time >50ms

---

## 2. Count query (kind=component)

**User action**: The `totalItems` count shown in the catalog table
footer.

**Method call**:

```ts
catalog.queryEntities({
  filter: { kind: 'component' },
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
// The count is the totalItems field in the response.
```

**Reference SQL** (the count portion, run in parallel with the list):

```sql
SELECT count(*) AS count
FROM search
INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
WHERE search.key = 'metadata.name'
  AND search.value IS NOT NULL
  AND final_entities.final_entity IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind' AND s.value = 'component'
  );
```

**Healthy plan**: Index-backed lookups on `search`; a parallel hash join with a
Sequential Scan on `final_entities` is also healthy for a large result set.
This is inherently expensive because the execution time is the floor for any
query that needs the count.

**Anti-patterns**:

- Seq Scan on `search` (missing index)
- Execution time growing super-linearly with entity count

---

## 3. Paginated entity list (no filter, LIMIT 21)

**User action**: The "show everything" view with no filters applied.
Worst case for pagination — LIMIT short-circuit is critical.

**Method call**:

```ts
catalog.queryEntities({
  limit: 20,
  credentials,
});
```

**Reference SQL**:

```sql
SELECT final_entities.entity_id, final_entities.final_entity
FROM final_entities
WHERE final_entities.final_entity IS NOT NULL
ORDER BY final_entities.entity_ref ASC
LIMIT 21;
```

**Healthy plan**: Index Scan on `final_entities_entity_ref_uniq`.
Execution time <1ms.

**Anti-patterns**:

- Sort node (means the index isn't providing order)
- Seq Scan on `final_entities`

---

## 4. Facets query (kind=template, facet=spec.type)

**User action**: Sidebar facet counts for a small result set.

**Method call**:

```ts
catalog.facets({
  filter: { kind: 'template' },
  facets: ['spec.type'],
  credentials,
});
```

**Reference SQL**:

```sql
SELECT search.key AS facet, search.original_value AS value, count(*) AS count
FROM search
INNER JOIN (
  SELECT final_entities.entity_id
  FROM final_entities
  WHERE final_entities.final_entity IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM search AS s
      WHERE s.entity_id = final_entities.entity_id
        AND s.key = 'kind' AND s.value = 'template'
    )
) AS filtered_entities ON search.entity_id = filtered_entities.entity_id
WHERE search.key IN ('spec.type')
  AND search.original_value IS NOT NULL
GROUP BY search.key, search.original_value
ORDER BY search.key, search.original_value;
```

**Healthy plan**: Uses `search_facets_covering_idx` or
`search_key_value_entity_idx` for the facet aggregation. The filtered
entity subquery uses index-backed EXISTS.

**Anti-patterns**:

- Seq Scan on `search` for the outer query
- Hash Join instead of Nested Loop for small result sets

---

## 5. Facets query (kind=component, facet=spec.type) — large result set

**User action**: Same as above but with a large filtered set (~tens of
thousands of components). Tests whether the plan stays efficient at
scale.

**Method call**:

```ts
catalog.facets({
  filter: { kind: 'component' },
  facets: ['spec.type'],
  credentials,
});
```

**Reference SQL**: Same as scenario 4 but with `kind = 'component'`
instead of `'template'`.

**Healthy plan**: Similar to scenario 4 but may use Hash Join for the
larger filtered set. Execution time proportional to the number of
matching entities.

**Anti-patterns**:

- Seq Scan on the `search` table (outer or inner)
- Temp file spills (check Buffers: temp)

---

## 6. Entity by ref lookup

**User action**: Viewing a single entity page by name.

**Method call**:

```ts
catalog.entitiesBatch({
  entityRefs: ['component:default/my-service'],
  credentials,
});
```

**Reference SQL**:

```sql
SELECT final_entities.final_entity
FROM final_entities
WHERE final_entities.entity_ref = 'component:default/my-service';
```

**Healthy plan**: Index Scan on `final_entities_entity_ref_uniq`.
Execution time <1ms.

**Anti-patterns**:

- Seq Scan (catastrophic — means the unique index is missing)

---

## 7. Full-text filter (LIKE '%player%', kind=component)

**User action**: Typing in the search box on the catalog table. The leading
wildcard prevents an index seek for the term, but an ordered scan can still
short-circuit after finding enough matches for the requested page.

**Method call**:

```ts
catalog.queryEntities({
  filter: { kind: 'component' },
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  fullTextFilter: { term: 'player' },
  limit: 20,
  credentials,
});
```

**Reference SQL**:

```sql
SELECT final_entities.entity_id, final_entities.final_entity, search.value
FROM search
INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
WHERE search.key = 'metadata.name'
  AND search.value IS NOT NULL
  AND final_entities.final_entity IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind' AND s.value = 'component'
  )
  AND search.value LIKE '%player%'
ORDER BY search.value ASC, final_entities.entity_id ASC
LIMIT 21;
```

**Healthy plan**: Ordered Index Scan on `search_key_value_entity_idx` for
`key = 'metadata.name'`, with the LIKE applied as a filter and LIMIT
short-circuiting after enough matches. The LIKE cannot perform an index seek
because of the leading wildcard, but the rest of the query should be
index-driven.

**Anti-patterns**:

- Seq Scan on `search` (the LIKE should be a filter on an index scan,
  not a seq scan trigger)

---

## 8. Relations traversal (entity ancestry)

**User action**: The `/entities/by-name/.../ancestry` endpoint.

**Method call**:

```ts
catalog.entityAncestry('component:default/my-service', { credentials });
```

**Reference SQL** (one step of the iterative traversal):

```sql
SELECT
  refresh_state_references.source_entity_ref,
  final_entities.entity_ref,
  final_entities.final_entity
FROM refresh_state_references
INNER JOIN final_entities
  ON refresh_state_references.source_entity_ref = final_entities.entity_ref
WHERE refresh_state_references.target_entity_ref = 'component:default/my-service'
LIMIT 10;
```

**Healthy plan**: Index Scan on
`refresh_state_references_target_entity_ref_idx`, Nested Loop with
Index Scan on `final_entities_entity_ref_uniq`.

**Anti-patterns**:

- Seq Scan on `refresh_state_references` (missing target index)
- Seq Scan on `relations` (missing `target_entity_ref` index)

---

## 9. Stitching: incoming reference count

**Context**: Run on every stitch to determine orphan status. Not a
user-facing action but critical for processing throughput.

**Reference SQL**:

```sql
SELECT count(*) AS count
FROM refresh_state_references
WHERE target_entity_ref = 'component:default/my-service';
```

**Healthy plan**: Index Only Scan on
`refresh_state_references_target_entity_ref_idx`. Execution time <1ms.

**Anti-patterns**:

- Seq Scan (missing index)

---

## 10. Adversarial: unfiltered count

**User action**: Count the entire catalog with no filters. Establishes
the ceiling for count performance.

**Method call**:

```ts
catalog.queryEntities({
  limit: 0,
  credentials,
});
// totalItems in the response is the full catalog count.
```

**Reference SQL**:

```sql
SELECT count(*) AS count
FROM search
INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
WHERE search.key = 'metadata.name'
  AND search.value IS NOT NULL
  AND final_entities.final_entity IS NOT NULL;
```

**Healthy plan**: Index scan on `search_key_value_entity_idx`. Execution
time proportional to total catalog size.

**Anti-patterns**:

- Seq Scan on `search`; a Sequential Scan on `final_entities` can be healthy
  when it feeds the parallel hash join used by the canonical plan
- Execution time >30s on a production-scale catalog

---

## 11. Orphan detection anti-join

**Context**: Periodic orphan cleanup (`deleteOrphanedEntities`). Runs
every 30 seconds by default. Not user-facing but a constant background
load.

**Reference SQL**:

```sql
SELECT refresh_state.entity_id, refresh_state.entity_ref
FROM refresh_state
LEFT OUTER JOIN refresh_state_references
  ON refresh_state_references.target_entity_ref = refresh_state.entity_ref
WHERE refresh_state_references.target_entity_ref IS NULL
LIMIT 100;
```

**Healthy plan**: Uses index on
`refresh_state_references.target_entity_ref` for the anti-join.
Execution time <500ms.

**Anti-patterns**:

- Seq Scan on `refresh_state_references` (the main table to avoid
  scanning)
- Hash Join pulling the full references table into memory

---

## 12. Ordered disjunction with selective branches

**User action**: List workflows and datasets belonging to the same component.
This scenario captures a case where each branch is fast by itself, but combining
them with `$any` makes the ordered query substantially slower.

**Catalog client call** (`catalogClient` implements `CatalogApi` and uses the
POST predicate endpoint):

```ts
catalogClient.queryEntities({
  query: {
    $any: [
      {
        kind: 'subcomponent',
        'spec.type': 'workflow',
        'relations.partOf': 'component:default/content_analytics_dbt',
      },
      {
        kind: 'api',
        'spec.type': 'dataset',
        'relations.apiProvidedBy': 'component:default/content_analytics_dbt',
      },
    ],
  },
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  fields: ['kind', 'metadata.name', 'metadata.namespace'],
  limit: 2000,
  totalItems: 'exclude',
});
```

**Reference SQL**:

```sql
SELECT final_entities.entity_id, final_entities.final_entity, search.value
FROM search
INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
WHERE search.key = 'metadata.name'
  AND search.value IS NOT NULL
  AND final_entities.final_entity IS NOT NULL
  AND (
    (
      EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'kind' AND s.value = 'subcomponent'
      )
      AND EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'spec.type' AND s.value = 'workflow'
      )
      AND EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'relations.partof'
          AND s.value = 'component:default/content_analytics_dbt'
      )
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'kind' AND s.value = 'api'
      )
      AND EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'spec.type' AND s.value = 'dataset'
      )
      AND EXISTS (
        SELECT 1 FROM search AS s
        WHERE s.entity_id = final_entities.entity_id
          AND s.key = 'relations.apiprovidedby'
          AND s.value = 'component:default/content_analytics_dbt'
      )
    )
  )
ORDER BY search.value ASC, final_entities.entity_id ASC
LIMIT 2001;
```

**Healthy plan**: Uses indexes for every lookup. Track the number of ordered
`metadata.name` candidates inspected before the limit is satisfied, because a
large value makes the correlated branch checks expensive. Compare the combined
query with each branch in isolation when investigating a regression.

**Anti-patterns**:

- Execution time substantially higher than the two branches in isolation.
- Tens of thousands of ordered candidates inspected to return approximately
  2,000 rows.
- Repeated correlated `kind` and `spec.type` index probes for both branches on
  most candidates. The relation lookups may instead appear as one-time hashed
  subplans.

---

## 13. Deep dataset page with default ID ordering

**User action**: Continue a bulk dataset scan without requesting an explicit
order. `queryEntities` defaults to ascending `entity_id` order, unlike the
legacy entity-reference ordering shown in scenario 3. Exclude `totalItems` and
request 10,000 entities; the extra row detects whether another page exists.

**Synthetic cursor**: The ID boundary `'e'` skips most UUID-shaped text IDs
without depending on an existing entity. It is a SQL test boundary, not a
public API cursor token. Check that the boundary skips a substantial portion
of the matching entities and leaves at least 10,001 matches before comparing
timings on another dataset.

**Reference SQL**:

```sql
WITH filtered(entity_id, final_entity) AS (
  SELECT final_entities.entity_id, final_entities.final_entity
  FROM final_entities
  WHERE final_entities.final_entity IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM search AS s
      WHERE s.entity_id = final_entities.entity_id
        AND s.key = 'kind' AND s.value = 'api'
    )
    AND EXISTS (
      SELECT 1 FROM search AS s
      WHERE s.entity_id = final_entities.entity_id
        AND s.key = 'spec.type' AND s.value = 'dataset'
    )
)
SELECT * FROM filtered
WHERE entity_id > 'e'
ORDER BY entity_id ASC
LIMIT 10001;
```

**Healthy plan**: An index range condition on `entity_id` skips earlier IDs.
Filtering uses the search indexes, and LIMIT stops after 10,001 eligible rows.
Track buffer work as well as execution time; a late cursor should not require
visiting every preceding entity.

**Anti-patterns**:

- The cursor appears only as a filter rather than an index range condition.
- Large numbers of earlier IDs are inspected despite the late boundary.
- A blocking sort or materialized CTE prevents LIMIT from stopping the scan.

---

## 14. Deep dataset page ordered by name

**User action**: Continue the same bulk dataset scan as scenario 13, but with
`metadata.name` ascending and `entity_id` ascending as the tie-breaker.

**Synthetic cursor**: Use the fixed pair `('s', 'e')`. Names need not include an
entity named exactly `'s'`: the pair describes an ordering boundary, not an
entity lookup. Verify that it skips most matching names while leaving at
least 10,001 matches. Keep the equality branch even when no name equals `'s'`,
so the reference SQL retains the two-column cursor shape used by the service.

**Reference SQL**:

```sql
WITH filtered(entity_id, final_entity, value) AS (
  SELECT final_entities.entity_id, final_entities.final_entity, search.value
  FROM search
  INNER JOIN final_entities ON final_entities.entity_id = search.entity_id
  WHERE search.key = 'metadata.name'
    AND search.value IS NOT NULL
    AND final_entities.final_entity IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM search AS s
      WHERE s.entity_id = final_entities.entity_id
        AND s.key = 'kind' AND s.value = 'api'
    )
    AND EXISTS (
      SELECT 1 FROM search AS s
      WHERE s.entity_id = final_entities.entity_id
        AND s.key = 'spec.type' AND s.value = 'dataset'
    )
)
SELECT * FROM filtered
WHERE value > 's' OR (value = 's' AND entity_id > 'e')
ORDER BY value ASC, entity_id ASC
LIMIT 10001;
```

**Healthy plan**: The ordered search index provides the page order and the
cursor becomes an index range condition. Compare inspected rows, buffer work,
sort spills, and execution time: first-page scenarios do not reveal work
wasted scanning entries before a deep cursor.

**Anti-patterns**:

- The cursor is applied as a filter while the ordered scan starts before it.
- Hundreds of thousands of repeated index probes to return one page.
- Sorting full entity payloads for a large candidate set before applying LIMIT.

---

## Scenarios 15-19: Conditional permission filters

Scenarios 15-19 cover the filters produced by conditional permission policies
for catalog reads. `AuthorizedEntitiesCatalog` converts the conditional
decision into a predicate and combines it with any request filter as
`{ $all: [permission, requestFilter] }`. The scenarios call
`DefaultEntitiesCatalog` directly with the combined predicate.

They all use this permission predicate, which combines the built-in ownership
rule with a custom rule: entities without an optional readers annotation are
readable by everyone, and entities with it are readable only by the listed
users and groups. The two `kind = 'template'` rules apply to a single kind only.

```ts
const claims = ['user:default/someone', 'group:default/team-a' /* ... */];

const permission = {
  $all: [
    {
      $any: [
        { 'relations.ownedBy': { $in: claims } },
        { 'metadata.annotations.example.com/readers': { $in: claims } },
        {
          $not: {
            'metadata.annotations.example.com/readers': { $exists: true },
          },
        },
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
```

In page queries, and in all queries on other databases, `<permission>` in the
reference SQL below stands for:

```sql
(
  EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'relations.ownedby' AND s.value = ANY(:claims)
  )
  OR EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'metadata.annotations.example.com/readers'
      AND s.value = ANY(:claims)
  )
  OR NOT EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'metadata.annotations.example.com/readers'
  )
)
AND (
  EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'spec.custom' AND s.value = 'x'
  )
  OR NOT EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind' AND s.value = 'template'
  )
)
AND (
  NOT EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id AND s.key = 'spec.a'
  )
  OR NOT EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id AND s.key = 'spec.b'
  )
  OR NOT EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind' AND s.value = 'template'
  )
)
```

On PostgreSQL, facets and count queries compile a filter that contains a
disjunction or a negation into set operations on entity IDs instead. Here the
result is every entity except `<denied set>`, which stands for:

```sql
(
  (
    (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'metadata.annotations.example.com/readers'
    )
    EXCEPT (
      (
        SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
        WHERE s.key = 'relations.ownedby' AND s.value = ANY(:claims)
      )
      UNION (
        SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
        WHERE s.key = 'metadata.annotations.example.com/readers'
          AND s.value = ANY(:claims)
      )
    )
  )
  UNION (
    (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'kind' AND s.value = 'template'
    )
    EXCEPT (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'spec.custom' AND s.value = 'x'
    )
  )
  UNION (
    (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'spec.a'
    )
    INTERSECT (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'spec.b'
    )
    INTERSECT (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'kind' AND s.value = 'template'
    )
  )
)
```

The `COLLATE "C"` makes sorting the IDs and removing duplicates a byte
comparison. The set is joined back with `COLLATE "default"`, so that the
`entity_id` indexes can be used.

**How to measure these scenarios**:

- **Use real claims.** Take one realistic user, typically a few dozen user and
  group references, and repeat with a large list of 100 or more. A correlated
  `s.value = ANY(:claims)` probe reads a single index page, but each time the
  index scan restarts it sorts the array again with collation-aware
  comparisons. On the measured
  replica, a probe took about 0.016 ms with 2 values, 0.33 ms with 40 values
  and 1.1 ms with 173 values.
- **Repeat with `work_mem = '4MB'`**, the PostgreSQL default, as well as with
  the server setting. A hashed set that fits in `hash_mem` on a large server can
  fall back to scanning a list once per row on a smaller one.
- **Use an annotation that few entities have as the readers key.**
- **When evaluating a change to how these filters are compiled, also add a
  claim that owns a large share of the catalog**, such as a group that owns
  100,000 entities. Building such a set up front costs time even in queries
  that only need a few entities.

---

## 15. Catalog list, count, and kind facets as a permission-filtered user

**User action**: Opening the catalog page as a user whose read access comes
from the conditional permission policy above. The request has no filter of its
own, so the permission conditions are the whole filter. The kind picker loads
facets, and the table loads its first page and the total count.

**Method calls**:

```ts
catalog.facets({ filter: permission, facets: ['kind'], credentials });

catalog.queryEntities({
  filter: permission,
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
// The count is the totalItems field in the response.
```

**Reference SQL** (the facets query and the count portion; the list portion is
scenario 1 with `<permission>` in place of the kind condition):

```sql
SELECT search.key AS facet, search.original_value AS value, count(*) AS count
FROM search
WHERE search.key IN ('kind')
  AND search.original_value IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM final_entities
    WHERE final_entities.entity_id = search.entity_id
      AND final_entities.final_entity IS NOT NULL
  )
  AND NOT EXISTS (
    SELECT 1 FROM <denied set> AS fset
    WHERE fset.entity_id COLLATE "default" = search.entity_id
  )
GROUP BY search.key, search.original_value
ORDER BY search.key, search.original_value;

SELECT count(*) AS count
FROM final_entities
WHERE final_entities.final_entity IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM search
    WHERE search.entity_id = final_entities.entity_id
      AND search.key = 'metadata.name' AND search.value IS NOT NULL
  )
  AND NOT EXISTS (
    SELECT 1 FROM <denied set> AS fset
    WHERE fset.entity_id COLLATE "default" = final_entities.entity_id
  );
```

**Healthy plan**: The list walks `metadata.name` in order and stops after 21
rows. The facets and count queries evaluate each permission condition once
for the whole query (hashed, or as a join), not once per entity. Their
execution time is close to an unfiltered facets query or count (scenario 10),
and does not grow with the number of claims.

**Anti-patterns**:

- `EXISTS` / `NOT EXISTS` SubPlans with a loop count close to the number of
  entities, typically attached to a `final_entities_pkey` lookup under a
  Nested Loop or Memoize node. The planner chooses per-row SubPlans there
  because it expects one row per loop.
- Execution time that grows with the number of claims.
- Facets or count execution time an order of magnitude above the unfiltered
  equivalent.

---

## 16. Permission filter combined with a selective request filter

**User action**: Selecting the Component kind on the catalog page as the
same user. The type picker loads facets, and the table loads a page and the
total count.

**Method calls**:

```ts
const filter = { $all: [permission, { kind: 'component' }] };

catalog.facets({ filter, facets: ['spec.type'], credentials });

catalog.queryEntities({
  filter,
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
```

**Reference SQL**: The page is scenario 1 with `AND <permission>` added next
to the `kind = 'component'` condition. The facets and count queries are
scenario 15's, with the `kind = 'component'` condition in the set. In place of
the `NOT EXISTS` against `<denied set>`, they use the following, where
`<entity id>` is `search.entity_id` in the facets query and
`final_entities.entity_id` in the count query:

```sql
EXISTS (
  SELECT 1 FROM (
    (
      SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
      WHERE s.key = 'kind' AND s.value = 'component'
    )
    EXCEPT <denied set>
  ) AS fset
  WHERE fset.entity_id COLLATE "default" = <entity id>
)
```

**Healthy plan**: Each permission condition is evaluated once for the whole
query, or once per entity of the requested kind with a cost that does not
depend on the number of claims. Execution time stays within a small factor of
scenarios 5, 1 and 2.

**Anti-patterns**:

- A Nested Loop driven by the `kind = 'component'` index scan into a
  `final_entities_pkey` lookup (often behind Memoize) whose filter runs the
  `s.value = ANY(:claims)` SubPlan once per row. The semi-join for the
  selective request filter creates this shape, including inside a
  materialized CTE.
- Facets, page, or count times that grow with the number of claims. On the
  measured replica, all three exceeded the timeout with 173 claims at
  `work_mem = 32MB`.

---

## 17. Permission-filtered facets for a rare facet key

**User action**: A facet picker for a field that only a few hundred entities
have, such as an annotation, shown to the same user.

**Method call**:

```ts
catalog.facets({
  filter: permission,
  facets: ['metadata.annotations.example.com/readers'],
  credentials,
});
```

**Reference SQL**: Scenario 15's facets query with
`search.key IN ('metadata.annotations.example.com/readers')`.

**Healthy plan**: Driven by the facet rows for the rare key, through
`search_facets_covering_idx`. The permission conditions are only checked for
the entities that have the key. Execution time is in the low tens of
milliseconds.

**Anti-patterns**:

- Work proportional to the whole catalog. For example, a full scan of
  `final_entities`, or materializing the complete filtered entity set before
  joining it to the few facet rows.

---

## 18. Negated disjunction

**User action**: A filter that excludes entities matching either of two
conditions. For example, entities the user does not own and that carry no
readers restriction. Permission rules built with `not` and `anyOf` produce
this shape.

**Method calls**:

```ts
const filter = {
  $not: {
    $any: [
      { 'relations.ownedBy': { $in: claims } },
      { 'metadata.annotations.example.com/readers': { $exists: true } },
    ],
  },
};

catalog.facets({ filter, facets: ['kind'], credentials });

catalog.queryEntities({
  filter,
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
```

**Reference SQL** (the count portion; the page query keeps the correlated
`NOT (EXISTS ... OR EXISTS ...)` form in place of scenario 1's kind
condition):

```sql
SELECT count(*) AS count
FROM final_entities
WHERE final_entities.final_entity IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM search
    WHERE search.entity_id = final_entities.entity_id
      AND search.key = 'metadata.name' AND search.value IS NOT NULL
  )
  AND NOT EXISTS (
    SELECT 1 FROM (
      (
        SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
        WHERE s.key = 'relations.ownedby' AND s.value = ANY(:claims)
      )
      UNION (
        SELECT s.entity_id COLLATE "C" AS entity_id FROM search AS s
        WHERE s.key = 'metadata.annotations.example.com/readers'
      )
    ) AS fset
    WHERE fset.entity_id COLLATE "default" = final_entities.entity_id
  );
```

**Healthy plan**: The union of the two sets is built once and anti-joined, or
each condition is an anti-join or a hashed SubPlan that runs once.

**Anti-patterns**:

- Correlated SubPlans with loop counts close to the number of entities.
  PostgreSQL does not turn `NOT (EXISTS a OR EXISTS b)` into anti-joins itself.
  It pushes the negation down only after `EXISTS` conditions have been pulled
  up into joins.

---

## 19. Paginated query with a large `$in` under `$any`

**User action**: Listing entities that match either a broad condition or a
narrow one. Here that's one of several common kinds, or owned by the user.
This guards LIMIT short-circuiting against compiling `$in` conditions into
pre-built sets.

**Method call**:

```ts
catalog.queryEntities({
  filter: {
    $any: [
      { kind: { $in: ['component', 'api', 'resource', 'subcomponent'] } },
      { 'relations.ownedBy': { $in: claims } },
    ],
  },
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  limit: 20,
  credentials,
});
```

**Reference SQL**: Scenario 1 with this condition in place of the kind
condition:

```sql
(
  EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'kind'
      AND s.value = ANY('{component,api,resource,subcomponent}')
  )
  OR EXISTS (
    SELECT 1 FROM search AS s
    WHERE s.entity_id = final_entities.entity_id
      AND s.key = 'relations.ownedby' AND s.value = ANY(:claims)
  )
)
```

**Healthy plan**: Walks `metadata.name` in order and stops after 21 rows.
Most candidates match the broad branch, so only a few per-row checks are
needed. Execution time is in the low tens of milliseconds.

**Anti-patterns**:

- Building a set of all entities that match the broad branch (hundreds of
  thousands) before the first row is returned, for example by compiling `$in`
  as an uncorrelated `entity_id IN (SELECT ...)`. That form is hashed in full,
  so LIMIT cannot stop early. With a small `work_mem` the set no longer fits in
  `hash_mem`, and PostgreSQL falls back to scanning it once per row.
- The same applies to a negated large `$in` compiled to `NOT IN (SELECT ...)`.

---

## 20. Late page of a selective list ordered by name

**User action**: Paging forward in the catalog table to names starting late in
the alphabet, for a kind with few entities (`group`) and one with many
(`component`).

**Method call**:

```ts
catalog.queryEntities({
  filter: { kind: 'group' }, // and { kind: 'component' }
  orderFields: [{ field: 'metadata.name', order: 'asc' }],
  cursor, // positioned after names starting with 't'
  limit: 20,
  credentials,
});
```

**Reference SQL**: Scenario 1 with the cursor condition added:

```sql
AND (search.value > 't' OR (search.value = 't' AND final_entities.entity_id > ''))
```

**Healthy plan**: Without permissions, walks `metadata.name` from the cursor
and stops after 21 rows. With permissions, a small kind such as `group` is
driven from the kind or the permission set, not from the name order.

**Anti-patterns**:

- Walking the name index from the cursor while checking every entity of
  another kind against the permission filter per row. For `group` this reads
  the rest of the catalog to find 21 rows, with a per-row `= ANY(:claims)`
  probe for each.

---

## 21. Request filters with a long `$in` list

**User action**: A client filtering on many values of one field, for example a
script or plugin streaming entities of 30 different `spec.type` values. These
cases have no permission filter, and the list length does not depend on the
user.

**Method calls**: `catalog.queryEntitiesStream` or paged `queryEntities`
ordered by entity ID, with each of these filters:

```ts
const types = [
  /* 30 spec.type values */
];

// adv_types_or_api
{
  $any: [{ 'spec.type': { $in: types } }, { kind: 'api' }];
}

// adv_types_or_broad
{
  $any: [
    { 'spec.type': { $in: [...types, 'workflow', 'dataset'] } },
    { 'spec.lifecycle': 'production' },
  ];
}

// adv_comp_not_types
{
  $all: [{ kind: 'component' }, { $not: { 'spec.type': { $in: types } } }];
}
```

**Healthy plan**: Each list is matched once as a set of entity IDs, either
joined or hashed. The total cost of a full stream grows with the number of
matching entities, not with entities times list length.

**Anti-patterns**:

- Per-row `= ANY(array)` SubPlans (global anti-pattern 6).
- A negated list planned as a filter that scans a materialized set again for every
  row.

---

## Global anti-patterns

These should NEVER appear in any of the above queries:

1. **Seq Scan on `search`** — The measured production-scale table is 34GB of
   heap data and 43GB including indexes, with approximately 21.9M rows in
   planner statistics. Any sequential scan is catastrophic.
2. **Seq Scan on `relations`** — The measured table is 1.7GB of heap data and
   2.3GB including indexes, with approximately 6.1M rows. Use indexes.
3. **Materialized CTE** — Prevents LIMIT short-circuiting. Was the
   original cause of slow paginated queries.
4. **Temp file spills** (look for `Buffers: temp` in EXPLAIN output) —
   Indicates the query is materializing a large intermediate result.
5. **Nested Loop with Seq Scan inner** — Usually means a missing index
   on the inner table's join column.
6. **Per-row `= ANY(array)` SubPlans over many rows** — A correlated
   `EXISTS (... s.value = ANY(:values))` with a loop count in the tens of
   thousands. Each time the index scan restarts, it sorts the array again with
   collation-aware comparisons, so the cost per loop grows with the length of the array even
   though only one index page is read.

Facets and count queries (scenarios 15-18) have no LIMIT and must visit the
whole filtered set. For those queries, a bounded spill of an intermediate set
at a small `work_mem` is acceptable. Per-row work that grows with the number of
entities times the number of claims is not.
