# Query Performance Baseline

Readable representative `EXPLAIN (ANALYZE, BUFFERS)` output is recorded in
[`plans.md`](./plans.md), with the exact canonical final-run JSON output in
[`plans.json`](./plans.json).

**Date**: 2026-09-12
**Database**: Production-scale staging replica
**Catalog size**: ~739K `final_entities`, ~21.9M planner-estimated `search`
rows, ~6.1M `relations`, ~739K `refresh_state_references`, and ~739K
`refresh_state` rows
**Statistics**: `search.entity_id n_distinct = -0.0429023`, followed by
`ANALYZE search` and `VACUUM search`; `refresh_state` analyzed after its row
estimate had drifted to 1.28M
**Table sizes**: `search` 43GB total (34GB heap, 9.1GB indexes), `relations`
2.3GB total (1.7GB heap), and `refresh_state` 11GB total
**Selected kind counts**: 46,036 components, 14 templates, 202,704 APIs, and
257,064 subcomponents

## Scenario 1: Paginated entity list (kind=component, ordered by name)

- **Execution time**: 22.6ms median (22.1-22.7ms)
- **Planning time**: 3.287 ms
- **Plan shape**: Gather Merge (2 workers) -> Nested Loop -> Nested Loop:
  Parallel Index Only Scan on `search_key_value_entity_idx`
  (key='metadata.name') -> Index Scan on `final_entities_pkey` -> Index Only
  Scan on `search_key_value_entity_idx` (EXISTS kind=component); LIMIT
  short-circuits after 21 rows
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

- **Execution time**: 1.60s median (1.53-1.93s)
- **Planning time**: 1.591 ms
- **Plan shape**: Limit -> Gather (2 workers) -> Parallel Hash Anti Join:
  Parallel Sequential Scan on `refresh_state` -> Parallel Hash of a Parallel
  Sequential Scan on `refresh_state_references`
- **Anti-patterns detected**: Both tables are scanned in full, including the
  10GB `refresh_state` heap. The plan avoids the catastrophic nested-loop
  amplification seen with stale `refresh_state` row statistics, but remains
  above the 500ms target.
- **Buffers**: shared hit=299896 read=1008342

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
  repeated correlated `search_entity_key_value_idx` probes for the `kind` and
  `spec.type` predicates. The two relation predicates are each collected once
  into hashed subplans using `search_key_value_entity_idx`. All 77,199 Memoize
  lookups miss because the ordered candidates have distinct entity IDs, and
  LIMIT short-circuits after 2,001 rows
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

| Scenario                          | Legacy `-1` | Corrected `-0.0429023` | Effective plan comparison                                       |
| --------------------------------- | ----------: | ---------------------: | --------------------------------------------------------------- |
| 1. Paginated component list       |     22.1 ms |                22.6 ms | Same ordered parallel index plan                                |
| 2. Component count                |    465.2 ms |               452.5 ms | Same parallel hash-join and nested-loop plan                    |
| 3. Unfiltered page                |    0.147 ms |               0.146 ms | Same `final_entities` index scan                                |
| 4. Template facets                |    0.883 ms |               0.838 ms | Same nested-loop index plan                                     |
| 5. Component facets               |    641.6 ms |               631.7 ms | Corrected plan uses partial aggregation; same scans and joins   |
| 6. Entity lookup                  |    0.126 ms |               0.124 ms | Same unique-index lookup                                        |
| 7. Full-text component filter     |     15.2 ms |                14.9 ms | Same ordered parallel index plan                                |
| 8. Ancestry step                  |    0.156 ms |               0.134 ms | Same nested-loop index plan                                     |
| 9. Incoming reference count       |    0.162 ms |               0.215 ms | Same index-only scan; sub-millisecond variance                  |
| 10. Unfiltered count              |    556.0 ms |               514.0 ms | Same parallel hash-join plan                                    |
| 11. Orphan anti-join              |    Excluded |               Excluded | Runs invalidated by stale, unrelated `refresh_state` statistics |
| 12. Ordered selective disjunction |       2.90s |                  2.76s | Corrected plan adds a Memoize node with no cache hits           |

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

Scenario 11 is excluded from this controlled comparison because both runs used
an unrelated stale `refresh_state` row estimate of 1.28M for 739K actual rows.
That state produced a Nested Loop Anti Join taking approximately 10-13s. After
`ANALYZE refresh_state`, the canonical plan is a Parallel Hash Anti Join with a
1.60s median runtime.

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
| 11. Orphan detection               | 1.60s          | Needs work; scans the 10GB `refresh_state` heap   |
| 12. Ordered selective disjunction  | 2.76s          | Known slow case; branches are individually faster |

