# Query Performance Baseline

Readable representative `EXPLAIN (ANALYZE, BUFFERS)` output is recorded in
[`plans.md`](./plans.md), with the exact canonical final-run JSON output in
[`plans.json`](./plans.json).

**Date**: 2026-09-12
**Database**: Production-scale staging replica
**Catalog size**: ~739K `final_entities`, ~21.9M planner-estimated `search`
rows, ~6.1M `relations`, ~739K `refresh_state_references`, ~1.28M
`refresh_state`
**Statistics**: `search.entity_id n_distinct = -0.0429023`, followed by
`ANALYZE search` and `VACUUM search`
**Table sizes**: `search` 43GB total (34GB heap, 9.1GB indexes), `relations`
2.3GB total (1.7GB heap), and `refresh_state` 11GB total
**Selected kind counts**: 46,036 components, 14 templates, 202,704 APIs, and
257,064 subcomponents

## Scenario 1: Paginated entity list (kind=component, ordered by name)

- **Execution time**: 22.6ms median (22.1-22.7ms)
- **Planning time**: 3.287 ms
- **Plan shape**: Gather Merge (2 workers) -> Parallel Index Only Scan on `search_key_value_entity_idx` (key='metadata.name') -> Index Scan on `final_entities_pkey` -> Nested Loop Semi Join -> Index Only Scan on `search_key_value_entity_idx` (EXISTS kind=component); LIMIT short-circuits after 21 rows
- **Anti-patterns detected**: None
- **Buffers**: shared hit=4815

## Scenario 2: Count query (kind=component)

- **Execution time**: 452.5ms median (451.5-463.0ms)
- **Planning time**: 3.167 ms
- **Plan shape**: Finalize Aggregate -> Gather -> Partial Aggregate -> Nested
  Loop: Hash Join (`final_entities` with kind lookup from
  `search_key_value_entity_idx`) -> Index Only Scan on
  `search_entity_key_value_idx` for `metadata.name`
- **Anti-patterns detected**: Sequential Scan on `final_entities`, but no
  Sequential Scan on `search`; the parallel hash-join plan is efficient for
  the 46,036 matching components
- **Buffers**: shared hit=425677

## Scenario 3: Paginated entity list (no filter, LIMIT 21)

- **Execution time**: 0.146ms median (0.137-0.155ms)
- **Planning time**: 0.670 ms
- **Plan shape**: Index Scan on `final_entities_entity_ref_uniq` with LIMIT short-circuit
- **Anti-patterns detected**: None
- **Buffers**: shared hit=25

## Scenario 4: Facets query (kind=template, facet=spec.type)

