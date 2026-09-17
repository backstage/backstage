# Query Performance Baseline

**Date**: 2026-05-18
**Database**: Production-scale replica
**Catalog size**: ~474K `final_entities`, ~13.2M `search` rows, ~3.5M `relations`, ~478K `refresh_state_references`, ~476K `refresh_state`

## Scenario 1: Paginated entity list (kind=component, ordered by name)

- **Execution time**: 12.531 ms
- **Planning time**: 1.469 ms
- **Plan shape**: Gather Merge (2 workers) -> Parallel Index Only Scan on `search_key_value_entity_idx` (key='metadata.name') -> Memoize -> Index Scan on `final_entities_pkey` -> Nested Loop Semi Join -> Index Only Scan on `search_key_value_entity_idx` (EXISTS kind=component); LIMIT short-circuits after 21 rows
- **Anti-patterns detected**: None
- **Buffers**: shared hit=6145

## Scenario 2: Count query (kind=component)

- **Execution time**: 1068.112 ms
- **Planning time**: 1.533 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` (kind=component, ~55K rows) -> HashAggregate -> Index Scan on `final_entities_pkey` -> Index Only Scan on `search_entity_key_value_idx` (metadata.name) -> Aggregate
- **Anti-patterns detected**: None (inherent cost of counting ~55K components)
- **Buffers**: shared hit=619709

## Scenario 3: Paginated entity list (no filter, LIMIT 21)

- **Execution time**: 0.096 ms
- **Planning time**: 0.432 ms
- **Plan shape**: Index Scan on `final_entities_entity_ref_uniq` with LIMIT short-circuit
- **Anti-patterns detected**: None
- **Buffers**: shared hit=30

## Scenario 4: Facets query (kind=template, facet=spec.type)

- **Execution time**: 3.653 ms
- **Planning time**: 1.508 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` (kind=template, 196 rows) -> HashAggregate -> Index Scan on `final_entities_pkey` -> Index Scan on `search_entity_key_value_idx` (spec.type) -> Sort -> GroupAggregate
- **Anti-patterns detected**: None
- **Buffers**: shared hit=2177

## Scenario 5: Facets query (kind=component, facet=spec.type) -- large result set