---

## Comparison with previous baseline (2026-05-18)

### Catalog size changes

The staging catalog is larger than the previous production-scale baseline:
approximately 739K entities versus 474K, 21.9M planner-estimated search rows
versus 13.2M, 6.1M relations versus 3.5M, and 739K refresh-state rows versus
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
- **Scenario 11** (orphan detection): 1.60s versus 255.7ms. The current
  Parallel Hash Anti Join avoids nested-loop amplification but scans the full
  10GB `refresh_state` heap. This remains the main regression in the current
  battery.

### Plan shape changes (no performance impact)

- Scenarios 3, 6, 8, and 9 retain their expected index-driven plans and remain
  sub-millisecond.

### New known-slow scenario

- Scenario 12 is new in this baseline. Its isolated workflow and dataset
  branches remain approximately 40 times faster than their ordered
  disjunction.

---

## Deep-page additions (2026-10-06)

Scenarios 13 and 14 were measured independently on a production-scale staging
read replica running PostgreSQL 18.6 with `work_mem = 32MB`. These additions do
not replace the historical measurements for scenarios 1-12 above.

An accompanying catalog count returned 720,486 non-null final entities. The
scenario coverage checks found 204,085 entities matching `kind=api` and
`spec.type=dataset`. These checks are separate snapshots of a live catalog,
not one fixed snapshot shared by all runs. The planner estimated
717,280 rows in `final_entities` and 29,530,400 rows in `search`.
The `search.entity_id` distinct-value override was `-0.042962253`; no statistics
or database settings were changed for these measurements.

Both scenarios use fixed synthetic SQL cursor boundaries, not public API
cursor tokens. ID `'e'` leaves 25,418 matches (skipping 87.5%); the name/ID pair
`('s', 'e')` leaves 20,358 matches (skipping 90.0%). Both return 10,001 rows:
a complete 10,000-entity page plus the extra row used to detect another page.
Recheck these counts when measuring against different data: a boundary with
few earlier matches or an incomplete page no longer represents this workload.

Each median below uses three warm runs after one warm-up. A further warm run
was captured as JSON, followed by a separate readable plan capture; their
individual timings need not equal the median. Full plans are retained in
[`plans.md`](./plans.md) and [`plans.json`](./plans.json).

| Scenario                   | Warm execution times   | Median   | Shared buffer hits in JSON sample |
| -------------------------- | ---------------------- | -------- | --------------------------------- |
| 13. Deep dataset ID page   | 287.2, 283.5, 291.0 ms | 287.2 ms | 417,176                           |
| 14. Deep dataset name page | 766.9, 756.2, 742.5 ms | 756.2 ms | 892,931                           |

Both JSON samples have zero shared buffer reads and zero temporary blocks
written. Buffer hits count accesses, not distinct blocks or bytes transferred.

### Scenario 13: range scan with substantial filter-index work

The `final_entities` primary-key scan applies `entity_id > 'e'` as an index
condition. However, the merge joins still walk the leading entries of the
`kind=api` and `spec.type=dataset` search indexes: about 189,000 entries each
in the readable plan, despite returning only 10,001 rows. This is useful
reference work that a first-page test would not expose.

### Scenario 14: ordered scan with a late cursor filter

The plan uses parallel ordered search scans and a Gather Merge, without a
blocking sort. The cursor remains a filter rather than an index range:
the readable plan discards about 626,000 earlier search entries across three
processes and performs 52,427 final-entity and dataset-filter lookups.
Its warm sub-second runtime therefore still hides substantial buffer work.
Retain both the plan and the timing when comparing future query shapes.

## Conditional permission additions (2026-10-29)

Scenarios 15-19 were measured on a production-scale staging read replica
running PostgreSQL 18.6, with `work_mem = 32MB` and then with `work_mem = 4MB`
set for the session. JIT was not available on this server. These additions do
not replace the earlier measurements for scenarios 1-14, and they measure the
query builder as of this date.

The catalog had 708,061 non-null final entities, including 46,059 components,
207,168 APIs, 99,405 resources, 221,199 subcomponents and 18 templates. The
planner estimated 720,304 rows in `final_entities` and 20,777,516 rows in
`search`. These are snapshots of a live catalog, not one fixed snapshot shared
by all runs.

