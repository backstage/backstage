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

Record execution time, plan shape, and buffer usage in `baseline.md`.

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
time <5ms.

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

**Healthy plan**: Index scan on `search_key_value_entity_idx` with
nested loop for the EXISTS filter. This is inherently expensive for
large result sets — the execution time is the floor for any query that
needs the count.

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

**User action**: Typing in the search box on the catalog table. The
leading wildcard prevents index-ordered short-circuiting.

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

**Healthy plan**: Index Scan on `search_key_value_entity_idx` for
`key = 'metadata.name'`, Filter for the LIKE. The LIKE cannot use an
index (leading wildcard) but the rest of the query should be
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

- Seq Scan on either table
- Execution time >30s on a 500K entity catalog

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

## Global anti-patterns

These should NEVER appear in any of the above queries:

1. **Seq Scan on `search`** — The search table is 11+ GB. Any seq scan
   is catastrophic.
2. **Seq Scan on `relations`** — 714 MB heap, 3.5M rows. Must use
   indexes.
3. **Materialized CTE** — Prevents LIMIT short-circuiting. Was the
   original cause of slow paginated queries.
4. **Temp file spills** (look for `Buffers: temp` in EXPLAIN output) —
   Indicates the query is materializing a large intermediate result.
5. **Nested Loop with Seq Scan inner** — Usually means a missing index
   on the inner table's join column.