- **Execution time**: 0.838ms median (0.837-1.033ms)
- **Planning time**: 3.731 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` (kind=template, 14 rows) -> Index Scan on `final_entities_pkey` -> Index Scan on `search_entity_key_value_idx` (spec.type) -> Sort -> GroupAggregate
- **Anti-patterns detected**: None
- **Buffers**: shared hit=160

## Scenario 5: Facets query (kind=component, facet=spec.type) -- large result set

- **Execution time**: 631.7ms median (607.0-632.4ms)
- **Planning time**: 3.684 ms
- **Plan shape**: Finalize GroupAggregate -> Gather Merge -> Partial
  GroupAggregate -> Sort -> Hash Joins using
  `search_facets_covering_idx`, a Sequential Scan on `final_entities`, and
  `search_key_value_entity_idx` for kind
- **Anti-patterns detected**: No Sequential Scan on `search` and no temporary
  file spill; the Sequential Scan on `final_entities` feeds an efficient hash
  join for the 46,036 matching components
- **Buffers**: shared hit=811182

## Scenario 6: Entity by ref lookup

- **Execution time**: 0.124ms median (0.122-0.204ms)
- **Planning time**: 0.593 ms
- **Plan shape**: Index Scan on `final_entities_entity_ref_uniq`
- **Anti-patterns detected**: None (0 rows returned -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 7: Full-text filter (metadata.name LIKE '%player%', kind=component)

- **Execution time**: 14.9ms median (14.8-15.3ms)
- **Planning time**: 3.935 ms
- **Plan shape**: Limit -> Gather Merge -> ordered Index Only Scan on
  `search_key_value_entity_idx` for `metadata.name` -> Index Scan on
  `final_entities_pkey` -> Index Only Scan for kind
- **Anti-patterns detected**: None; the ordered scan finds 21 matching rows
  quickly despite the leading-wildcard filter
- **Buffers**: shared hit=18389

## Scenario 8: Relations traversal (entity ancestry)

- **Execution time**: 0.134ms median (0.133-0.155ms)
- **Planning time**: 1.456 ms
- **Plan shape**: Index Scan on `refresh_state_references_target_entity_ref_idx` -> Nested Loop -> Index Scan on `final_entities_entity_ref_uniq`; LIMIT short-circuits
- **Anti-patterns detected**: None (0 rows returned -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 9: Stitching: incoming reference count

- **Execution time**: 0.215ms median (0.164-0.233ms)
- **Planning time**: 0.670 ms
- **Plan shape**: Index Only Scan on `refresh_state_references_target_entity_ref_idx` -> Aggregate
- **Anti-patterns detected**: None (0 rows matched -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 10: Adversarial: unfiltered count

- **Execution time**: 514.0ms median (500.9-519.9ms)
- **Planning time**: 2.154 ms
- **Plan shape**: Finalize Aggregate -> Gather -> Partial Aggregate -> Hash
  Join: Index Only Scan on `search_key_value_entity_idx` for `metadata.name`
  with a Sequential Scan on `final_entities`
- **Anti-patterns detected**: No Sequential Scan on `search` and no temporary
  file spill; the Sequential Scan on `final_entities` feeds an efficient hash
  join
- **Buffers**: shared hit=526888

## Scenario 11: Relations: orphan detection anti-join

- **Execution time**: 11.06s median (10.10-12.04s)
- **Planning time**: 1.583 ms
- **Plan shape**: Limit -> Nested Loop Anti Join: Sequential Scan on
  `refresh_state` -> Index Only Scan on
  `refresh_state_references_target_entity_ref_idx`; approximately 373K outer
  rows are inspected to find 100 orphans
- **Anti-patterns detected**: Nested-loop amplification caused by LIMIT and a
  poor estimate of where unmatched rows occur; a diagnostic Merge Anti Join
  completed in approximately 996ms
- **Buffers**: shared hit=1773957 read=1016802

## Scenario 12: Ordered disjunction with selective branches

- **Measurement date**: 2026-09-12
- **Database**: Production-scale staging replica, with approximately 739K
  `final_entities` rows. The exact statistics calculation observed 17.1M
  `search` rows for 735,764 distinct entities; planner statistics after vacuum
  estimated 21.9M rows.
- **Data shape**: 1,084 matching workflow relations and 934 matching dataset
  relations, the same branch result counts observed in production
- **Execution time**: 2.76s median (2.75-2.79s)
- **Planning time**: 4.790 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` for
  `metadata.name` -> Memoize -> Index Scan on `final_entities_pkey` ->
  correlated index probes for both sides of the disjunction; all 77,199
  Memoize lookups miss because the ordered candidates have distinct entity
  IDs, and LIMIT short-circuits after 2,001 rows
- **Anti-patterns detected**: The plan uses indexes throughout, but the
  disjunction prevents either selective relation predicate from driving the
  query. The workflow and dataset branches take 70.8ms and 59.7ms median in
  isolation, respectively.
- **Buffers**: shared hit=1298170
- **Statistics note**: The canonical run used
  `search.entity_id n_distinct = -0.0429023`, the exact fraction calculated
  from the staging data (23.31 search rows per entity).

---

## Controlled `search.entity_id n_distinct` comparison

The full battery was run on the same production-scale staging replica on
2026-09-12 with two statistics settings. Each setting was applied on the
primary followed by `ANALYZE search`, and was verified on the replica before
measurement. Each result below is the median of three measured warm runs after
one warm-up run. The corrected-statistics run also followed a manual vacuum of
`search`. The representative SQL is recorded in `queries.md`.

The corrected value, `-0.0429023`, was calculated from the staging data. The
legacy value, `-1`, tells PostgreSQL to treat every search row as having a
different entity ID.

| Scenario                          | Legacy `-1` | Corrected `-0.0429023` | Effective plan comparison                                      |
| --------------------------------- | ----------: | ---------------------: | -------------------------------------------------------------- |
| 1. Paginated component list       |     22.1 ms |                22.6 ms | Same ordered parallel index plan                               |
| 2. Component count                |    465.2 ms |               452.5 ms | Same parallel hash-join and nested-loop plan                   |
| 3. Unfiltered page                |    0.147 ms |               0.146 ms | Same `final_entities` index scan                               |
| 4. Template facets                |    0.883 ms |               0.838 ms | Same nested-loop index plan                                    |
| 5. Component facets               |    641.6 ms |               631.7 ms | Corrected plan uses partial aggregation; same scans and joins  |
| 6. Entity lookup                  |    0.126 ms |               0.124 ms | Same unique-index lookup                                       |
| 7. Full-text component filter     |     15.2 ms |                14.9 ms | Same ordered parallel index plan                               |
| 8. Ancestry step                  |    0.156 ms |               0.134 ms | Same nested-loop index plan                                    |
| 9. Incoming reference count       |    0.162 ms |               0.215 ms | Same index-only scan; sub-millisecond variance                 |
| 10. Unfiltered count              |    556.0 ms |               514.0 ms | Same parallel hash-join plan                                   |
| 11. Orphan anti-join              |      11.67s |                 11.06s | Same nested-loop anti-join; independent of `search` statistics |
| 12. Ordered selective disjunction |       2.90s |                  2.76s | Corrected plan adds a Memoize node with no cache hits          |