The readers key was a real annotation present on 878 entities, none of whose
values matched the claims. Scenario 17 used the same key as its rare facet.
The claims came from one real user. The 40-claim list is that user's actual
sign-in claims, whose ownership covers 433 entities. The 173-claim list is the
same user's unfiltered group memberships, covering 435 entities. The two lists
therefore differ mainly in length, not in what they match. Claim lists are
redacted in the plans.

Each 32MB median uses three warm runs after one warm-up, with a 30-second
statement timeout. The 4MB figures are single warm runs after one warm-up.
Readable plans for the 40-claim, 32MB runs are retained in
[`plans.md`](./plans.md), and the final JSON samples in
[`plans.json`](./plans.json).

| Query                          | 40 claims: warm runs      | Median  | Shared buffer hits | 173 claims: median | 40 claims at 4MB | 173 claims at 4MB |
| ------------------------------ | ------------------------- | ------- | ------------------ | ------------------ | ---------------- | ----------------- |
| 15 permission kind facets      | 21.94 s, 21.52 s, 21.28 s | 21.52 s | 10,571,889         | > 30 s (timeout)   | 10.49 s          | 10.58 s           |
| 15 permission list page        | 3.2 ms, 3.0 ms, 3.1 ms    | 3.1 ms  | 890                | 26.2 ms            | 2.9 ms           | 25.2 ms           |
| 15 permission list count       | 24.46 s, 25.08 s, 24.51 s | 24.51 s | 10,283,627         | > 30 s (timeout)   | 23.43 s          | > 30 s (timeout)  |
| 16 permission component facets | 2.01 s, 1.98 s, 1.99 s    | 1.99 s  | 959,836            | > 30 s (timeout)   | 2.71 s           | > 30 s (timeout)  |
| 16 permission component page   | 4.5 ms, 4.6 ms, 4.4 ms    | 4.5 ms  | 1,485              | > 30 s (timeout)   | 4.5 ms           | 53.1 ms           |
| 16 permission component count  | 1.92 s, 1.96 s, 1.93 s    | 1.93 s  | 956,095            | > 30 s (timeout)   | 1.92 s           | > 30 s (timeout)  |
| 17 permission rare facet       | 29.4 ms, 30.0 ms, 29.4 ms | 29.4 ms | 13,676             | 1.01 s             | 33.5 ms          | 1.02 s            |
| 18 negated disjunction facets  | 14.84 s, 15.65 s, 15.15 s | 15.15 s | 7,034,031          | > 30 s (timeout)   | 10.49 s          | 10.24 s           |
| 18 negated disjunction count   | 17.76 s, 17.88 s, 17.98 s | 17.88 s | 6,745,777          | > 30 s (timeout)   | 17.06 s          | > 30 s (timeout)  |
| 19 large in under or page      | 2.8 ms, 2.7 ms, 2.7 ms    | 2.7 ms  | 891                | 15.5 ms            | 2.5 ms           | 15.6 ms           |

Buffer hits count accesses, not distinct blocks or bytes transferred. None of
the JSON samples read shared buffers from disk. The 15 list count and the 18
count wrote temporary blocks at both settings. The 15 kind facets and 18 facets
queries also did at 4MB.

### Scenarios 15 and 18: per-entity SubPlans

The facets and count queries in scenarios 15 and 18 take 15-25 seconds with 40
claims and exceed the timeout with 173 claims at `work_mem = 32MB`. Each one
performs 7-11 million buffer hits. In the plans, the filter is attached to a
`final_entities_pkey` lookup under a Nested Loop, where the planner expects one
row per loop. Some `EXISTS` / `NOT EXISTS` conditions are therefore kept as
correlated SubPlans, which run about 708,000 times each. In scenario 18,
PostgreSQL pushed the negation through the `OR`, but the resulting
`NOT EXISTS` still ran as a per-row SubPlan rather than an anti-join. The list
page in scenario 15 stays at a few milliseconds because LIMIT stops early.

### Scenario 16: claim-dependent cost behind a selective request filter

With 40 claims, the `kind = 'component'` facets and count queries take about 2
seconds, and the page takes 4.5 ms. With 173 claims and `work_mem = 32MB`, all
three exceed the timeout. The `kind` semi-join drives a Nested Loop into the filtered entities,
so the `= ANY(:claims)` probe runs once per component. Each probe sorts the
claims array again. At 4MB the planner happened to choose a different plan for
the page (53.1 ms), but not for the facets or count queries.