- **Execution time**: 972.453 ms
- **Planning time**: 1.533 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` (kind=component, ~55K rows) -> HashAggregate -> Index Scan on `final_entities_pkey` -> Index Scan on `search_entity_key_value_idx` (spec.type) -> Sort -> GroupAggregate
- **Anti-patterns detected**: None (plan uses index scans throughout; no seq scans or temp spills)
- **Buffers**: shared hit=612386

## Scenario 6: Entity by ref lookup

- **Execution time**: 0.072 ms
- **Planning time**: 0.374 ms
- **Plan shape**: Index Scan on `final_entities_entity_ref_uniq`
- **Anti-patterns detected**: None (0 rows returned -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 7: Full-text filter (metadata.name LIKE '%player%', kind=component)

- **Execution time**: 903.491 ms
- **Planning time**: 1.499 ms
- **Plan shape**: Index Only Scan on `search_key_value_entity_idx` (kind=component, ~55K rows) -> HashAggregate -> Index Scan on `final_entities_pkey` -> Index Only Scan on `search_entity_key_value_idx` (metadata.name, filtered by LIKE '%player%') -> Sort -> LIMIT 21
- **Anti-patterns detected**: Full scan of all ~55K components required because LIKE filter with leading wildcard cannot short-circuit via index ordering. The LIKE is applied as a filter on the index scan (not a seq scan), which is correct, but the query must evaluate all component entities before sorting and limiting.
- **Buffers**: shared hit=619712

## Scenario 8: Relations traversal (entity ancestry)

- **Execution time**: 0.088 ms
- **Planning time**: 0.957 ms
- **Plan shape**: Index Scan on `refresh_state_references_target_entity_ref_idx` -> Nested Loop -> Index Scan on `final_entities_entity_ref_uniq`; LIMIT short-circuits
- **Anti-patterns detected**: None (0 rows returned -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 9: Stitching: incoming reference count

- **Execution time**: 0.095 ms
- **Planning time**: 0.380 ms
- **Plan shape**: Index Only Scan on `refresh_state_references_target_entity_ref_idx` -> Aggregate
- **Anti-patterns detected**: None (0 rows matched -- entity ref not present in test data; plan shape is correct)
- **Buffers**: shared hit=4

## Scenario 10: Adversarial: unfiltered count

- **Execution time**: 1317.422 ms
- **Planning time**: 1.020 ms
- **Plan shape**: Gather (2 workers) -> Parallel Index Only Scan on `search_key_value_entity_idx` (key='metadata.name') -> Memoize -> Index Scan on `final_entities_pkey` -> Partial Aggregate -> Finalize Aggregate
- **Anti-patterns detected**: Memoize cache evictions observed (~100-121K evictions per worker, 8MB cache cap). This is inherent to counting the full ~471K entity catalog. No seq scans detected.
- **Buffers**: shared hit=2334531

## Scenario 11: Relations: orphan detection anti-join

- **Execution time**: 255.679 ms
- **Planning time**: 1.013 ms
- **Plan shape**: Gather (2 workers) -> Parallel Hash Anti Join: Parallel Seq Scan on `refresh_state` -> Parallel Hash (Parallel Seq Scan on `refresh_state_references`); LIMIT 100
- **Anti-patterns detected**: Seq Scans on both `refresh_state` and `refresh_state_references`, but this is expected for a Hash Anti Join strategy. Temp file spills observed (temp read=7144, written=11160) due to the hash table exceeding `work_mem`. Despite the seq scans, the Parallel Hash Anti Join completes in ~256ms, which is a dramatic improvement over the previous Nested Loop Anti Join that timed out at >30s.
- **Buffers**: shared hit=279619, temp read=7144 written=11160

---

## Summary

| Scenario                           | Execution Time | Verdict                                                     |
| ---------------------------------- | -------------- | ----------------------------------------------------------- |
| 1. Paginated list (kind=component) | 12.5 ms        | OK -- improved                                              |
| 2. Count (kind=component)          | 1068.1 ms      | OK -- improved (counting ~55K components)                   |
| 3. Paginated list (no filter)      | 0.1 ms         | Excellent                                                   |
| 4. Facets (kind=template)          | 3.7 ms         | OK -- slight regression (196 templates vs previous 9)       |
| 5. Facets (kind=component)         | 972.5 ms       | OK (large result set, index scans throughout)               |
| 6. Entity by ref                   | 0.1 ms         | Excellent                                                   |
| 7. Full-text filter (LIKE)         | 903.5 ms       | Acceptable -- regression (see comparison notes)             |
| 8. Relations traversal             | 0.1 ms         | Excellent                                                   |
| 9. Stitching ref count             | 0.1 ms         | Excellent                                                   |
| 10. Unfiltered count               | 1317.4 ms      | OK -- improved (smaller catalog)                            |
| 11. Orphan detection               | 255.7 ms       | **FIXED** -- Hash Anti Join replaces Nested Loop (was >30s) |

---

## Comparison with previous baseline (2026-05-16)

### Catalog size changes

The catalog has shrunk since the last run: ~474K entities (was ~545K), ~476K `refresh_state` (was ~984K), ~478K `refresh_state_references` (was ~547K). The `refresh_state` table halved in size, which significantly affects scenarios that touch it.

### Improvements

- **Scenario 1** (Paginated list): 12.5ms vs 20.4ms (39% faster). Plan switched from serial to Gather Merge with 2 parallel workers while maintaining the same index-driven approach.
- **Scenario 2** (Count): 1068ms vs 1943ms (45% faster). Plan changed from Parallel Bitmap Heap Scan to a serial HashAggregate-driven approach. The improvement is partly from the smaller catalog and partly from a better plan choice.
- **Scenario 3** (Paginated no filter): 0.1ms vs 0.2ms. Consistently excellent.
- **Scenario 10** (Unfiltered count): 1317ms vs 2236ms (41% faster). Same plan shape. The improvement is proportional to the catalog size reduction (~471K vs ~544K). Memoize evictions reduced (~100-121K vs 134K per worker).
- **Scenario 11** (Orphan detection): **255ms vs >30s TIMEOUT**. This is the most significant change. The planner now chooses a Parallel Hash Anti Join instead of the previous Nested Loop Anti Join. The Hash Anti Join scans both tables in parallel and builds a hash table for the join, which is far more efficient when most rows have matches. This fix was likely enabled by the smaller `refresh_state` table (476K vs 984K rows), which may have crossed a threshold in the planner's cost model. Note: temp file spills are observed but acceptable at this scale.

### Regressions

- **Scenario 4** (Facets kind=template): 3.7ms vs 1.1ms (3.3x slower). This is due to a data change: there are now 196 templates vs 9 previously. The plan shape is healthy (all index scans), and 3.7ms is still fast. Not a query regression.
- **Scenario 7** (Full-text LIKE filter): 903ms vs 566ms (60% slower). The plan strategy changed: the previous run drove from the kind=component index and applied the LIKE filter early via Memoize, while the current run uses a HashAggregate approach that evaluates all ~55K components before filtering. Both plans scan all components (unavoidable with a leading-wildcard LIKE), but the previous plan was more efficient at short-circuiting. The component count also grew from ~46K to ~55K. Worth monitoring.
- **Scenario 5** (Facets kind=component): 972ms vs 931ms (4% slower). Within noise. Plan changed from Parallel Gather Merge with `search_facets_covering_idx` to a serial HashAggregate approach. Both are healthy.

### Plan shape changes (no performance impact)

- **Scenario 6** (Entity by ref): Identical plan shape and timing.
- **Scenario 8** (Relations traversal): Identical plan shape. Timing consistent.
- **Scenario 9** (Stitching ref count): Identical plan shape. Timing consistent.