The corrected statistic changes row estimates substantially but does not
materially change the runtime of the battery. Scenario 5 switches to partial
aggregation, while retaining the same scans and joins. Scenario 12 adds a
Memoize node, but all 77,199 lookups are misses because the ordered
`metadata.name` scan produces distinct entity IDs. It therefore inspects the
same 77,199 candidates under both settings. Its expensive combination of
ordering and disjunction is unaffected by this statistic.

The large differences from the May baseline, particularly scenario 7, are
therefore changes in the wider database, data, and planner state rather than
effects of this setting.

Scenario 11 is a separate regression. Both settings chose a Nested Loop Anti
Join that scanned approximately 373K-387K `refresh_state` rows to find 100 orphans.
Forcing an alternative plan for diagnosis produced a Merge Anti Join in about
996ms, compared with approximately 10-13s for the default warm plan.

---

## Summary

| Scenario                           | Execution Time | Verdict                                           |
| ---------------------------------- | -------------- | ------------------------------------------------- |
| 1. Paginated list (kind=component) | 22.6 ms        | OK; ordered LIMIT short-circuit                   |
| 2. Count (kind=component)          | 452.5 ms       | OK; efficient parallel aggregate                  |
| 3. Paginated list (no filter)      | 0.146 ms       | Excellent                                         |
| 4. Facets (kind=template)          | 0.838 ms       | Excellent                                         |
| 5. Facets (kind=component)         | 631.7 ms       | OK; no Sequential Scan on `search`                |
| 6. Entity by ref                   | 0.124 ms       | Excellent                                         |
| 7. Full-text filter (LIKE)         | 14.9 ms        | OK; ordered LIMIT short-circuit                   |
| 8. Relations traversal             | 0.134 ms       | Excellent                                         |
| 9. Stitching ref count             | 0.215 ms       | Excellent                                         |
| 10. Unfiltered count               | 514.0 ms       | OK; efficient parallel aggregate                  |
| 11. Orphan detection               | 11.06s         | **Regression**; nested-loop amplification         |
| 12. Ordered selective disjunction  | 2.76s          | Known slow case; branches are individually faster |

---

## Comparison with previous baseline (2026-05-18)

### Catalog size changes

The staging catalog is larger than the previous production-scale baseline:
approximately 739K entities versus 474K, 21.9M planner-estimated search rows
versus 13.2M, 6.1M relations versus 3.5M, and 1.28M refresh-state rows versus
476K. Absolute timing changes must therefore be interpreted alongside the plan
changes.

### Improvements

- **Scenario 2** (component count): 452.5ms versus 1068.1ms. The current
  parallel hash-join and aggregate plan remains faster despite the larger
  catalog.
- **Scenario 4** (template facets): 0.838ms versus 3.653ms. Both plans are
  index-driven.
- **Scenario 5** (component facets): 631.7ms versus 972.5ms. The current plan
  uses parallel partial aggregation and does not scan `search` sequentially.
- **Scenario 7** (full-text filter): 14.9ms versus 903.5ms. The current plan
  walks `metadata.name` in order and stops after 21 matches instead of
  evaluating and sorting the full component set.
- **Scenario 10** (unfiltered count): 514.0ms versus 1317.4ms. The current
  parallel hash-join plan is faster while processing a larger catalog.

### Regressions

- **Scenario 1** (paginated component list): 22.6ms versus 12.5ms. It remains
  well below the 50ms anti-pattern threshold and retains its healthy ordered
  LIMIT plan.
- **Scenario 11** (orphan detection): 11.06s versus 255.7ms. The planner now
  chooses a Nested Loop Anti Join and inspects approximately 373K refresh-state
  rows to find 100 orphans. This is the only serious regression in the current
  battery.

### Plan shape changes (no performance impact)

- Scenarios 3, 6, 8, and 9 retain their expected index-driven plans and remain
  sub-millisecond.
- Scenario 12 is new in this baseline. Its isolated workflow and dataset
  branches remain approximately 40 times faster than their ordered
  disjunction.