### Scenario 17: rare facet key

The rare facet stays fast with 40 claims (29.4 ms) but takes about a second
with 173 claims, with similar buffer work (13,676 against 17,656 hits). The
difference is CPU time in per-row `= ANY(:claims)` probes, not I/O. In
experiments on the same replica, query shapes that build the whole filtered
entity set before joining it to the few facet rows took over a second here,
regardless of the number of claims.

### Scenario 19: LIMIT short-circuiting under a broad `$any`

The page takes 2.7 ms with 40 claims and 15.5 ms with 173 claims, at both
`work_mem` settings. This is the reference for future changes to how `$in` is
compiled. Compiling the broad `kind` branch into a pre-built set would prevent
LIMIT from stopping early.

## Set operations for facets and counts (2026-10-30)

On PostgreSQL, facets and count queries now compile filters that contain a
disjunction or a negation, after negations are pushed down, into set
operations on entity IDs. Each field condition is a set of `search.entity_id`
values under `COLLATE "C"`, so sorting IDs and removing duplicates is a byte
comparison, and the set is joined back under the default collation so that
the `entity_id` indexes can be used. Paginated queries and filters without a
disjunction or negation keep their SQL.

### Staging replica

Measured on the staging replica described above (PostgreSQL 18.6, about 710k
entities, 17.5M `search` rows) with SQL captured from `DefaultEntitiesCatalog`.
Medians of three warm runs at `work_mem = 32MB`; master was a single run after
a warm-up in the same session. Within a single `REPEATABLE READ` snapshot, every
changed facets and count query returned the same result as master, except
where master did not finish. No query timed out at 32MB or 4MB.

| Query                                               | master           | this change      |
| --------------------------------------------------- | ---------------- | ---------------- |
| 15 kind facets, 40 claims                           | 10.7 s           | 1.58 s \*        |
| 15 lifecycle facets, 40 / 173 claims                | 15.2 s / >30 s   | 1.28 / 1.28 s \* |
| 15 count, 40 / 173 claims                           | 24.1 s / >30 s   | 1.45 / 1.45 s \* |
| 16 component facets, 40 / 173 claims                | 2.10 s / >30 s   | 1.03 / 1.00 s \* |
| 16 component count, 40 / 173 claims                 | 1.95 s / >30 s   | 1.02 / 1.01 s \* |
| 17 rare facet, 40 / 173 claims                      | 30.5 ms / 1.07 s | 5.8 / 10.6 ms \* |
| 18 negated facets, 40 claims                        | 10.8 s           | 0.60 s \*        |
| 18 negated count, 40 / 173 claims                   | 17.7 s / >30 s   | 1.61 / 1.66 s \* |
| 19 large `$in` under `$any`, count, 40 / 173 claims | 18.6 s / >30 s   | 2.69 / 2.64 s    |
| permission + `kind=template` facets, 40 claims      | 0.4 ms           | 3.5 ms           |
| permission + owned by claims facets, 40 claims      | 17.4 ms          | 15.9 ms          |
| `$not` of `kind $in` (subcomponent, api), facets    | 0.90 s           | 0.83 s \*        |
| `$not` of a two-field condition, count              | 2.25 s           | 1.47 s \*        |
| scenario 12's `$any` filter, with `totalItems`      | 6.50 s           | 0.81 s           |

\* Measured with leaf sets built from `search` before the collation change was
added. With the collation change, these stayed within run-to-run variation.

With a claim for a group that owns 116k entities, broad facets and counts take
1.5-2.9 s, where master took 7 s or timed out. Selective queries pay for
building that group's set: permission + `kind=template` facets and the rare
facet take about 145 ms. Scenario 18's facets with 173 claims take 1.6 s
because of a different join order. Scenario 19's count for that user took
6.8 s in one run at 32MB, from the existing sort-key `EXISTS` in the count
query rather than from the set.

Readable plans for the facets and count queries of scenarios 15-19 with this
change, using the 40-claim sign-in at 32MB and 4MB, are retained in
[`plans.md`](./plans.md), and the exact JSON output in
[`plans.json`](./plans.json). At 32MB only scenario 19's count writes
temporary files (about 79MB). At 4MB every set-based query except the rare
facet spills, by 67-181MB, with execution times within about 25% of 32MB.

### Local synthetic catalog

These measurements come from a synthetic catalog in a local PostgreSQL 17.11
Docker container: 75,100 entities and 1,308,204 `search` rows. 1,479 entities
have the readers annotation, which scenario 17 also uses as its rare facet
key. The 40 claims match 3,182 owned entities. JIT was disabled. Each figure is
the median of three warm runs after one warm-up, shown as master / this change.

| Query                                      | 32MB: time      | 32MB: shared hits | 4MB: time        | 4MB: shared hits |
| ------------------------------------------ | --------------- | ----------------- | ---------------- | ---------------- |
| 15 permission kind facets                  | 417.7 / 57.6 ms | 588,815 / 8,857   | 397.8 / 56.2 ms  | 588,815 / 8,857  |
| 15 permission list page                    | 1.2 / 1.2 ms    | 434 / 434         | 1.1 / 1.2 ms     | 434 / 434        |
| 15 permission list count                   | 525.4 / 69.9 ms | 589,349 / 9,391   | 506.8 / 75.5 ms  | 589,349 / 9,391  |
| 16 permission component facets             | 365.6 / 57.5 ms | 536,549 / 9,296   | 375.2 / 66.0 ms  | 536,549 / 9,296  |
| 16 permission component page               | 64.0 / 61.6 ms  | 80,875 / 80,875   | 67.7 / 69.3 ms   | 80,875 / 80,875  |
| 16 permission component count              | 208.0 / 78.0 ms | 353,349 / 9,769   | 210.9 / 81.8 ms  | 353,349 / 9,769  |
| 17 permission rare facet                   | 10.3 / 3.3 ms   | 11,759 / 704      | 11.6 / 3.2 ms    | 11,759 / 704     |
| 18 negated disjunction facets              | 380.2 / 58.3 ms | 601,866 / 8,767   | 370.0 / 50.4 ms  | 601,866 / 8,767  |
| 18 negated disjunction count               | 485.7 / 30.9 ms | 602,400 / 9,752   | 520.7 / 29.8 ms  | 602,400 / 9,751  |
| 19 large in under or page                  | 0.2 / 0.1 ms    | 174 / 174         | 0.1 / 0.1 ms     | 174 / 174        |
| 19 large in under or count                 | 513.1 / 63.9 ms | 602,400 / 12,074  | 469.5 / 115.3 ms | 602,400 / 10,075 |
| permission + `kind=template` facets        | 1.4 / 3.4 ms    | 1,258 / 537       | 1.5 / 3.5 ms     | 1,258 / 537      |
| `$not` of `kind $in` (system, api), facets | 49.3 / 50.8 ms  | 8,805 / 8,805     | 52.2 / 51.9 ms   | 8,805 / 8,805    |

The page queries run the same SQL before and after, so their timing
differences are run-to-run variation.

## Long `$in` lists (2026-11-12)

On PostgreSQL, a long `$in` list on a field other than `kind`,
`metadata.namespace`, `spec.type` and `spec.lifecycle` can be matched as a set
of entity IDs computed once per query, instead of a per-row `= ANY(array)`
probe. The rule, from `src/service/request/longInLists.ts`:

- A list that is a direct condition of the filter, reached from the root
  through `$all` only, is a set from 10 values. It is an IN set when a
  narrower condition is next to it, and joined otherwise. This is the shape of
  the owned entities page.
- A list inside an `$any` or a `$not`, such as the claims of the conditional
  permission policy in scenarios 15-19, is a set only from 100 values, and not
  on a first page of up to 100 entities. It is an IN set, or joined when
  negated, so that it can be anti-joined.
- A list that is joined for one condition reuses that set where the same list
  appears again.
- Lookups by entity ref, facets and counts of filters with a disjunction or a
  negation, and lists shorter than 10 values keep the SQL they had before.

### Setup

- Beta read replica of a production-like catalog: PostgreSQL 18.6, 745,776
  entities, `work_mem = 32MB`. The largest group owns 117,449 entities. This
  is not production, so compare ratios and plan shapes rather than absolute
  timings.
- Master is `175375aebc2f`. Master and this change ran interleaved in the
  same session, case by case.
- `EXPLAIN (ANALYZE, BUFFERS)` of the SQL captured from `DefaultEntitiesCatalog`,
  median of three runs after one warm-up, with a 30 s statement timeout.
  Streams are paged `queryEntities` calls ordered by entity ID, 10,000 per
  page, timed by wall clock, one run each (two for the unfiltered stream).
- Claim lists of 3, 10 and 40 claims, and one of 174 that includes the
  largest group. Every case returned the same entities as master.
- Not measured: scenarios 9 and 11, whose SQL this change does not touch, and
  `work_mem = 4MB`.

### Same SQL as master

- Every scenario without permissions, and every 3-claim variant.
- All facets and counts: scenarios 2, 4, 5, 10, and the facets and counts of
  15-18.
- Lookups by entity ref (scenario 6), with 1 and with 1,000 refs.
- Scenario 21, whose lists are on `spec.type`.
- Every first page with permissions: scenarios 1, 3, 7, 15, 16, 18 and 19 at
  all claim counts, including scenario 1 with a namespace condition.
- Every 10- and 40-claim variant of scenarios 12, 13, 14 and 20.

### Different SQL

| Query                           | Claims |        master | this change |
| ------------------------------- | -----: | ------------: | ----------: |
| Owned page                      |     10 |         72 ms |       34 ms |
| Owned page                      |     40 |        3.40 s |      359 ms |
| Owned page                      |    174 |        6.60 s |      3.67 s |
| Owned page, namespace           |     40 |        3.44 s |      400 ms |
| Owned page, namespace           |    174 |        6.66 s |      3.72 s |
| 12 ordered selective OR         |    174 |        5.41 s |      2.98 s |
| 13 deep dataset ID              |    174 |        572 ms |      589 ms |
| 14 deep dataset name            |    174 |         >30 s |      5.01 s |
| 20 late group page              |    174 |       18.27 s |      1.68 s |
| 20 late component page          |    174 |        527 ms |      2.42 s |
| Component stream, total / worst |    174 | 40.0 / 10.3 s | 9.0 / 2.6 s |
| Group stream, total / worst     |    174 |  18.3 / 9.3 s | 5.0 / 2.6 s |
| Unfiltered stream, total        |    174 |   60.5-66.7 s | 58.6-61.2 s |

The component and group streams at 40 claims, and the unfiltered stream at 40
claims, have the same SQL as master and took the same time (8.2-8.4 s, 4.9-5.2
s and 49-53 s).

The one regression is scenario 20 for components with 174 claims. On master,
the page walks the names from the cursor and checks each of the 85 candidates
per row. With the hashed set, the planner instead filters all entities up
front, materializes the 45,872 permitted components, and scans that again for
each of the 85 candidates (3.9 million rows removed by the join filter). The
same page for groups, where master checks far more candidates, goes from
18.3 s to 1.7 s.

### Rules that were measured and not used

All on the same replica and claim lists, against master:

- Every long list as a set from 10 values, JOIN or IN chosen from the
  siblings (the first version of this change). Every permissioned first page
  became slower, up to 15-30 times with 174 claims (scenario 15: 20 ms to
  617 ms). Scenario 14 with 40 claims went from 2.6 s to 25 s: the planner
  estimated the joined set at 653 rows instead of 17,787, chose a nested loop,
  and scanned the materialized set again for each of the 10,001 rows.
- The same with a threshold of 40: the same results at 40 and 174 claims,
  including the 25 s case.
- The same with a threshold of 100: no regressions at 10 and 40 claims, but
  first pages with 174 claims stayed at 0.6-0.8 s.
- The chosen rule with JOIN instead of IN for lists inside an `$any`: faster
  for late pages (scenario 20 for groups 1.07 s, for components 1.11 s) but
  slower for scenarios 13 (1.08 s) and 14 (6.3 s) and the streams, and exposed
  to the misestimate above.

## Hashed per-row probes (2026-11-12)

A per-row probe of a long list now compares `(value || '') = ANY(list)` in a
subquery with `OFFSET 0`, instead of `value = ANY(list)`. As an index
condition, the list is sorted again by every probe, about 0.43 ms for 99
values. As an expression, it is checked against a hash that PostgreSQL builds
once per query: about 0.012 ms per probe, whatever the list length. The
`OFFSET 0` keeps PostgreSQL from turning the probe into an uncorrelated hashed
set, which would then read every row of the key, since the list is no longer
in the index condition.

The hashed probe is used from 100 values, and on pages of up to 100 entities
from 10 values. Pages of up to 100 entities now also count as small when they
have a cursor, so long lists inside an `$any` or a `$not` stay per row on late
pages too.

### Setup

- The same beta replica as above, now 752,912 entities, with `work_mem` at
  32MB. Master is `33ee6b59f2bc`, which includes the change above. Master and
  this change ran interleaved in the same session, case by case, with medians
  of three runs.
- Claim lists of 3, 10, 40 and 99 claims, 99 claims that include the largest
  group (117,501 entities), and 174 claims that include it.
- Measured: every scenario in the harness with every claim list, with and
  without permissions, including facets, counts, by-ref lookups, the
  namespace variants, the owned entities pages and the component, group,
  unfiltered, owned and scenario 21 streams. Scenarios 9 and 11 are not in
  the harness and do not compile `$in` filters. Every query case returned the
  same entities as master. Five streams over most of the catalog differed in
  checksum, by one to a few dozen entities, from changes to the replica
  between the two runs.

### Results

| Query                                 | Claims   | master | this change |
| ------------------------------------- | -------- | -----: | ----------: |
| 1 component page                      | 40       |  22 ms |        3 ms |
| 1 component page                      | 174      |  43 ms |        3 ms |
| 1 component page in a namespace       | 10       |   5 ms |       13 ms |
| 1 component page in a namespace       | 99       |  48 ms |       13 ms |
| 3 unfiltered page                     | 40       |  19 ms |        1 ms |
| 3 unfiltered page                     | 174      | 157 ms |        1 ms |
| 3 unfiltered page                     | 99 large | 174 ms |        1 ms |
| 15 list page                          | 99       |  46 ms |        2 ms |
| 16 component page                     | 99       |  48 ms |        4 ms |
| 18 negated page                       | 99       |  47 ms |        1 ms |
| 19 with permission page               | 99       |  93 ms |        3 ms |
| 6 by ref, 1,000 refs                  | 174      | 196 ms |       57 ms |
| 20 late group page                    | 99       | 1.43 s |      469 ms |
| 20 late group page                    | 99 large | 9.67 s |      465 ms |
| 20 late group page                    | 174      | 1.76 s |      465 ms |
| 20 late component page                | 174      | 2.54 s |      465 ms |
| Owned page, with permission           | 99 large | 4.86 s |      681 ms |
| Owned page, with permission           | 174      | 4.13 s |      612 ms |
| Owned page in a namespace, permission | 174      | 4.19 s |      3.31 s |

Everything else measured within noise of master: scenarios 7, 12, 13 and 14
at all claim counts, facets and counts, which use the set compiler, by-ref
lookups below 100 claims, scenario 21, the owned pages without permissions,
and all streams. This removes the scenario 20 regression of the change above.

The one slower case is the component page in a namespace with 10 claims,
from 5 ms to 13 ms. It is the shortest list that is hashed, and the hashed
probe costs a little more than the plain one there. Every longer list on
that page got faster.

Scenario 14 with 99 claims that include the largest group is still as slow
as on master, 24 s on both. It is a page of 10,000 entities with fewer than
100 values, so it keeps the plain probe.

### Rules that were measured and not used

- The hashed probe without `OFFSET 0`, from 9 values everywhere. Where the
  planner turned the probe into a hashed set, it read the whole key instead:
  scenario 3 with 40 claims went from 20 ms to 260 ms, scenario 12 at 10-99
  claims from 3.5 s to 5.7 s, and scenario 21 with broad types from 0.67 s
  to 1.16 s.
- The hashed probe with `OFFSET 0`, from 9 values everywhere. It fixed the
  above, and scenario 14 with 99 claims including the largest group (23.8 s
  to 3.4 s), but deep scans with shorter lists got slower, since PostgreSQL
  could no longer build the matching set from the index: scenario 12 at
  10-99 claims from 3.6 s to 5.7 s, scenario 13 from 0.43 s to 1.1 s, and
  scenario 14 from 2.6 s to 3.5 s.
- Either of those without sets for lists inside an `$any` or a `$not`. The
  same, and scenario 12 with 174 claims went from 3.0 s to 5.7 s.
- Sorting the list before sending it. PostgreSQL sorts it again on every
  probe, which is cheap only if the list is already in the column's collation
  order. A JavaScript sort does not match the `en_US` collation of the database (6 of 99 claims
  out of place) and saved only a quarter of the time. Sorting in the query,
  with `ANY(ARRAY(SELECT ... ORDER BY))`, saved 70% per probe, but hid the
  values from the planner: scenario 14 with 99 claims went from 2.6 s to
  14 s.
