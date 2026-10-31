# Catalog Query Performance Plans

Representative `EXPLAIN (ANALYZE, BUFFERS)` output for the canonical
2026-09-12 production-scale staging replica run. The queries correspond
to the numbered scenarios in `queries.md`; timings in `baseline.md` are
medians from three warm runs, while each plan below is one representative
warm execution captured immediately afterward. The exact JSON plans from the
final measured sample are preserved in [`plans.json`](./plans.json), including
its cache state and buffer counts.

## 1 paginated component

```text
Limit  (cost=1001.82..2163.81 rows=21 width=1084) (actual time=19.491..22.163 rows=21.00 loops=1)
  Buffers: shared hit=4815
  ->  Gather Merge  (cost=1001.82..3754550.57 rows=67836 width=1084) (actual time=19.489..22.158 rows=21.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=4815
        ->  Nested Loop  (cost=1.80..3745720.58 rows=28265 width=1084) (actual time=1.142..4.128 rows=14.67 loops=3)
              Join Filter: ((final_entities.entity_id)::text = (s.entity_id)::text)
              Buffers: shared hit=4815
              ->  Nested Loop  (cost=1.11..2359323.83 rows=393075 width=1121) (actual time=0.111..2.151 rows=164.00 loops=3)
                    Buffers: shared hit=2315
                    ->  Parallel Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..92773.58 rows=394561 width=73) (actual time=0.059..0.181 rows=164.00 loops=3)
                          Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                          Heap Fetches: 18
                          Index Searches: 1
                          Buffers: shared hit=345
                    ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..5.74 rows=1 width=1048) (actual time=0.012..0.012 rows=1.00 loops=492)
                          Index Cond: ((entity_id)::text = (search.entity_id)::text)
                          Filter: (final_entity IS NOT NULL)
                          Index Searches: 492
                          Buffers: shared hit=1970
              ->  Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..3.51 rows=1 width=37) (actual time=0.012..0.012 rows=0.09 loops=492)
                    Index Cond: ((key = 'kind'::text) AND (value = 'component'::text) AND (entity_id = (search.entity_id)::text))
                    Heap Fetches: 3
                    Index Searches: 492
                    Buffers: shared hit=2500
Planning:
  Buffers: shared hit=386
Planning Time: 3.065 ms
Execution Time: 22.387 ms
```

## 2 component count

```text
Finalize Aggregate  (cost=206172.13..206172.14 rows=1 width=8) (actual time=422.276..425.196 rows=1.00 loops=1)
  Buffers: shared hit=425703
  ->  Gather  (cost=206171.91..206172.12 rows=2 width=8) (actual time=421.642..425.187 rows=3.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=425703
        ->  Partial Aggregate  (cost=205171.91..205171.92 rows=1 width=8) (actual time=415.726..415.730 rows=1.00 loops=3)
              Buffers: shared hit=425703
              ->  Nested Loop  (cost=5575.00..205101.25 rows=28265 width=0) (actual time=14.726..414.143 rows=15345.33 loops=3)
                    Buffers: shared hit=425703
                    ->  Parallel Hash Join  (cost=5574.32..126021.66 rows=22092 width=74) (actual time=14.612..189.499 rows=15345.33 loops=3)
                          Hash Cond: ((final_entities.entity_id)::text = (s.entity_id)::text)
                          Buffers: shared hit=159399
                          ->  Parallel Seq Scan on final_entities  (cost=0.00..119640.88 rows=307226 width=37) (actual time=0.014..99.492 rows=245296.33 loops=3)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 859
                                Buffers: shared hit=116557
                          ->  Parallel Hash  (cost=5297.13..5297.13 rows=22175 width=37) (actual time=14.279..14.280 rows=15345.33 loops=3)
                                Buckets: 65536  Batches: 1  Memory Usage: 3808kB
                                Buffers: shared hit=42842
                                ->  Parallel Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..5297.13 rows=22175 width=37) (actual time=0.065..8.026 rows=15345.33 loops=3)
                                      Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                      Heap Fetches: 1494
                                      Index Searches: 1
                                      Buffers: shared hit=42842
                    ->  Index Only Scan using search_entity_key_value_idx on search  (cost=0.69..3.57 rows=1 width=37) (actual time=0.014..0.014 rows=1.00 loops=46036)
                          Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.name'::text) AND (value IS NOT NULL))
                          Heap Fetches: 1537
                          Index Searches: 46036
                          Buffers: shared hit=266304
Planning:
  Buffers: shared hit=410
Planning Time: 2.970 ms
Execution Time: 425.512 ms
```

## 3 unfiltered page

```text
Limit  (cost=0.55..16.03 rows=21 width=1121) (actual time=0.042..0.088 rows=21.00 loops=1)
  Buffers: shared hit=25
  ->  Index Scan using final_entities_entity_ref_uniq on final_entities  (cost=0.55..543614.07 rows=737342 width=1121) (actual time=0.041..0.085 rows=21.00 loops=1)
        Filter: (final_entity IS NOT NULL)
        Index Searches: 1
        Buffers: shared hit=25
Planning:
  Buffers: shared hit=124
Planning Time: 0.607 ms
Execution Time: 0.236 ms
```

## 4 template facets

```text
GroupAggregate  (cost=386.66..387.15 rows=28 width=69) (actual time=0.606..0.610 rows=2.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=160
  ->  Sort  (cost=386.66..386.73 rows=28 width=61) (actual time=0.596..0.597 rows=14.00 loops=1)
        Sort Key: search.original_value
        Sort Method: quicksort  Memory: 25kB
        Buffers: shared hit=160
        ->  Nested Loop  (cost=1.80..385.98 rows=28 width=61) (actual time=0.111..0.546 rows=14.00 loops=1)
              Join Filter: ((search.entity_id)::text = (s.entity_id)::text)
              Buffers: shared hit=157
              ->  Nested Loop  (cost=1.11..211.79 rows=24 width=74) (actual time=0.059..0.252 rows=14.00 loops=1)
                    Buffers: shared hit=73
                    ->  Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..9.17 rows=24 width=37) (actual time=0.035..0.042 rows=14.00 loops=1)
                          Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                          Heap Fetches: 0
                          Index Searches: 1
                          Buffers: shared hit=17
                    ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..8.44 rows=1 width=37) (actual time=0.014..0.014 rows=1.00 loops=14)
                          Index Cond: ((entity_id)::text = (s.entity_id)::text)
                          Filter: (final_entity IS NOT NULL)
                          Index Searches: 14
                          Buffers: shared hit=56
              ->  Index Scan using search_entity_key_value_idx on search  (cost=0.69..7.25 rows=1 width=98) (actual time=0.020..0.020 rows=1.00 loops=14)
                    Index Cond: (((entity_id)::text = (final_entities.entity_id)::text) AND ((key)::text = 'spec.type'::text))
                    Filter: (original_value IS NOT NULL)
                    Index Searches: 14
                    Buffers: shared hit=84
Planning:
  Buffers: shared hit=399
Planning Time: 2.823 ms
Execution Time: 0.824 ms
```

## 5 component facets

```text
Finalize GroupAggregate  (cost=235478.91..241766.80 rows=19719 width=69) (actual time=582.428..598.476 rows=37.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=811710
  ->  Gather Merge  (cost=235478.91..241332.98 rows=47326 width=69) (actual time=582.103..598.442 rows=77.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=811710
        ->  Partial GroupAggregate  (cost=234478.89..234870.36 rows=19719 width=69) (actual time=573.561..575.731 rows=25.67 loops=3)
              Group Key: search.original_value
              Buffers: shared hit=811710
              ->  Sort  (cost=234478.89..234543.65 rows=25904 width=61) (actual time=573.316..574.117 rows=15345.33 loops=3)
                    Sort Key: search.original_value
                    Sort Method: quicksort  Memory: 968kB
                    Buffers: shared hit=811710
                    Worker 0:  Sort Method: quicksort  Memory: 975kB
                    Worker 1:  Sort Method: quicksort  Memory: 969kB
                    ->  Parallel Hash Join  (cost=129056.20..232580.01 rows=25904 width=61) (actual time=216.051..568.306 rows=15345.33 loops=3)
                          Hash Cond: ((final_entities.entity_id)::text = (s.entity_id)::text)
                          Buffers: shared hit=811694
                          ->  Parallel Hash Join  (cost=123481.88..226060.05 rows=360244 width=135) (actual time=201.688..482.093 rows=231001.00 loops=3)
                                Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
                                Buffers: shared hit=768846
                                ->  Parallel Index Only Scan using search_facets_covering_idx on search  (cost=0.69..101629.64 rows=361606 width=98) (actual time=0.104..129.825 rows=231001.00 loops=3)
                                      Index Cond: (key = 'spec.type'::text)
                                      Heap Fetches: 42227
                                      Index Searches: 1
                                      Buffers: shared hit=652289
                                ->  Parallel Hash  (cost=119640.88..119640.88 rows=307226 width=37) (actual time=199.150..199.151 rows=245296.33 loops=3)
                                      Buckets: 1048576  Batches: 1  Memory Usage: 60096kB
                                      Buffers: shared hit=116557
                                      ->  Parallel Seq Scan on final_entities  (cost=0.00..119640.88 rows=307226 width=37) (actual time=0.015..96.492 rows=245296.33 loops=3)
                                            Filter: (final_entity IS NOT NULL)
                                            Rows Removed by Filter: 859
                                            Buffers: shared hit=116557
                          ->  Parallel Hash  (cost=5297.13..5297.13 rows=22175 width=37) (actual time=11.870..11.871 rows=15345.33 loops=3)
                                Buckets: 65536  Batches: 1  Memory Usage: 3808kB
                                Buffers: shared hit=42848
                                ->  Parallel Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..5297.13 rows=22175 width=37) (actual time=0.046..6.530 rows=15345.33 loops=3)
                                      Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                      Heap Fetches: 1494
                                      Index Searches: 1
                                      Buffers: shared hit=42848
Planning:
  Buffers: shared hit=399
Planning Time: 2.816 ms
Execution Time: 598.811 ms
```

## 6 entity by ref

```text
Index Scan using final_entities_entity_ref_uniq on final_entities  (cost=0.55..8.57 rows=1 width=1011) (actual time=0.043..0.044 rows=0.00 loops=1)
  Index Cond: ((entity_ref)::text = 'component:default/my-service'::text)
  Index Searches: 1
  Buffers: shared hit=4
Planning:
  Buffers: shared hit=115
Planning Time: 0.595 ms
Execution Time: 0.112 ms
```

## 7 full text component

```text
Limit  (cost=1001.82..95000.20 rows=4 width=1084) (actual time=11.815..14.966 rows=21.00 loops=1)
  Buffers: shared hit=18754
  ->  Gather Merge  (cost=1001.82..95000.20 rows=4 width=1084) (actual time=11.813..14.960 rows=21.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=18754
        ->  Nested Loop  (cost=1.80..93999.72 rows=2 width=1084) (actual time=4.123..4.914 rows=15.00 loops=3)
              Buffers: shared hit=18754
              ->  Nested Loop  (cost=1.11..93928.83 rows=20 width=1121) (actual time=3.661..4.661 rows=16.00 loops=3)
                    Buffers: shared hit=18473
                    ->  Parallel Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..93759.98 rows=20 width=73) (actual time=3.603..4.407 rows=16.00 loops=3)
                          Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                          Filter: ((value)::text ~~ '%player%'::text)
                          Rows Removed by Filter: 8716
                          Heap Fetches: 2064
                          Index Searches: 1
                          Buffers: shared hit=18279
                    ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..8.44 rows=1 width=1048) (actual time=0.015..0.015 rows=1.00 loops=48)
                          Index Cond: ((entity_id)::text = (search.entity_id)::text)
                          Filter: (final_entity IS NOT NULL)
                          Index Searches: 48
                          Buffers: shared hit=194
              ->  Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..3.54 rows=1 width=37) (actual time=0.015..0.015 rows=0.94 loops=48)
                    Index Cond: ((key = 'kind'::text) AND (value = 'component'::text) AND (entity_id = (final_entities.entity_id)::text))
                    Heap Fetches: 2
                    Index Searches: 48
                    Buffers: shared hit=281
Planning:
  Buffers: shared hit=388
Planning Time: 3.586 ms
Execution Time: 15.200 ms
```

## 8 ancestry step

```text
Limit  (cost=1.10..17.14 rows=1 width=1152) (actual time=0.039..0.040 rows=0.00 loops=1)
  Buffers: shared hit=4
  ->  Nested Loop  (cost=1.10..17.14 rows=1 width=1152) (actual time=0.038..0.038 rows=0.00 loops=1)
        Buffers: shared hit=4
        ->  Index Scan using refresh_state_references_target_entity_ref_idx on refresh_state_references  (cost=0.55..8.57 rows=1 width=68) (actual time=0.037..0.037 rows=0.00 loops=1)
              Index Cond: (target_entity_ref = 'component:default/my-service'::text)
              Index Searches: 1
              Buffers: shared hit=4
        ->  Index Scan using final_entities_entity_ref_uniq on final_entities  (cost=0.55..8.57 rows=1 width=1084) (never executed)
              Index Cond: ((entity_ref)::text = refresh_state_references.source_entity_ref)
              Index Searches: 0
Planning:
  Buffers: shared hit=291
Planning Time: 1.472 ms
Execution Time: 0.149 ms
```

## 9 incoming reference count

```text
Aggregate  (cost=8.57..8.58 rows=1 width=8) (actual time=0.058..0.059 rows=1.00 loops=1)
  Buffers: shared hit=4
  ->  Index Only Scan using refresh_state_references_target_entity_ref_idx on refresh_state_references  (cost=0.55..8.57 rows=1 width=0) (actual time=0.055..0.056 rows=0.00 loops=1)
        Index Cond: (target_entity_ref = 'component:default/my-service'::text)
        Heap Fetches: 0
        Index Searches: 1
        Buffers: shared hit=4
Planning:
  Buffers: shared hit=146
Planning Time: 0.660 ms
Execution Time: 0.179 ms
```

## 10 unfiltered count

```text
Finalize Aggregate  (cost=219273.41..219273.42 rows=1 width=8) (actual time=505.823..516.296 rows=1.00 loops=1)
  Buffers: shared hit=527469
  ->  Gather  (cost=219273.19..219273.40 rows=2 width=8) (actual time=499.933..516.280 rows=3.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=527469
        ->  Partial Aggregate  (cost=218273.19..218273.20 rows=1 width=8) (actual time=494.163..494.167 rows=1.00 loops=3)
              Buffers: shared hit=527469
              ->  Parallel Hash Join  (cost=123481.89..217290.50 rows=393075 width=0) (actual time=213.371..477.433 rows=245296.33 loops=3)
                    Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
                    Buffers: shared hit=527469
                    ->  Parallel Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..92773.58 rows=394561 width=37) (actual time=0.131..110.531 rows=245296.33 loops=3)
                          Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                          Heap Fetches: 44308
                          Index Searches: 1
                          Buffers: shared hit=410912
                    ->  Parallel Hash  (cost=119640.88..119640.88 rows=307226 width=37) (actual time=210.596..210.597 rows=245296.33 loops=3)
                          Buckets: 1048576  Batches: 1  Memory Usage: 60096kB
                          Buffers: shared hit=116557
                          ->  Parallel Seq Scan on final_entities  (cost=0.00..119640.88 rows=307226 width=37) (actual time=0.009..104.142 rows=245296.33 loops=3)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 859
                                Buffers: shared hit=116557
Planning:
  Buffers: shared hit=366
Planning Time: 2.298 ms
Execution Time: 516.534 ms
```

## 11 orphan anti-join

```text
Limit  (cost=20183.08..1320484.95 rows=1 width=110) (actual time=182.464..1610.855 rows=100.00 loops=1)
  Buffers: shared hit=299896 read=1008342
  ->  Gather  (cost=20183.08..1320484.95 rows=1 width=110) (actual time=182.463..1610.793 rows=100.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=299896 read=1008342
        ->  Parallel Hash Anti Join  (cost=19183.08..1319484.85 rows=1 width=110) (actual time=180.152..1580.009 rows=61.67 loops=3)
              Hash Cond: ((refresh_state.entity_ref)::text = refresh_state_references.target_entity_ref)
              Buffers: shared hit=299896 read=1008342
              ->  Parallel Seq Scan on refresh_state  (cost=0.00..1299143.29 rows=308929 width=110) (actual time=0.013..1177.208 rows=246275.00 loops=3)
                    Buffers: shared hit=287712 read=1008342
              ->  Parallel Hash  (cost=15294.70..15294.70 rows=311070 width=73) (actual time=173.630..173.631 rows=246213.33 loops=3)
                    Buckets: 1048576  Batches: 1  Memory Usage: 86976kB
                    Buffers: shared hit=12184
                    ->  Parallel Seq Scan on refresh_state_references  (cost=0.00..15294.70 rows=311070 width=73) (actual time=0.016..41.535 rows=246213.33 loops=3)
                          Buffers: shared hit=12184
Settings: work_mem = '32MB', effective_cache_size = '24687808kB'
Planning:
  Buffers: shared hit=326
Planning Time: 1.591 ms
Execution Time: 1611.097 ms
```

## 12 ordered selective OR

```text
Limit  (cost=1.12..460301.57 rows=2001 width=1084) (actual time=1981.103..2891.729 rows=2001.00 loops=1)
  Buffers: shared hit=1298315
  ->  Nested Loop  (cost=1.12..50861935.03 rows=221105 width=1084) (actual time=1981.101..2891.316 rows=2001.00 loops=1)
        Buffers: shared hit=1298315
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..98297.44 rows=946947 width=73) (actual time=0.046..46.414 rows=77199.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 4988
              Index Searches: 1
              Buffers: shared hit=56104
        ->  Memoize  (cost=0.43..55.50 rows=1 width=1048) (actual time=0.037..0.037 rows=0.03 loops=77199)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 77199  Evictions: 0  Overflows: 0  Memory Usage: 8693kB
              Buffers: shared hit=1242211
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..55.49 rows=1 width=1048) (actual time=0.035..0.035 rows=0.03 loops=77199)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND ((EXISTS(SubPlan 1) AND EXISTS(SubPlan 3) AND (ANY ((entity_id)::text = (hashed SubPlan 6).col1))) OR (EXISTS(SubPlan 7) AND EXISTS(SubPlan 9) AND (ANY ((entity_id)::text = (hashed SubPlan 12).col1)))))
                    Rows Removed by Filter: 1
                    Index Searches: 77199
                    Buffers: shared hit=1242211
                    SubPlan 1
                      ->  Index Only Scan using search_entity_key_value_idx on search s  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.14 loops=77199)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'kind'::text) AND (value = 'subcomponent'::text))
                            Heap Fetches: 706
                            Index Searches: 77199
                            Buffers: shared hit=392269
                    SubPlan 3
                      ->  Index Only Scan using search_entity_key_value_idx on search s_1  (cost=0.69..8.71 rows=1 width=0) (actual time=0.009..0.009 rows=1.00 loops=10626)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.type'::text) AND (value = 'workflow'::text))
                            Heap Fetches: 702
                            Index Searches: 10626
                            Buffers: shared hit=59394
                    SubPlan 6
                      ->  Index Only Scan using search_key_value_entity_idx on search s_2  (cost=0.69..8.91 rows=11 width=32) (actual time=0.082..0.684 rows=1084.00 loops=1)
                            Index Cond: ((key = 'relations.partof'::text) AND (value = 'component:default/content_analytics_dbt'::text))
                            Heap Fetches: 189
                            Index Searches: 1
                            Buffers: shared hit=565
                    SubPlan 7
                      ->  Index Only Scan using search_entity_key_value_idx on search s_3  (cost=0.69..8.71 rows=1 width=0) (actual time=0.008..0.008 rows=0.23 loops=76121)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'kind'::text) AND (value = 'api'::text))
                            Heap Fetches: 1349
                            Index Searches: 76121
                            Buffers: shared hit=386916
                    SubPlan 9
                      ->  Index Only Scan using search_entity_key_value_idx on search s_4  (cost=0.69..8.71 rows=1 width=0) (actual time=0.009..0.009 rows=0.99 loops=17346)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.type'::text) AND (value = 'dataset'::text))
                            Heap Fetches: 1350
                            Index Searches: 17346
                            Buffers: shared hit=92999
                    SubPlan 12
                      ->  Index Only Scan using search_key_value_entity_idx on search s_5  (cost=0.69..8.81 rows=6 width=32) (actual time=0.073..0.897 rows=934.00 loops=1)
                            Index Cond: ((key = 'relations.apiprovidedby'::text) AND (value = 'component:default/content_analytics_dbt'::text))
                            Heap Fetches: 196
                            Index Searches: 1
                            Buffers: shared hit=906
Planning:
  Buffers: shared hit=342
Planning Time: 5.165 ms
Execution Time: 2892.599 ms
```

## Deep-page additions (2026-10-06)

These two plans were captured separately from scenarios 1-12, on a PostgreSQL
18.6 staging replica. See the dated section in [baseline.md](./baseline.md)
for data sizes, cursor coverage and measurement methodology. The JSON samples
are separate warm executions of the same SQL.

## 13 deep dataset ID

```text
Limit  (cost=4.92..142882.61 rows=10001 width=1056) (actual time=205.186..282.342 rows=10001.00 loops=1)
  Buffers: shared hit=417176
  ->  Merge Join  (cost=4.92..339434.08 rows=23759 width=1056) (actual time=205.184..281.522 rows=10001.00 loops=1)
        Merge Cond: ((final_entities.entity_id)::text = (s.entity_id)::text)
        Buffers: shared hit=417176
        ->  Merge Join  (cost=4.23..302237.32 rows=43283 width=1093) (actual time=103.168..169.484 rows=10001.00 loops=1)
              Merge Cond: ((final_entities.entity_id)::text = (s_1.entity_id)::text)
              Buffers: shared hit=226502
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..267849.25 rows=85940 width=1056) (actual time=0.050..44.923 rows=35282.00 loops=1)
                    Index Cond: ((entity_id)::text > 'e'::text)
                    Filter: (final_entity IS NOT NULL)
                    Rows Removed by Filter: 120
                    Index Searches: 1
                    Buffers: shared hit=35793
              ->  Index Only Scan using search_key_value_entity_idx on search s_1  (cost=0.69..33025.56 rows=361255 width=37) (actual time=0.042..70.954 rows=188668.00 loops=1)
                    Index Cond: ((key = 'spec.type'::text) AND (value = 'dataset'::text))
                    Heap Fetches: 14512
                    Index Searches: 1
                    Buffers: shared hit=190709
        ->  Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..35970.16 rows=393739 width=37) (actual time=0.051..70.201 rows=188985.00 loops=1)
              Index Cond: ((key = 'kind'::text) AND (value = 'api'::text))
              Heap Fetches: 14536
              Index Searches: 1
              Buffers: shared hit=190674
Planning:
  Buffers: shared hit=390
Planning Time: 3.159 ms
Execution Time: 283.120 ms
```

## 14 deep dataset name

```text
Limit  (cost=1002.51..243454.49 rows=10001 width=1092) (actual time=128.535..754.575 rows=10001.00 loops=1)
  Buffers: shared hit=892306
  ->  Nested Loop  (cost=1002.51..2602494.49 rows=107310 width=1092) (actual time=128.534..753.467 rows=10001.00 loops=1)
        Buffers: shared hit=892306
        ->  Gather Merge  (cost=1001.82..1839947.13 rows=195489 width=1166) (actual time=128.464..626.181 rows=10001.00 loops=1)
              Workers Planned: 2
              Workers Launched: 2
              Buffers: shared hit=838077
              ->  Nested Loop  (cost=1.80..1816382.82 rows=81454 width=1166) (actual time=119.932..540.531 rows=3345.67 loops=3)
                    Buffers: shared hit=838077
                    ->  Nested Loop  (cost=1.11..1185527.58 rows=161728 width=1129) (actual time=119.663..311.655 rows=17475.67 loops=3)
                          Buffers: shared hit=571647
                          ->  Parallel Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..102835.09 rows=162315 width=73) (actual time=119.591..132.946 rows=17475.67 loops=3)
                                Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                                Filter: (((value)::text > 's'::text) OR ((value)::text = 's'::text))
                                Rows Removed by Filter: 208829
                                Heap Fetches: 41992
                                Index Searches: 1
                                Buffers: shared hit=361926
                          ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..6.66 rows=1 width=1056) (actual time=0.010..0.010 rows=1.00 loops=52427)
                                Index Cond: ((entity_id)::text = (search.entity_id)::text)
                                Filter: ((final_entity IS NOT NULL) AND (((search.value)::text > 's'::text) OR (((search.value)::text = 's'::text) AND ((entity_id)::text > 'e'::text))))
                                Index Searches: 52427
                                Buffers: shared hit=209721
                    ->  Index Only Scan using search_key_value_entity_idx on search s_1  (cost=0.69..3.90 rows=1 width=37) (actual time=0.013..0.013 rows=0.19 loops=52427)
                          Index Cond: ((key = 'spec.type'::text) AND (value = 'dataset'::text) AND (entity_id = (final_entities.entity_id)::text))
                          Heap Fetches: 625
                          Index Searches: 52427
                          Buffers: shared hit=266430
        ->  Index Only Scan using search_key_value_entity_idx on search s  (cost=0.69..3.90 rows=1 width=37) (actual time=0.012..0.012 rows=1.00 loops=10001)
              Index Cond: ((key = 'kind'::text) AND (value = 'api'::text) AND (entity_id = (final_entities.entity_id)::text))
              Heap Fetches: 623
              Index Searches: 10001
              Buffers: shared hit=54229
Planning:
  Buffers: shared hit=458
Planning Time: 5.463 ms
Execution Time: 756.023 ms
```

## Conditional permission additions (2026-10-29)

These plans were captured separately from scenarios 1-14, on a PostgreSQL 18.6
staging replica with `work_mem = 32MB`, using a real 40-claim sign-in. Claim
lists are redacted as `':claims'`. See the dated section in
[baseline.md](./baseline.md) for data sizes and measurement methodology. The
JSON samples are separate warm executions of the same SQL.

## 15 permission kind facets

```text
GroupAggregate  (cost=1.12..273487967.27 rows=20668 width=70) (actual time=787.535..21266.488 rows=11.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=10571889
  ->  Nested Loop  (cost=1.12..273485347.84 rows=482551 width=62) (actual time=3.707..21132.704 rows=707298.00 loops=1)
        Buffers: shared hit=10571889
        ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..107015.48 rows=842608 width=99) (actual time=0.029..333.626 rows=708058.00 loops=1)
              Index Cond: (key = 'kind'::text)
              Heap Fetches: 34638
              Index Searches: 1
              Buffers: shared hit=660176
        ->  Memoize  (cost=0.43..439.56 rows=1 width=37) (actual time=0.029..0.029 rows=1.00 loops=708058)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 708058  Evictions: 313293  Overflows: 0  Memory Usage: 65537kB
              Buffers: shared hit=9911713
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..439.55 rows=1 width=37) (actual time=0.028..0.028 rows=1.00 loops=708058)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                    Rows Removed by Filter: 0
                    Index Searches: 708058
                    Buffers: shared hit=9911713
                    SubPlan 8
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=32) (actual time=0.030..0.030 rows=0.00 loops=1)
                            Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=5
                    SubPlan 10
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.13 rows=22 width=32) (actual time=0.029..0.037 rows=18.00 loops=1)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=22
                    SubPlan 11
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=0) (actual time=0.009..0.009 rows=0.00 loops=708040)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                            Heap Fetches: 0
                            Index Searches: 708040
                            Buffers: shared hit=3540200
                    SubPlan 13
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (never executed)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 16
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..9.13 rows=22 width=32) (never executed)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 2
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.509..1.477 rows=434.00 loops=1)
                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 14
                            Index Searches: 34
                            Buffers: shared hit=535
                    SubPlan 4
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..191.93 rows=3 width=32) (actual time=0.436..0.436 rows=0.00 loops=1)
                            Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 0
                            Index Searches: 2
                            Buffers: shared hit=10
                    SubPlan 5
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_2  (cost=0.69..8.71 rows=1 width=0) (actual time=0.010..0.010 rows=0.00 loops=707607)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                            Heap Fetches: 19
                            Index Searches: 707607
                            Buffers: shared hit=3538708
Planning:
  Buffers: shared hit=20
Planning Time: 3.152 ms
Execution Time: 21277.872 ms
```

## 15 permission list page

```text
Limit  (cost=1.12..15554.52 rows=21 width=1103) (actual time=2.405..3.189 rows=21.00 loops=1)
  Buffers: shared hit=890
  ->  Nested Loop  (cost=1.12..370087122.68 rows=499687 width=1103) (actual time=2.404..3.185 rows=21.00 loops=1)
        Buffers: shared hit=890
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..95730.88 rows=872531 width=73) (actual time=0.024..0.049 rows=21.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 0
              Index Searches: 1
              Buffers: shared hit=24
        ->  Memoize  (cost=0.43..439.55 rows=1 width=1067) (actual time=0.149..0.149 rows=1.00 loops=21)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 21  Evictions: 0  Overflows: 0  Memory Usage: 27kB
              Buffers: shared hit=866
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..439.54 rows=1 width=1067) (actual time=0.134..0.134 rows=1.00 loops=21)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                    Index Searches: 21
                    Buffers: shared hit=866
                    SubPlan 8
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=32) (actual time=0.037..0.037 rows=0.00 loops=1)
                            Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=5
                    SubPlan 10
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.13 rows=22 width=32) (actual time=0.027..0.074 rows=18.00 loops=1)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=22
                    SubPlan 11
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=0) (actual time=0.013..0.013 rows=0.00 loops=21)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                            Heap Fetches: 0
                            Index Searches: 21
                            Buffers: shared hit=105
                    SubPlan 13
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (never executed)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 16
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..9.13 rows=22 width=32) (never executed)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 2
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.488..1.401 rows=434.00 loops=1)
                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 14
                            Index Searches: 34
                            Buffers: shared hit=535
                    SubPlan 4
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..191.93 rows=3 width=32) (actual time=0.359..0.359 rows=0.00 loops=1)
                            Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 0
                            Index Searches: 2
                            Buffers: shared hit=10
                    SubPlan 5
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_2  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.00 loops=21)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                            Heap Fetches: 0
                            Index Searches: 21
                            Buffers: shared hit=105
Planning:
  Buffers: shared hit=20
Planning Time: 3.304 ms
Execution Time: 3.364 ms
```

## 15 permission list count

```text
Aggregate  (cost=247985498.51..247985498.52 rows=1 width=8) (actual time=24650.909..24650.915 rows=1.00 loops=1)
  Buffers: shared hit=10283631, temp read=2366 written=4240
  I/O Timings: temp read=8.756 write=30.313
  ->  Nested Loop  (cost=97912.64..247984490.48 rows=403212 width=0) (actual time=607.241..24577.938 rows=707298.00 loops=1)
        Buffers: shared hit=10283631, temp read=2366 written=4240
        I/O Timings: temp read=8.756 write=30.313
        ->  HashAggregate  (cost=97912.21..103550.16 rows=563795 width=37) (actual time=605.306..1113.932 rows=708058.00 loops=1)
              Group Key: (search.entity_id)::text
              Batches: 5  Memory Usage: 65593kB  Disk Usage: 19872kB
              Buffers: shared hit=371925, temp read=2366 written=4240
              I/O Timings: temp read=8.756 write=30.313
              ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..95730.88 rows=872531 width=37) (actual time=0.040..232.025 rows=708058.00 loops=1)
                    Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                    Heap Fetches: 35380
                    Index Searches: 1
                    Buffers: shared hit=371925
        ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..439.66 rows=1 width=37) (actual time=0.033..0.033 rows=1.00 loops=708058)
              Index Cond: ((entity_id)::text = (search.entity_id)::text)
              Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
              Rows Removed by Filter: 0
              Index Searches: 708058
              Buffers: shared hit=9911706
              SubPlan 8
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=32) (actual time=0.027..0.028 rows=0.00 loops=1)
                      Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                      Heap Fetches: 0
                      Index Searches: 1
                      Buffers: shared hit=5
              SubPlan 10
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.13 rows=22 width=32) (actual time=0.023..0.028 rows=18.00 loops=1)
                      Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                      Heap Fetches: 0
                      Index Searches: 1
                      Buffers: shared hit=22
              SubPlan 11
                ->  Index Only Scan using search_entity_key_value_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.00 loops=708040)
                      Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                      Heap Fetches: 0
                      Index Searches: 708040
                      Buffers: shared hit=3540200
              SubPlan 13
                ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (never executed)
                      Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                      Heap Fetches: 0
                      Index Searches: 0
              SubPlan 16
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..9.13 rows=22 width=32) (never executed)
                      Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                      Heap Fetches: 0
                      Index Searches: 0
              SubPlan 2
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.456..1.306 rows=434.00 loops=1)
                      Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                      Heap Fetches: 14
                      Index Searches: 34
                      Buffers: shared hit=535
              SubPlan 4
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..191.93 rows=3 width=32) (actual time=0.368..0.368 rows=0.00 loops=1)
                      Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                      Heap Fetches: 0
                      Index Searches: 2
                      Buffers: shared hit=10
              SubPlan 5
                ->  Index Only Scan using search_entity_key_value_idx on search search_flt_2  (cost=0.69..8.71 rows=1 width=0) (actual time=0.010..0.010 rows=0.00 loops=707607)
                      Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                      Heap Fetches: 19
                      Index Searches: 707607
                      Buffers: shared hit=3538701
Planning:
  Buffers: shared hit=20
Planning Time: 3.115 ms
Execution Time: 24659.758 ms
```

## 16 permission component facets

```text
GroupAggregate  (cost=21721730.88..21722173.34 rows=20668 width=70) (actual time=1979.545..1986.823 rows=37.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=959836
  ->  Sort  (cost=21721730.88..21721809.47 rows=31438 width=62) (actual time=1979.526..1982.151 rows=45317.00 loops=1)
        Sort Key: search.original_value
        Sort Method: quicksort  Memory: 3256kB
        Buffers: shared hit=959836
        ->  Nested Loop  (cost=1.81..21719382.42 rows=31438 width=62) (actual time=2.367..1959.897 rows=45317.00 loops=1)
              Join Filter: ((search.entity_id)::text = (search_flt.entity_id)::text)
              Buffers: shared hit=959836
              ->  Nested Loop  (cost=1.12..21503668.48 rows=28558 width=74) (actual time=2.352..1482.926 rows=45317.00 loops=1)
                    Buffers: shared hit=687934
                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..5518.72 rows=49866 width=37) (actual time=0.048..22.216 rows=46059.00 loops=1)
                          Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                          Heap Fetches: 1452
                          Index Searches: 1
                          Buffers: shared hit=42958
                    ->  Memoize  (cost=0.43..442.74 rows=1 width=37) (actual time=0.031..0.031 rows=0.98 loops=46059)
                          Cache Key: search_flt.entity_id
                          Cache Mode: logical
                          Hits: 0  Misses: 46059  Evictions: 0  Overflows: 0  Memory Usage: 7597kB
                          Buffers: shared hit=644976
                          ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..442.73 rows=1 width=37) (actual time=0.030..0.030 rows=0.98 loops=46059)
                                Index Cond: ((entity_id)::text = (search_flt.entity_id)::text)
                                Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                                Rows Removed by Filter: 0
                                Index Searches: 46059
                                Buffers: shared hit=644976
                                SubPlan 8
                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=32) (actual time=0.032..0.033 rows=0.00 loops=1)
                                        Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                        Heap Fetches: 0
                                        Index Searches: 1
                                        Buffers: shared hit=5
                                SubPlan 10
                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.13 rows=22 width=32) (actual time=0.050..0.062 rows=18.00 loops=1)
                                        Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                        Heap Fetches: 0
                                        Index Searches: 1
                                        Buffers: shared hit=22
                                SubPlan 11
                                  ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (actual time=0.010..0.010 rows=0.00 loops=46059)
                                        Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                                        Heap Fetches: 0
                                        Index Searches: 46059
                                        Buffers: shared hit=230295
                                SubPlan 13
                                  ->  Index Only Scan using search_entity_key_value_idx on search search_flt_7  (cost=0.69..8.71 rows=1 width=0) (never executed)
                                        Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                                        Heap Fetches: 0
                                        Index Searches: 0
                                SubPlan 16
                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..9.13 rows=22 width=32) (never executed)
                                        Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                        Heap Fetches: 0
                                        Index Searches: 0
                                SubPlan 2
                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.446..1.314 rows=434.00 loops=1)
                                        Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                        Heap Fetches: 14
                                        Index Searches: 34
                                        Buffers: shared hit=535
                                SubPlan 4
                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.93 rows=3 width=32) (actual time=0.377..0.377 rows=0.00 loops=1)
                                        Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                        Heap Fetches: 0
                                        Index Searches: 2
                                        Buffers: shared hit=10
                                SubPlan 5
                                  ->  Index Only Scan using search_entity_key_value_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.02 loops=45840)
                                        Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                                        Heap Fetches: 19
                                        Index Searches: 45840
                                        Buffers: shared hit=229873
              ->  Index Scan using search_entity_key_value_idx on search  (cost=0.69..7.54 rows=1 width=99) (actual time=0.010..0.010 rows=1.00 loops=45317)
                    Index Cond: (((entity_id)::text = (final_entities.entity_id)::text) AND ((key)::text = 'spec.type'::text))
                    Filter: (original_value IS NOT NULL)
                    Index Searches: 45317
                    Buffers: shared hit=271902
Planning:
  Buffers: shared hit=64
Planning Time: 3.450 ms
Execution Time: 1987.079 ms
```

## 16 permission component page

```text
Limit  (cost=1.81..227012.83 rows=21 width=1103) (actual time=2.355..4.725 rows=21.00 loops=1)
  Buffers: shared hit=1485
  ->  Nested Loop  (cost=1.81..373952018.94 rows=34593 width=1103) (actual time=2.354..4.720 rows=21.00 loops=1)
        Join Filter: ((final_entities.entity_id)::text = (search_flt.entity_id)::text)
        Buffers: shared hit=1485
        ->  Nested Loop  (cost=1.12..372179563.18 rows=499687 width=1140) (actual time=2.332..4.138 rows=45.00 loops=1)
              Buffers: shared hit=1243
              ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..95730.88 rows=872531 width=73) (actual time=0.023..0.047 rows=45.00 loops=1)
                    Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                    Heap Fetches: 0
                    Index Searches: 1
                    Buffers: shared hit=41
              ->  Memoize  (cost=0.43..442.04 rows=1 width=1067) (actual time=0.090..0.090 rows=1.00 loops=45)
                    Cache Key: search.entity_id
                    Cache Mode: logical
                    Hits: 0  Misses: 45  Evictions: 0  Overflows: 0  Memory Usage: 51kB
                    Buffers: shared hit=1202
                    ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..442.03 rows=1 width=1067) (actual time=0.083..0.083 rows=1.00 loops=45)
                          Index Cond: ((entity_id)::text = (search.entity_id)::text)
                          Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                          Index Searches: 45
                          Buffers: shared hit=1202
                          SubPlan 8
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=32) (actual time=0.023..0.023 rows=0.00 loops=1)
                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                  Heap Fetches: 0
                                  Index Searches: 1
                                  Buffers: shared hit=5
                          SubPlan 10
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.13 rows=22 width=32) (actual time=0.025..0.034 rows=18.00 loops=1)
                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                  Heap Fetches: 0
                                  Index Searches: 1
                                  Buffers: shared hit=22
                          SubPlan 11
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (actual time=0.013..0.013 rows=0.00 loops=45)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                                  Heap Fetches: 0
                                  Index Searches: 45
                                  Buffers: shared hit=225
                          SubPlan 13
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_7  (cost=0.69..8.71 rows=1 width=0) (never executed)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                                  Heap Fetches: 0
                                  Index Searches: 0
                          SubPlan 16
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..9.13 rows=22 width=32) (never executed)
                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                  Heap Fetches: 0
                                  Index Searches: 0
                          SubPlan 2
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.492..1.440 rows=434.00 loops=1)
                                  Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                  Heap Fetches: 14
                                  Index Searches: 34
                                  Buffers: shared hit=535
                          SubPlan 4
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.93 rows=3 width=32) (actual time=0.399..0.400 rows=0.00 loops=1)
                                  Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                  Heap Fetches: 0
                                  Index Searches: 2
                                  Buffers: shared hit=10
                          SubPlan 5
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.00 loops=45)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                                  Heap Fetches: 0
                                  Index Searches: 45
                                  Buffers: shared hit=225
        ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..3.53 rows=1 width=37) (actual time=0.012..0.012 rows=0.47 loops=45)
              Index Cond: ((key = 'kind'::text) AND (value = 'component'::text) AND (entity_id = (search.entity_id)::text))
              Heap Fetches: 0
              Index Searches: 45
              Buffers: shared hit=242
Planning:
  Buffers: shared hit=64
Planning Time: 4.127 ms
Execution Time: 4.859 ms
```

## 16 permission component count

```text
Aggregate  (cost=21610568.02..21610568.03 rows=1 width=8) (actual time=1909.538..1909.542 rows=1.00 loops=1)
  Buffers: shared hit=956095
  ->  Nested Loop Semi Join  (cost=1.81..21610498.23 rows=27914 width=0) (actual time=2.141..1904.139 rows=45317.00 loops=1)
        Buffers: shared hit=956095
        ->  Nested Loop  (cost=1.12..21503668.48 rows=28558 width=74) (actual time=2.129..1466.803 rows=45317.00 loops=1)
              Buffers: shared hit=687934
              ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..5518.72 rows=49866 width=37) (actual time=0.025..21.368 rows=46059.00 loops=1)
                    Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                    Heap Fetches: 1452
                    Index Searches: 1
                    Buffers: shared hit=42958
              ->  Memoize  (cost=0.43..442.74 rows=1 width=37) (actual time=0.031..0.031 rows=0.98 loops=46059)
                    Cache Key: search_flt.entity_id
                    Cache Mode: logical
                    Hits: 0  Misses: 46059  Evictions: 0  Overflows: 0  Memory Usage: 7597kB
                    Buffers: shared hit=644976
                    ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..442.73 rows=1 width=37) (actual time=0.030..0.030 rows=0.98 loops=46059)
                          Index Cond: ((entity_id)::text = (search_flt.entity_id)::text)
                          Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                          Rows Removed by Filter: 0
                          Index Searches: 46059
                          Buffers: shared hit=644976
                          SubPlan 8
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=32) (actual time=0.022..0.022 rows=0.00 loops=1)
                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                  Heap Fetches: 0
                                  Index Searches: 1
                                  Buffers: shared hit=5
                          SubPlan 10
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.13 rows=22 width=32) (actual time=0.020..0.029 rows=18.00 loops=1)
                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                  Heap Fetches: 0
                                  Index Searches: 1
                                  Buffers: shared hit=22
                          SubPlan 11
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (actual time=0.010..0.010 rows=0.00 loops=46059)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                                  Heap Fetches: 0
                                  Index Searches: 46059
                                  Buffers: shared hit=230295
                          SubPlan 13
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_7  (cost=0.69..8.71 rows=1 width=0) (never executed)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                                  Heap Fetches: 0
                                  Index Searches: 0
                          SubPlan 16
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..9.13 rows=22 width=32) (never executed)
                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                  Heap Fetches: 0
                                  Index Searches: 0
                          SubPlan 2
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.454..1.319 rows=434.00 loops=1)
                                  Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                  Heap Fetches: 14
                                  Index Searches: 34
                                  Buffers: shared hit=535
                          SubPlan 4
                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.93 rows=3 width=32) (actual time=0.347..0.347 rows=0.00 loops=1)
                                  Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                  Heap Fetches: 0
                                  Index Searches: 2
                                  Buffers: shared hit=10
                          SubPlan 5
                            ->  Index Only Scan using search_entity_key_value_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=0.02 loops=45840)
                                  Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                                  Heap Fetches: 19
                                  Index Searches: 45840
                                  Buffers: shared hit=229873
        ->  Index Only Scan using search_entity_key_value_idx on search  (cost=0.69..3.73 rows=1 width=37) (actual time=0.009..0.009 rows=1.00 loops=45317)
              Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 1361
              Index Searches: 45317
              Buffers: shared hit=268161
Planning:
  Buffers: shared hit=64
Planning Time: 3.563 ms
Execution Time: 1909.696 ms
```

## 17 permission rare facet

```text
GroupAggregate  (cost=1.12..745366.53 rows=962 width=70) (actual time=3.444..32.915 rows=3.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=13676
  ->  Nested Loop  (cost=1.12..745352.10 rows=962 width=62) (actual time=1.721..32.858 rows=136.00 loops=1)
        Buffers: shared hit=13676
        ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..217.71 rows=1679 width=99) (actual time=0.046..0.485 rows=878.00 loops=1)
              Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
              Heap Fetches: 27
              Index Searches: 1
              Buffers: shared hit=827
        ->  Memoize  (cost=0.43..444.31 rows=1 width=37) (actual time=0.037..0.037 rows=0.15 loops=878)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 878  Evictions: 0  Overflows: 0  Memory Usage: 96kB
              Buffers: shared hit=12849
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..444.30 rows=1 width=37) (actual time=0.036..0.036 rows=0.15 loops=878)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND ((ANY ((entity_id)::text = (hashed SubPlan 8).col1)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 10).col1)))) AND ((NOT EXISTS(SubPlan 11)) OR (NOT EXISTS(SubPlan 13)) OR (NOT (ANY ((entity_id)::text = (hashed SubPlan 16).col1)))) AND ((ANY ((entity_id)::text = (hashed SubPlan 2).col1)) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1)) OR (NOT EXISTS(SubPlan 5))))
                    Rows Removed by Filter: 1
                    Index Searches: 878
                    Buffers: shared hit=12849
                    SubPlan 8
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..8.71 rows=1 width=32) (actual time=0.024..0.024 rows=0.00 loops=1)
                            Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=5
                    SubPlan 10
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.13 rows=22 width=32) (actual time=0.022..0.031 rows=18.00 loops=1)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 1
                            Buffers: shared hit=22
                    SubPlan 11
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=0) (actual time=0.013..0.013 rows=0.00 loops=878)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.a'::text))
                            Heap Fetches: 0
                            Index Searches: 878
                            Buffers: shared hit=4390
                    SubPlan 13
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_6  (cost=0.69..8.71 rows=1 width=0) (never executed)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'spec.b'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 16
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..9.13 rows=22 width=32) (never executed)
                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                            Heap Fetches: 0
                            Index Searches: 0
                    SubPlan 2
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.504..1.450 rows=434.00 loops=1)
                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 14
                            Index Searches: 34
                            Buffers: shared hit=535
                    SubPlan 4
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..191.93 rows=3 width=32) (actual time=0.380..0.380 rows=0.00 loops=1)
                            Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 0
                            Index Searches: 2
                            Buffers: shared hit=10
                    SubPlan 5
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_2  (cost=0.69..8.71 rows=1 width=0) (actual time=0.012..0.012 rows=1.00 loops=742)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                            Heap Fetches: 19
                            Index Searches: 742
                            Buffers: shared hit=4375
Planning:
  Buffers: shared hit=20
Planning Time: 3.311 ms
Execution Time: 33.051 ms
```

## 18 negated disjunction facets

```text
GroupAggregate  (cost=1.12..126994791.53 rows=20668 width=70) (actual time=534.772..15128.363 rows=12.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=7034031
  ->  Nested Loop  (cost=1.12..126993534.40 rows=210090 width=62) (actual time=2.982..14996.600 rows=706883.00 loops=1)
        Buffers: shared hit=7034031
        ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..107015.48 rows=842608 width=99) (actual time=0.029..324.214 rows=708058.00 loops=1)
              Index Cond: (key = 'kind'::text)
              Heap Fetches: 34638
              Index Searches: 1
              Buffers: shared hit=660176
        ->  Memoize  (cost=0.43..204.00 rows=1 width=37) (actual time=0.020..0.020 rows=1.00 loops=708058)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 708058  Evictions: 313225  Overflows: 0  Memory Usage: 65537kB
              Buffers: shared hit=6373855
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..203.99 rows=1 width=37) (actual time=0.019..0.019 rows=1.00 loops=708058)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND (NOT EXISTS(SubPlan 3)) AND (NOT (ANY ((entity_id)::text = (hashed SubPlan 2).col1))))
                    Rows Removed by Filter: 0
                    Index Searches: 708058
                    Buffers: shared hit=6373855
                    SubPlan 3
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt_1  (cost=0.69..8.71 rows=1 width=0) (actual time=0.011..0.011 rows=0.00 loops=708058)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                            Heap Fetches: 27
                            Index Searches: 708058
                            Buffers: shared hit=3541087
                    SubPlan 2
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.476..1.340 rows=434.00 loops=1)
                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 14
                            Index Searches: 34
                            Buffers: shared hit=535
Planning:
  Buffers: shared hit=20
Planning Time: 1.426 ms
Execution Time: 15140.635 ms
```

## 18 negated disjunction count

```text
Aggregate  (cost=115180198.12..115180198.13 rows=1 width=8) (actual time=18053.152..18053.155 rows=1.00 loops=1)
  Buffers: shared hit=6745777, temp read=2366 written=4240
  I/O Timings: temp read=9.022 write=30.227
  ->  Nested Loop  (cost=97912.64..115179759.25 rows=175548 width=0) (actual time=603.576..17987.670 rows=706883.00 loops=1)
        Buffers: shared hit=6745777, temp read=2366 written=4240
        I/O Timings: temp read=9.022 write=30.227
        ->  HashAggregate  (cost=97912.21..103550.16 rows=563795 width=37) (actual time=602.124..1105.459 rows=708058.00 loops=1)
              Group Key: (search.entity_id)::text
              Batches: 5  Memory Usage: 65593kB  Disk Usage: 19872kB
              Buffers: shared hit=371927, temp read=2366 written=4240
              I/O Timings: temp read=9.022 write=30.227
              ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..95730.88 rows=872531 width=37) (actual time=0.033..225.668 rows=708058.00 loops=1)
                    Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
                    Heap Fetches: 35386
                    Index Searches: 1
                    Buffers: shared hit=371927
        ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..204.10 rows=1 width=37) (actual time=0.023..0.023 rows=1.00 loops=708058)
              Index Cond: ((entity_id)::text = (search.entity_id)::text)
              Filter: ((final_entity IS NOT NULL) AND (NOT EXISTS(SubPlan 3)) AND (NOT (ANY ((entity_id)::text = (hashed SubPlan 2).col1))))
              Rows Removed by Filter: 0
              Index Searches: 708058
              Buffers: shared hit=6373850
              SubPlan 3
                ->  Index Only Scan using search_entity_key_value_idx on search search_flt_1  (cost=0.69..8.71 rows=1 width=0) (actual time=0.014..0.014 rows=0.00 loops=708058)
                      Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'metadata.annotations.spotify.net/repository-visibility'::text))
                      Heap Fetches: 27
                      Index Searches: 708058
                      Buffers: shared hit=3541082
              SubPlan 2
                ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.444..1.279 rows=434.00 loops=1)
                      Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                      Heap Fetches: 14
                      Index Searches: 34
                      Buffers: shared hit=535
Planning:
  Buffers: shared hit=20
Planning Time: 1.489 ms
Execution Time: 18061.950 ms
```

## 19 large in under or page

```text
Limit  (cost=1.12..5911.61 rows=21 width=1103) (actual time=0.310..2.613 rows=21.00 loops=1)
  Buffers: shared hit=891
  ->  Nested Loop  (cost=1.12..183690431.03 rows=652653 width=1103) (actual time=0.309..2.609 rows=21.00 loops=1)
        Buffers: shared hit=891
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..95730.88 rows=872531 width=73) (actual time=0.033..0.054 rows=34.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 0
              Index Searches: 1
              Buffers: shared hit=34
        ->  Memoize  (cost=0.43..218.10 rows=1 width=1067) (actual time=0.075..0.075 rows=0.62 loops=34)
              Cache Key: search.entity_id
              Cache Mode: logical
              Hits: 0  Misses: 34  Evictions: 0  Overflows: 0  Memory Usage: 25kB
              Buffers: shared hit=857
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..218.09 rows=1 width=1067) (actual time=0.067..0.067 rows=0.62 loops=34)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: ((final_entity IS NOT NULL) AND (EXISTS(SubPlan 1) OR (ANY ((entity_id)::text = (hashed SubPlan 4).col1))))
                    Rows Removed by Filter: 0
                    Index Searches: 34
                    Buffers: shared hit=857
                    SubPlan 1
                      ->  Index Only Scan using search_entity_key_value_idx on search search_flt  (cost=0.69..22.81 rows=1 width=0) (actual time=0.014..0.014 rows=0.62 loops=34)
                            Index Cond: ((entity_id = (final_entities.entity_id)::text) AND (key = 'kind'::text) AND (value = ANY ('{component,api,resource,subcomponent}'::text[])))
                            Heap Fetches: 0
                            Index Searches: 34
                            Buffers: shared hit=186
                    SubPlan 4
                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..220.84 rows=1072 width=32) (actual time=0.437..1.299 rows=434.00 loops=1)
                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                            Heap Fetches: 14
                            Index Searches: 34
                            Buffers: shared hit=535
Planning:
  Buffers: shared hit=20
Planning Time: 1.686 ms
Execution Time: 2.683 ms
```

## Set operations for facets and counts (2026-10-30)

These plans show the facets and count queries of scenarios 15-19 after they
switched to set operations on entity IDs. They were captured on the same
PostgreSQL 18.6 staging replica as the section above, with the same
40-claim sign-in, at `work_mem = 32MB` and at `work_mem = 4MB`. Claim lists
are redacted as `':claims'`. The page queries run the same SQL as before,
so their plans above still apply. Scenario 19 has no earlier count plan,
since the battery recorded only its page query. The JSON samples are
separate warm executions of the same SQL.

## 15 permission kind facets (set operations)

```text
Sort  (cost=302764.02..302815.69 rows=20668 width=70) (actual time=1653.369..1653.387 rows=11.00 loops=1)
  Sort Key: search.original_value
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=819780
  ->  HashAggregate  (cost=301075.95..301282.63 rows=20668 width=70) (actual time=1653.229..1653.352 rows=11.00 loops=1)
        Group Key: search.original_value
        Batches: 1  Memory Usage: 545kB
        Buffers: shared hit=819780
        ->  Hash Anti Join  (cost=143212.33..295969.11 rows=1021368 width=62) (actual time=564.822..1516.386 rows=707663.00 loops=1)
              Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
              Buffers: shared hit=819780
              ->  Hash Join  (cost=141984.93..281304.51 rows=1023377 width=99) (actual time=561.285..1380.874 rows=708423.00 loops=1)
                    Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
                    Buffers: shared hit=818317
                    ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..136624.81 rows=1026834 width=99) (actual time=0.037..309.717 rows=708423.00 loops=1)
                          Index Cond: (key = 'kind'::text)
                          Heap Fetches: 63318
                          Index Searches: 1
                          Buffers: shared hit=692241
                    ->  Hash  (cost=133159.58..133159.58 rows=705973 width=37) (actual time=554.925..554.927 rows=708426.00 loops=1)
                          Buckets: 1048576  Batches: 1  Memory Usage: 55928kB
                          Buffers: shared hit=126076
                          ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.031..313.242 rows=708426.00 loops=1)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 2565
                                Buffers: shared hit=126076
              ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.501..3.512 rows=760.00 loops=1)
                    Buckets: 4096  Batches: 1  Memory Usage: 84kB
                    Buffers: shared hit=1463
                    ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.205..3.321 rows=760.00 loops=1)
                          Group Key: ((search_flt.entity_id)::character varying(255))
                          Batches: 1  Memory Usage: 153kB
                          Buffers: shared hit=1463
                          ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.765..3.026 rows=760.00 loops=1)
                                Buffers: shared hit=1463
                                ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.764..2.837 rows=742.00 loops=1)
                                      Buffers: shared hit=1409
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.066..0.445 rows=878.00 loops=1)
                                            Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                            Heap Fetches: 50
                                            Index Searches: 1
                                            Buffers: shared hit=850
                                      ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.918..1.971 rows=433.00 loops=1)
                                            Group Key: ((search_flt_1.entity_id)::character varying(255))
                                            Batches: 1  Memory Usage: 89kB
                                            Buffers: shared hit=559
                                            ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.453..1.782 rows=434.00 loops=1)
                                                  Buffers: shared hit=559
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.452..1.339 rows=434.00 loops=1)
                                                        Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                        Heap Fetches: 28
                                                        Index Searches: 34
                                                        Buffers: shared hit=549
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.388..0.388 rows=0.00 loops=1)
                                                        Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                        Heap Fetches: 0
                                                        Index Searches: 2
                                                        Buffers: shared hit=10
                                ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.058..0.060 rows=18.00 loops=1)
                                      Buffers: shared hit=27
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.028..0.034 rows=18.00 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                            Heap Fetches: 0
                                            Index Searches: 1
                                            Buffers: shared hit=22
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.018..0.018 rows=0.00 loops=1)
                                            Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                            Heap Fetches: 0
                                            Index Searches: 1
                                            Buffers: shared hit=5
                                ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.056..0.058 rows=0.00 loops=1)
                                      Buffers: shared hit=27
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.015..0.020 rows=18.00 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                            Heap Fetches: 0
                                            Index Searches: 1
                                            Buffers: shared hit=22
                                      ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.030..0.031 rows=0.00 loops=1)
                                            Buffers: shared hit=5
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                  Index Cond: (key = 'spec.a'::text)
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                  Index Cond: (key = 'spec.b'::text)
                                                  Heap Fetches: 0
                                                  Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.066 ms
Execution Time: 1654.561 ms
```

## 15 permission list count (set operations)

```text
Aggregate  (cost=273031.24..273031.25 rows=1 width=8) (actual time=1472.368..1472.385 rows=1.00 loops=1)
  Buffers: shared hit=528390
  ->  Hash Right Semi Join  (cost=152646.58..271311.29 rows=687982 width=0) (actual time=647.491..1425.832 rows=707663.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=528390
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.024..261.566 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=143847.85..143847.85 rows=703844 width=37) (actual time=641.189..641.204 rows=707666.00 loops=1)
              Buckets: 1048576  Batches: 1  Memory Usage: 55877kB
              Buffers: shared hit=127539
              ->  Hash Anti Join  (cost=1227.41..143847.85 rows=703844 width=37) (actual time=3.417..419.036 rows=707666.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=127539
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.032..294.141 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.373..3.386 rows=760.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 84kB
                          Buffers: shared hit=1463
                          ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.145..3.252 rows=760.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 153kB
                                Buffers: shared hit=1463
                                ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.677..2.949 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.676..2.754 rows=742.00 loops=1)
                                            Buffers: shared hit=1409
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.061..0.432 rows=878.00 loops=1)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 50
                                                  Index Searches: 1
                                                  Buffers: shared hit=850
                                            ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.883..1.934 rows=433.00 loops=1)
                                                  Group Key: ((search_flt_1.entity_id)::character varying(255))
                                                  Batches: 1  Memory Usage: 89kB
                                                  Buffers: shared hit=559
                                                  ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.491..1.748 rows=434.00 loops=1)
                                                        Buffers: shared hit=559
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.490..1.355 rows=434.00 loops=1)
                                                              Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 28
                                                              Index Searches: 34
                                                              Buffers: shared hit=549
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.345..0.345 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 0
                                                              Index Searches: 2
                                                              Buffers: shared hit=10
                                      ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.056..0.059 rows=18.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.028..0.033 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.017..0.017 rows=0.00 loops=1)
                                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                      ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.055..0.057 rows=0.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.014..0.018 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.030..0.032 rows=0.00 loops=1)
                                                  Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                        Index Cond: (key = 'spec.a'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                        Index Cond: (key = 'spec.b'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 1.927 ms
Execution Time: 1473.258 ms
```

## 16 permission component facets (set operations)

```text
Sort  (cost=279171.09..279222.76 rows=20668 width=70) (actual time=1027.218..1027.240 rows=37.00 loops=1)
  Sort Key: search.original_value
  Sort Method: quicksort  Memory: 26kB
  Buffers: shared hit=819491
  ->  HashAggregate  (cost=277483.02..277689.70 rows=20668 width=70) (actual time=1027.034..1027.163 rows=37.00 loops=1)
        Group Key: search.original_value
        Batches: 1  Memory Usage: 545kB
        Buffers: shared hit=819491
        ->  Hash Join  (cost=144265.27..277080.77 rows=80450 width=62) (actual time=575.198..1018.804 rows=45316.00 loops=1)
              Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
              Buffers: shared hit=819491
              ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..128668.56 rows=966334 width=99) (actual time=0.037..252.183 rows=665420.00 loops=1)
                    Index Cond: (key = 'spec.type'::text)
                    Heap Fetches: 61405
                    Index Searches: 1
                    Buffers: shared hit=647878
              ->  Hash  (cost=143527.43..143527.43 rows=58973 width=553) (actual time=573.792..573.809 rows=45316.00 loops=1)
                    Buckets: 65536  Batches: 1  Memory Usage: 5203kB
                    Buffers: shared hit=171613
                    ->  Hash Join  (cost=8514.65..143527.43 rows=58973 width=553) (actual time=55.825..558.048 rows=45316.00 loops=1)
                          Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                          Buffers: shared hit=171613
                          ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.023..293.699 rows=708426.00 loops=1)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 2565
                                Buffers: shared hit=126076
                          ->  Hash  (cost=7775.00..7775.00 rows=59172 width=516) (actual time=55.685..55.699 rows=45316.00 loops=1)
                                Buckets: 65536  Batches: 1  Memory Usage: 3566kB
                                Buffers: shared hit=45537
                                ->  HashSetOp Except  (cost=7627.07..7775.00 rows=59172 width=516) (actual time=37.514..45.513 rows=45316.00 loops=1)
                                      Buffers: shared hit=45537
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..6269.11 rows=60769 width=516) (actual time=0.028..16.915 rows=46058.00 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                            Heap Fetches: 2568
                                            Index Searches: 1
                                            Buffers: shared hit=44074
                                      ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.505..3.608 rows=760.00 loops=1)
                                            Group Key: ((search_flt_1.entity_id)::character varying(255))
                                            Batches: 1  Memory Usage: 153kB
                                            Buffers: shared hit=1463
                                            ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=3.003..3.305 rows=760.00 loops=1)
                                                  Buffers: shared hit=1463
                                                  ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=3.001..3.092 rows=742.00 loops=1)
                                                        Buffers: shared hit=1409
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.060..0.420 rows=878.00 loops=1)
                                                              Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                              Heap Fetches: 50
                                                              Index Searches: 1
                                                              Buffers: shared hit=850
                                                        ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=2.200..2.256 rows=433.00 loops=1)
                                                              Group Key: ((search_flt_2.entity_id)::character varying(255))
                                                              Batches: 1  Memory Usage: 89kB
                                                              Buffers: shared hit=559
                                                              ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.458..2.065 rows=434.00 loops=1)
                                                                    Buffers: shared hit=559
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.457..1.430 rows=434.00 loops=1)
                                                                          Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                                          Heap Fetches: 28
                                                                          Index Searches: 34
                                                                          Buffers: shared hit=549
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..191.94 rows=4 width=516) (actual time=0.576..0.576 rows=0.00 loops=1)
                                                                          Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                                          Heap Fetches: 0
                                                                          Index Searches: 2
                                                                          Buffers: shared hit=10
                                                  ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.062..0.065 rows=18.00 loops=1)
                                                        Buffers: shared hit=27
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.23 rows=27 width=516) (actual time=0.028..0.035 rows=18.00 loops=1)
                                                              Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=22
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=516) (actual time=0.020..0.020 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=5
                                                  ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.055..0.057 rows=0.00 loops=1)
                                                        Buffers: shared hit=27
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..9.23 rows=27 width=516) (actual time=0.012..0.017 rows=18.00 loops=1)
                                                              Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=22
                                                        ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.031..0.032 rows=0.00 loops=1)
                                                              Buffers: shared hit=5
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                                    Index Cond: (key = 'spec.a'::text)
                                                                    Heap Fetches: 0
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=5
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                                    Index Cond: (key = 'spec.b'::text)
                                                                    Heap Fetches: 0
                                                                    Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.081 ms
Execution Time: 1029.369 ms
```

## 16 permission component count (set operations)

```text
Aggregate  (cost=256720.44..256720.45 rows=1 width=8) (actual time=1005.610..1005.627 rows=1.00 loops=1)
  Buffers: shared hit=572464
  ->  Hash Right Semi Join  (cost=144265.28..256626.60 rows=37536 width=0) (actual time=555.932..1002.405 rows=45316.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=572464
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.042..238.776 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=143527.43..143527.43 rows=58973 width=553) (actual time=555.812..555.828 rows=45316.00 loops=1)
              Buckets: 65536  Batches: 1  Memory Usage: 5203kB
              Buffers: shared hit=171613
              ->  Hash Join  (cost=8514.65..143527.43 rows=58973 width=553) (actual time=59.293..540.406 rows=45316.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=171613
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.025..284.226 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=7775.00..7775.00 rows=59172 width=516) (actual time=59.190..59.203 rows=45316.00 loops=1)
                          Buckets: 65536  Batches: 1  Memory Usage: 3566kB
                          Buffers: shared hit=45537
                          ->  HashSetOp Except  (cost=7627.07..7775.00 rows=59172 width=516) (actual time=39.607..48.603 rows=45316.00 loops=1)
                                Buffers: shared hit=45537
                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..6269.11 rows=60769 width=516) (actual time=0.036..18.108 rows=46058.00 loops=1)
                                      Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                      Heap Fetches: 2568
                                      Index Searches: 1
                                      Buffers: shared hit=44074
                                ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.310..3.414 rows=760.00 loops=1)
                                      Group Key: ((search_flt_1.entity_id)::character varying(255))
                                      Batches: 1  Memory Usage: 153kB
                                      Buffers: shared hit=1463
                                      ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.845..3.115 rows=760.00 loops=1)
                                            Buffers: shared hit=1463
                                            ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.843..2.934 rows=742.00 loops=1)
                                                  Buffers: shared hit=1409
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.060..0.449 rows=878.00 loops=1)
                                                        Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                        Heap Fetches: 50
                                                        Index Searches: 1
                                                        Buffers: shared hit=850
                                                  ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.918..1.968 rows=433.00 loops=1)
                                                        Group Key: ((search_flt_2.entity_id)::character varying(255))
                                                        Batches: 1  Memory Usage: 89kB
                                                        Buffers: shared hit=559
                                                        ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.484..1.784 rows=434.00 loops=1)
                                                              Buffers: shared hit=559
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.483..1.387 rows=434.00 loops=1)
                                                                    Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                                    Heap Fetches: 28
                                                                    Index Searches: 34
                                                                    Buffers: shared hit=549
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..191.94 rows=4 width=516) (actual time=0.354..0.354 rows=0.00 loops=1)
                                                                    Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                                    Heap Fetches: 0
                                                                    Index Searches: 2
                                                                    Buffers: shared hit=10
                                            ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.059..0.061 rows=18.00 loops=1)
                                                  Buffers: shared hit=27
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.23 rows=27 width=516) (actual time=0.029..0.035 rows=18.00 loops=1)
                                                        Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=22
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=516) (actual time=0.018..0.018 rows=0.00 loops=1)
                                                        Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                            ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.056..0.059 rows=0.00 loops=1)
                                                  Buffers: shared hit=27
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..9.23 rows=27 width=516) (actual time=0.014..0.019 rows=18.00 loops=1)
                                                        Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=22
                                                  ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.031..0.032 rows=0.00 loops=1)
                                                        Buffers: shared hit=5
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                              Index Cond: (key = 'spec.a'::text)
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=5
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                              Index Cond: (key = 'spec.b'::text)
                                                              Heap Fetches: 0
                                                              Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.358 ms
Execution Time: 1007.625 ms
```

## 17 permission rare facet (set operations)

```text
GroupAggregate  (cost=17879.37..17914.12 rows=1948 width=70) (actual time=5.812..5.847 rows=3.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=2857
  ->  Sort  (cost=17879.37..17884.46 rows=2035 width=62) (actual time=5.802..5.822 rows=136.00 loops=1)
        Sort Key: search.original_value
        Sort Method: quicksort  Memory: 35kB
        Buffers: shared hit=2857
        ->  Nested Loop  (cost=1228.52..17767.54 rows=2035 width=62) (actual time=3.885..5.766 rows=136.00 loops=1)
              Buffers: shared hit=2857
              ->  Hash Anti Join  (cost=1228.09..1537.98 rows=2042 width=99) (actual time=3.860..4.405 rows=136.00 loops=1)
                    Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=2313
                    ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..283.71 rows=2046 width=99) (actual time=0.049..0.416 rows=878.00 loops=1)
                          Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                          Heap Fetches: 50
                          Index Searches: 1
                          Buffers: shared hit=850
                    ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.802..3.811 rows=760.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 84kB
                          Buffers: shared hit=1463
                          ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.544..3.652 rows=760.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 153kB
                                Buffers: shared hit=1463
                                ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.992..3.297 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.991..3.095 rows=742.00 loops=1)
                                            Buffers: shared hit=1409
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.043..0.451 rows=878.00 loops=1)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 50
                                                  Index Searches: 1
                                                  Buffers: shared hit=850
                                            ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=2.173..2.233 rows=433.00 loops=1)
                                                  Group Key: ((search_flt_1.entity_id)::character varying(255))
                                                  Batches: 1  Memory Usage: 89kB
                                                  Buffers: shared hit=559
                                                  ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.514..2.017 rows=434.00 loops=1)
                                                        Buffers: shared hit=559
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.513..1.486 rows=434.00 loops=1)
                                                              Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 28
                                                              Index Searches: 34
                                                              Buffers: shared hit=549
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.482..0.483 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 0
                                                              Index Searches: 2
                                                              Buffers: shared hit=10
                                      ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.067..0.069 rows=18.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.033..0.040 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.019..0.019 rows=0.00 loops=1)
                                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                      ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.054..0.056 rows=0.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.012..0.017 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.031..0.032 rows=0.00 loops=1)
                                                  Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.014..0.014 rows=0.00 loops=1)
                                                        Index Cond: (key = 'spec.a'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                        Index Cond: (key = 'spec.b'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 0
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..7.95 rows=1 width=37) (actual time=0.010..0.010 rows=1.00 loops=136)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: (final_entity IS NOT NULL)
                    Index Searches: 136
                    Buffers: shared hit=544
Planning:
  Buffers: shared hit=20
Planning Time: 2.220 ms
Execution Time: 6.028 ms
```

## 18 negated disjunction facets (set operations)

```text
Finalize GroupAggregate  (cost=275764.52..281996.30 rows=20668 width=70) (actual time=637.113..657.738 rows=12.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=822576
  ->  Gather Merge  (cost=275764.52..281541.60 rows=49603 width=70) (actual time=637.097..657.719 rows=32.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=822576
        ->  Sort  (cost=274764.49..274816.16 rows=20668 width=70) (actual time=628.630..628.640 rows=10.67 loops=3)
              Sort Key: search.original_value
              Sort Method: quicksort  Memory: 25kB
              Buffers: shared hit=822576
              Worker 0:  Sort Method: quicksort  Memory: 25kB
              Worker 1:  Sort Method: quicksort  Memory: 25kB
              ->  Partial HashAggregate  (cost=273076.42..273283.10 rows=20668 width=70) (actual time=628.435..628.549 rows=10.67 loops=3)
                    Group Key: search.original_value
                    Batches: 1  Memory Usage: 545kB
                    Buffers: shared hit=822560
                    Worker 0:  Batches: 1  Memory Usage: 545kB
                    Worker 1:  Batches: 1  Memory Usage: 545kB
                    ->  Hash Anti Join  (cost=133260.57..270951.03 rows=425078 width=62) (actual time=223.676..580.708 rows=235749.33 loops=3)
                          Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                          Buffers: shared hit=822560
                          ->  Parallel Hash Join  (cost=132705.11..264462.48 rows=426407 width=99) (actual time=220.133..528.620 rows=236141.00 loops=3)
                                Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
                                Buffers: shared hit=818355
                                ->  Parallel Index Only Scan using search_facets_covering_idx on search  (cost=0.69..130634.95 rows=427848 width=99) (actual time=0.227..132.327 rows=236141.00 loops=3)
                                      Index Cond: (key = 'kind'::text)
                                      Heap Fetches: 63318
                                      Index Searches: 1
                                      Buffers: shared hit=692279
                                ->  Parallel Hash  (cost=129027.49..129027.49 rows=294155 width=37) (actual time=216.844..216.845 rows=236142.00 loops=3)
                                      Buckets: 1048576  Batches: 1  Memory Usage: 58176kB
                                      Buffers: shared hit=126076
                                      ->  Parallel Seq Scan on final_entities  (cost=0.00..129027.49 rows=294155 width=37) (actual time=0.015..105.558 rows=236142.00 loops=3)
                                            Filter: (final_entity IS NOT NULL)
                                            Rows Removed by Filter: 855
                                            Buffers: shared hit=126076
                          ->  Hash  (cost=513.07..513.07 rows=3391 width=516) (actual time=3.481..3.484 rows=1175.00 loops=3)
                                Buckets: 4096  Batches: 1  Memory Usage: 112kB
                                Buffers: shared hit=4205
                                ->  HashAggregate  (cost=479.16..513.07 rows=3391 width=516) (actual time=3.042..3.193 rows=1175.00 loops=3)
                                      Group Key: ((search_flt.entity_id)::character varying(255))
                                      Batches: 1  Memory Usage: 217kB
                                      Buffers: shared hit=4205
                                      Worker 0:  Batches: 1  Memory Usage: 217kB
                                      Worker 1:  Batches: 1  Memory Usage: 217kB
                                      ->  Append  (cost=0.69..470.68 rows=3391 width=516) (actual time=0.568..2.420 rows=1312.00 loops=3)
                                            Buffers: shared hit=4205
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.567..1.617 rows=434.00 loops=3)
                                                  Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                  Heap Fetches: 84
                                                  Index Searches: 102
                                                  Buffers: shared hit=1655
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.073..0.664 rows=878.00 loops=3)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 150
                                                  Index Searches: 3
                                                  Buffers: shared hit=2550
Planning:
  Buffers: shared hit=20
Planning Time: 1.168 ms
Execution Time: 657.981 ms
```

## 18 negated disjunction count (set operations)

```text
Aggregate  (cost=271658.86..271658.87 rows=1 width=8) (actual time=1729.780..1729.789 rows=1.00 loops=1)
  Buffers: shared hit=528326
  ->  Hash Right Semi Join  (cost=151289.49..269941.96 rows=686760 width=0) (actual time=907.342..1683.200 rows=707248.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=528326
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.023..259.552 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=142506.39..142506.39 rows=702593 width=37) (actual time=900.836..900.843 rows=707251.00 loops=1)
              Buckets: 1048576  Batches: 1  Memory Usage: 55849kB
              Buffers: shared hit=127475
              ->  Hash Right Anti Join  (cost=142463.40..142506.39 rows=702593 width=37) (actual time=539.542..743.335 rows=707251.00 loops=1)
                    Hash Cond: ((((search_flt.entity_id)::character varying(255)))::text = (final_entities.entity_id)::text)
                    Buffers: shared hit=127475
                    ->  HashAggregate  (cost=479.16..513.07 rows=3391 width=516) (actual time=2.255..2.399 rows=1175.00 loops=1)
                          Group Key: ((search_flt.entity_id)::character varying(255))
                          Batches: 1  Memory Usage: 217kB
                          Buffers: shared hit=1399
                          ->  Append  (cost=0.69..470.68 rows=3391 width=516) (actual time=0.473..1.874 rows=1312.00 loops=1)
                                Buffers: shared hit=1399
                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.472..1.356 rows=434.00 loops=1)
                                      Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                      Heap Fetches: 28
                                      Index Searches: 34
                                      Buffers: shared hit=549
                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.047..0.394 rows=878.00 loops=1)
                                      Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                      Heap Fetches: 50
                                      Index Searches: 1
                                      Buffers: shared hit=850
                    ->  Hash  (cost=133159.58..133159.58 rows=705973 width=37) (actual time=529.858..529.860 rows=708426.00 loops=1)
                          Buckets: 1048576  Batches: 1  Memory Usage: 55928kB
                          Buffers: shared hit=126076
                          ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.036..303.254 rows=708426.00 loops=1)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 2565
                                Buffers: shared hit=126076
Planning:
  Buffers: shared hit=20
Planning Time: 1.443 ms
Execution Time: 1732.224 ms
```

## 19 large in under or count (set operations)

```text
Aggregate  (cost=795513.69..795513.70 rows=1 width=8) (actual time=2661.289..2661.297 rows=1.00 loops=1)
  Buffers: shared hit=1109465, temp read=10092 written=10092
  I/O Timings: temp read=36.620 write=101.710
  ->  Hash Right Semi Join  (cost=596226.31..794149.02 rows=545869 width=0) (actual time=1743.928..2620.559 rows=574230.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=1109465, temp read=10092 written=10092
        I/O Timings: temp read=36.620 write=101.710
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.024..250.841 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=524366.48..524366.48 rows=857611 width=553) (actual time=1743.506..1743.512 rows=574230.00 loops=1)
              Buckets: 131072  Batches: 8  Memory Usage: 8432kB
              Buffers: shared hit=708614, temp written=5765
              I/O Timings: temp write=57.834
              ->  Hash Join  (cost=517805.10..524366.48 rows=857611 width=553) (actual time=974.355..1558.542 rows=574230.00 loops=1)
                    Hash Cond: ((((search_flt.entity_id)::character varying(255)))::text = (final_entities.entity_id)::text)
                    Buffers: shared hit=708614
                    ->  Unique  (cost=375820.86..380123.40 rows=860508 width=516) (actual time=466.269..656.224 rows=574230.00 loops=1)
                          Buffers: shared hit=582538
                          ->  Sort  (cost=375820.86..377972.13 rows=860508 width=516) (actual time=466.263..518.624 rows=574630.00 loops=1)
                                Sort Key: ((search_flt.entity_id)::character varying(255)) COLLATE "C"
                                Sort Method: quicksort  Memory: 24577kB
                                Buffers: shared hit=582538
                                ->  Append  (cost=0.69..90993.02 rows=860508 width=516) (actual time=0.060..292.632 rows=574630.00 loops=1)
                                      Buffers: shared hit=582538
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..86453.13 rows=859201 width=516) (actual time=0.059..243.281 rows=574196.00 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = ANY ('{component,api,resource,subcomponent}'::text[])))
                                            Heap Fetches: 55899
                                            Index Searches: 2
                                            Buffers: shared hit=581989
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.478..1.328 rows=434.00 loops=1)
                                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                            Heap Fetches: 28
                                            Index Searches: 34
                                            Buffers: shared hit=549
                    ->  Hash  (cost=133159.58..133159.58 rows=705973 width=37) (actual time=501.782..501.783 rows=708426.00 loops=1)
                          Buckets: 1048576  Batches: 1  Memory Usage: 55928kB
                          Buffers: shared hit=126076
                          ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.035..288.100 rows=708426.00 loops=1)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 2565
                                Buffers: shared hit=126076
Planning:
  Buffers: shared hit=20
Planning Time: 1.437 ms
Execution Time: 2662.248 ms
```

## 15 permission kind facets (set operations, 4MB)

```text
Sort  (cost=345862.18..345913.85 rows=20668 width=70) (actual time=1757.860..1757.877 rows=11.00 loops=1)
  Sort Key: search.original_value
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=819780, temp read=9664 written=9664
  I/O Timings: temp read=37.286 write=105.479
  ->  HashAggregate  (cost=344174.11..344380.79 rows=20668 width=70) (actual time=1757.745..1757.853 rows=11.00 loops=1)
        Group Key: search.original_value
        Batches: 1  Memory Usage: 545kB
        Buffers: shared hit=819780, temp read=9664 written=9664
        I/O Timings: temp read=37.286 write=105.479
        ->  Hash Join  (cost=148728.33..339067.27 rows=1021368 width=62) (actual time=491.124..1623.653 rows=707663.00 loops=1)
              Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
              Buffers: shared hit=819780, temp read=9664 written=9664
              I/O Timings: temp read=37.286 write=105.479
              ->  Hash Anti Join  (cost=1228.09..151334.87 rows=1024818 width=99) (actual time=3.378..431.337 rows=707663.00 loops=1)
                    Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=693704
                    ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..136624.81 rows=1026834 width=99) (actual time=0.032..293.190 rows=708423.00 loops=1)
                          Index Cond: (key = 'kind'::text)
                          Heap Fetches: 63318
                          Index Searches: 1
                          Buffers: shared hit=692241
                    ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.335..3.346 rows=760.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 84kB
                          Buffers: shared hit=1463
                          ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.098..3.208 rows=760.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 153kB
                                Buffers: shared hit=1463
                                ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.668..2.931 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.667..2.745 rows=742.00 loops=1)
                                            Buffers: shared hit=1409
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.046..0.429 rows=878.00 loops=1)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 50
                                                  Index Searches: 1
                                                  Buffers: shared hit=850
                                            ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.886..1.939 rows=433.00 loops=1)
                                                  Group Key: ((search_flt_1.entity_id)::character varying(255))
                                                  Batches: 1  Memory Usage: 89kB
                                                  Buffers: shared hit=559
                                                  ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.467..1.760 rows=434.00 loops=1)
                                                        Buffers: shared hit=559
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.466..1.361 rows=434.00 loops=1)
                                                              Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 28
                                                              Index Searches: 34
                                                              Buffers: shared hit=549
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.356..0.356 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 0
                                                              Index Searches: 2
                                                              Buffers: shared hit=10
                                      ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.058..0.061 rows=18.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.024..0.029 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.023..0.023 rows=0.00 loops=1)
                                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                      ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.052..0.055 rows=0.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.012..0.017 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.029..0.031 rows=0.00 loops=1)
                                                  Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                        Index Cond: (key = 'spec.a'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                        Index Cond: (key = 'spec.b'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 0
              ->  Hash  (cost=133159.58..133159.58 rows=705973 width=37) (actual time=487.494..487.495 rows=708426.00 loops=1)
                    Buckets: 131072  Batches: 8  Memory Usage: 6981kB
                    Buffers: shared hit=126076, temp written=4313
                    I/O Timings: temp write=44.668
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.024..300.545 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
Planning:
  Buffers: shared hit=20
Planning Time: 1.986 ms
Execution Time: 1758.193 ms
```

## 15 permission list count (set operations, 4MB)

```text
Aggregate  (cost=300645.24..300645.25 rows=1 width=8) (actual time=1526.617..1526.633 rows=1.00 loops=1)
  Buffers: shared hit=528390, temp read=8634 written=8634
  I/O Timings: temp read=33.938 write=85.342
  ->  Hash Right Semi Join  (cost=158145.58..298925.29 rows=687982 width=0) (actual time=591.218..1478.925 rows=707663.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=528390, temp read=8634 written=8634
        I/O Timings: temp read=33.938 write=85.342
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.025..245.733 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=143847.85..143847.85 rows=703844 width=37) (actual time=590.763..590.776 rows=707666.00 loops=1)
              Buckets: 131072  Batches: 8  Memory Usage: 6975kB
              Buffers: shared hit=127539, temp written=4307
              I/O Timings: temp write=43.851
              ->  Hash Anti Join  (cost=1227.41..143847.85 rows=703844 width=37) (actual time=3.718..409.668 rows=707666.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=127539
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.019..290.189 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.690..3.700 rows=760.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 84kB
                          Buffers: shared hit=1463
                          ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.426..3.555 rows=760.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 153kB
                                Buffers: shared hit=1463
                                ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.939..3.211 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.938..3.020 rows=742.00 loops=1)
                                            Buffers: shared hit=1409
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.061..0.484 rows=878.00 loops=1)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 50
                                                  Index Searches: 1
                                                  Buffers: shared hit=850
                                            ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=2.045..2.104 rows=433.00 loops=1)
                                                  Group Key: ((search_flt_1.entity_id)::character varying(255))
                                                  Batches: 1  Memory Usage: 89kB
                                                  Buffers: shared hit=559
                                                  ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.515..1.899 rows=434.00 loops=1)
                                                        Buffers: shared hit=559
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.515..1.456 rows=434.00 loops=1)
                                                              Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 28
                                                              Index Searches: 34
                                                              Buffers: shared hit=549
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.397..0.397 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 0
                                                              Index Searches: 2
                                                              Buffers: shared hit=10
                                      ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.055..0.057 rows=18.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.026..0.031 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.019..0.019 rows=0.00 loops=1)
                                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                      ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.057..0.059 rows=0.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.015..0.020 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.031..0.032 rows=0.00 loops=1)
                                                  Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.013..0.013 rows=0.00 loops=1)
                                                        Index Cond: (key = 'spec.a'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                        Index Cond: (key = 'spec.b'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.081 ms
Execution Time: 1526.897 ms
```

## 16 permission component facets (set operations, 4MB)

```text
Sort  (cost=355879.53..355931.20 rows=20668 width=70) (actual time=1267.852..1267.874 rows=37.00 loops=1)
  Sort Key: search.original_value
  Sort Method: quicksort  Memory: 26kB
  Buffers: shared hit=819491, temp read=10470 written=10470
  I/O Timings: temp read=40.508 write=106.981
  ->  HashAggregate  (cost=354191.46..354398.14 rows=20668 width=70) (actual time=1267.659..1267.787 rows=37.00 loops=1)
        Group Key: search.original_value
        Batches: 1  Memory Usage: 545kB
        Buffers: shared hit=819491, temp read=10470 written=10470
        I/O Timings: temp read=40.508 write=106.981
        ->  Hash Join  (cost=186570.72..353789.21 rows=80450 width=62) (actual time=653.164..1258.008 rows=45316.00 loops=1)
              Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
              Buffers: shared hit=819491, temp read=10470 written=10470
              I/O Timings: temp read=40.508 write=106.981
              ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..128668.56 rows=966334 width=99) (actual time=0.028..265.533 rows=665420.00 loops=1)
                    Index Cond: (key = 'spec.type'::text)
                    Heap Fetches: 61405
                    Index Searches: 1
                    Buffers: shared hit=647878
              ->  Hash  (cost=181627.87..181627.87 rows=58973 width=553) (actual time=651.552..651.569 rows=45316.00 loops=1)
                    Buckets: 16384  Batches: 8  Memory Usage: 722kB
                    Buffers: shared hit=171613, temp read=4594 written=5045
                    I/O Timings: temp read=18.082 write=53.667
                    ->  Hash Join  (cost=31653.10..181627.87 rows=58973 width=553) (actual time=47.946..635.405 rows=45316.00 loops=1)
                          Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                          Buffers: shared hit=171613, temp read=4594 written=4594
                          I/O Timings: temp read=18.082 write=49.273
                          ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.019..299.802 rows=708426.00 loops=1)
                                Filter: (final_entity IS NOT NULL)
                                Rows Removed by Filter: 2565
                                Buffers: shared hit=126076
                          ->  Hash  (cost=26983.45..26983.45 rows=59172 width=516) (actual time=47.821..47.834 rows=45316.00 loops=1)
                                Buckets: 16384  Batches: 8  Memory Usage: 511kB
                                Buffers: shared hit=45537, temp written=272
                                I/O Timings: temp write=2.265
                                ->  SetOp Except  (cost=26515.66..26983.45 rows=59172 width=516) (actual time=27.103..40.140 rows=45316.00 loops=1)
                                      Buffers: shared hit=45537
                                      ->  Sort  (cost=25223.52..25375.44 rows=60769 width=516) (actual time=24.011..26.686 rows=46058.00 loops=1)
                                            Sort Key: ((search_flt.entity_id)::character varying(255)) COLLATE "C"
                                            Sort Method: quicksort  Memory: 1537kB
                                            Buffers: shared hit=44074
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..6269.11 rows=60769 width=516) (actual time=0.029..17.189 rows=46058.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                                  Heap Fetches: 2568
                                                  Index Searches: 1
                                                  Buffers: shared hit=44074
                                      ->  Unique  (cost=1292.13..1302.81 rows=2136 width=516) (actual time=3.085..3.394 rows=760.00 loops=1)
                                            Buffers: shared hit=1463
                                            ->  Sort  (cost=1292.13..1297.47 rows=2136 width=516) (actual time=3.084..3.162 rows=760.00 loops=1)
                                                  Sort Key: ((search_flt_1.entity_id)::character varying(255)) COLLATE "C"
                                                  Sort Method: quicksort  Memory: 25kB
                                                  Buffers: shared hit=1463
                                                  ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.577..2.828 rows=760.00 loops=1)
                                                        Buffers: shared hit=1463
                                                        ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.575..2.660 rows=742.00 loops=1)
                                                              Buffers: shared hit=1409
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.055..0.400 rows=878.00 loops=1)
                                                                    Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                                    Heap Fetches: 50
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=850
                                                              ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.844..1.894 rows=433.00 loops=1)
                                                                    Group Key: ((search_flt_2.entity_id)::character varying(255))
                                                                    Batches: 1  Memory Usage: 89kB
                                                                    Buffers: shared hit=559
                                                                    ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.452..1.716 rows=434.00 loops=1)
                                                                          Buffers: shared hit=559
                                                                          ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.451..1.334 rows=434.00 loops=1)
                                                                                Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                                                Heap Fetches: 28
                                                                                Index Searches: 34
                                                                                Buffers: shared hit=549
                                                                          ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..191.94 rows=4 width=516) (actual time=0.342..0.342 rows=0.00 loops=1)
                                                                                Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                                                Heap Fetches: 0
                                                                                Index Searches: 2
                                                                                Buffers: shared hit=10
                                                        ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.053..0.055 rows=18.00 loops=1)
                                                              Buffers: shared hit=27
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.23 rows=27 width=516) (actual time=0.025..0.030 rows=18.00 loops=1)
                                                                    Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                                    Heap Fetches: 0
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=22
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=516) (actual time=0.017..0.017 rows=0.00 loops=1)
                                                                    Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                                    Heap Fetches: 0
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=5
                                                        ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.052..0.055 rows=0.00 loops=1)
                                                              Buffers: shared hit=27
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..9.23 rows=27 width=516) (actual time=0.013..0.017 rows=18.00 loops=1)
                                                                    Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                                    Heap Fetches: 0
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=22
                                                              ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.028..0.030 rows=0.00 loops=1)
                                                                    Buffers: shared hit=5
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.012..0.012 rows=0.00 loops=1)
                                                                          Index Cond: (key = 'spec.a'::text)
                                                                          Heap Fetches: 0
                                                                          Index Searches: 1
                                                                          Buffers: shared hit=5
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                                          Index Cond: (key = 'spec.b'::text)
                                                                          Heap Fetches: 0
                                                                          Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.123 ms
Execution Time: 1268.172 ms
```

## 16 permission component count (set operations, 4MB)

```text
Aggregate  (cost=319846.88..319846.89 rows=1 width=8) (actual time=1195.047..1195.067 rows=1.00 loops=1)
  Buffers: shared hit=572464, temp read=9367 written=9367
  I/O Timings: temp read=36.399 write=92.127
  ->  Hash Right Semi Join  (cost=186570.72..319753.04 rows=37536 width=0) (actual time=640.957..1191.630 rows=45316.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=572464, temp read=9367 written=9367
        I/O Timings: temp read=36.399 write=92.127
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.024..252.210 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=181627.87..181627.87 rows=58973 width=553) (actual time=640.644..640.660 rows=45316.00 loops=1)
              Buckets: 16384  Batches: 8  Memory Usage: 722kB
              Buffers: shared hit=171613, temp read=4594 written=5045
              I/O Timings: temp read=17.275 write=49.924
              ->  Hash Join  (cost=31653.10..181627.87 rows=58973 width=553) (actual time=46.214..625.264 rows=45316.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=171613, temp read=4594 written=4594
                    I/O Timings: temp read=17.275 write=45.664
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.016..295.330 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=26983.45..26983.45 rows=59172 width=516) (actual time=46.090..46.104 rows=45316.00 loops=1)
                          Buckets: 16384  Batches: 8  Memory Usage: 511kB
                          Buffers: shared hit=45537, temp written=272
                          I/O Timings: temp write=2.268
                          ->  SetOp Except  (cost=26515.66..26983.45 rows=59172 width=516) (actual time=25.324..38.340 rows=45316.00 loops=1)
                                Buffers: shared hit=45537
                                ->  Sort  (cost=25223.52..25375.44 rows=60769 width=516) (actual time=22.289..24.861 rows=46058.00 loops=1)
                                      Sort Key: ((search_flt.entity_id)::character varying(255)) COLLATE "C"
                                      Sort Method: quicksort  Memory: 1537kB
                                      Buffers: shared hit=44074
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..6269.11 rows=60769 width=516) (actual time=0.022..15.852 rows=46058.00 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                            Heap Fetches: 2568
                                            Index Searches: 1
                                            Buffers: shared hit=44074
                                ->  Unique  (cost=1292.13..1302.81 rows=2136 width=516) (actual time=3.028..3.329 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  Sort  (cost=1292.13..1297.47 rows=2136 width=516) (actual time=3.027..3.104 rows=760.00 loops=1)
                                            Sort Key: ((search_flt_1.entity_id)::character varying(255)) COLLATE "C"
                                            Sort Method: quicksort  Memory: 25kB
                                            Buffers: shared hit=1463
                                            ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.539..2.784 rows=760.00 loops=1)
                                                  Buffers: shared hit=1463
                                                  ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.537..2.604 rows=742.00 loops=1)
                                                        Buffers: shared hit=1409
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.052..0.373 rows=878.00 loops=1)
                                                              Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                              Heap Fetches: 50
                                                              Index Searches: 1
                                                              Buffers: shared hit=850
                                                        ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=1.795..1.845 rows=433.00 loops=1)
                                                              Group Key: ((search_flt_2.entity_id)::character varying(255))
                                                              Batches: 1  Memory Usage: 89kB
                                                              Buffers: shared hit=559
                                                              ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.434..1.661 rows=434.00 loops=1)
                                                                    Buffers: shared hit=559
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.433..1.279 rows=434.00 loops=1)
                                                                          Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                                          Heap Fetches: 28
                                                                          Index Searches: 34
                                                                          Buffers: shared hit=549
                                                                    ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..191.94 rows=4 width=516) (actual time=0.340..0.341 rows=0.00 loops=1)
                                                                          Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                                          Heap Fetches: 0
                                                                          Index Searches: 2
                                                                          Buffers: shared hit=10
                                                  ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.050..0.053 rows=18.00 loops=1)
                                                        Buffers: shared hit=27
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..9.23 rows=27 width=516) (actual time=0.023..0.027 rows=18.00 loops=1)
                                                              Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=22
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=516) (actual time=0.017..0.017 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=5
                                                  ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.056..0.059 rows=0.00 loops=1)
                                                        Buffers: shared hit=27
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..9.23 rows=27 width=516) (actual time=0.014..0.019 rows=18.00 loops=1)
                                                              Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                              Heap Fetches: 0
                                                              Index Searches: 1
                                                              Buffers: shared hit=22
                                                        ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.031..0.032 rows=0.00 loops=1)
                                                              Buffers: shared hit=5
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.012..0.012 rows=0.00 loops=1)
                                                                    Index Cond: (key = 'spec.a'::text)
                                                                    Heap Fetches: 0
                                                                    Index Searches: 1
                                                                    Buffers: shared hit=5
                                                              ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                                    Index Cond: (key = 'spec.b'::text)
                                                                    Heap Fetches: 0
                                                                    Index Searches: 0
Planning:
  Buffers: shared hit=20
Planning Time: 2.123 ms
Execution Time: 1195.291 ms
```

## 17 permission rare facet (set operations, 4MB)

```text
GroupAggregate  (cost=17879.37..17914.12 rows=1948 width=70) (actual time=5.958..5.990 rows=3.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=2857
  ->  Sort  (cost=17879.37..17884.46 rows=2035 width=62) (actual time=5.933..5.950 rows=136.00 loops=1)
        Sort Key: search.original_value
        Sort Method: quicksort  Memory: 35kB
        Buffers: shared hit=2857
        ->  Nested Loop  (cost=1228.52..17767.54 rows=2035 width=62) (actual time=3.998..5.895 rows=136.00 loops=1)
              Buffers: shared hit=2857
              ->  Hash Anti Join  (cost=1228.09..1537.98 rows=2042 width=99) (actual time=3.975..4.548 rows=136.00 loops=1)
                    Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=2313
                    ->  Index Only Scan using search_facets_covering_idx on search  (cost=0.69..283.71 rows=2046 width=99) (actual time=0.051..0.454 rows=878.00 loops=1)
                          Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                          Heap Fetches: 50
                          Index Searches: 1
                          Buffers: shared hit=850
                    ->  Hash  (cost=1200.71..1200.71 rows=2136 width=516) (actual time=3.915..3.924 rows=760.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 84kB
                          Buffers: shared hit=1463
                          ->  HashAggregate  (cost=1179.35..1200.71 rows=2136 width=516) (actual time=3.651..3.784 rows=760.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 153kB
                                Buffers: shared hit=1463
                                ->  Append  (cost=677.10..1174.01 rows=2136 width=516) (actual time=2.905..3.424 rows=760.00 loops=1)
                                      Buffers: shared hit=1463
                                      ->  HashSetOp Except  (cost=677.10..682.30 rows=2082 width=516) (actual time=2.904..3.007 rows=742.00 loops=1)
                                            Buffers: shared hit=1409
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.041..0.448 rows=878.00 loops=1)
                                                  Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                  Heap Fetches: 50
                                                  Index Searches: 1
                                                  Buffers: shared hit=850
                                            ->  HashAggregate  (cost=439.12..452.23 rows=1311 width=516) (actual time=2.128..2.184 rows=433.00 loops=1)
                                                  Group Key: ((search_flt_1.entity_id)::character varying(255))
                                                  Batches: 1  Memory Usage: 89kB
                                                  Buffers: shared hit=559
                                                  ->  Append  (cost=0.69..435.84 rows=1311 width=516) (actual time=0.504..1.991 rows=434.00 loops=1)
                                                        Buffers: shared hit=559
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.503..1.540 rows=434.00 loops=1)
                                                              Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 28
                                                              Index Searches: 34
                                                              Buffers: shared hit=549
                                                        ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..191.94 rows=4 width=516) (actual time=0.400..0.400 rows=0.00 loops=1)
                                                              Index Cond: ((key = 'metadata.annotations.spotify.net/repository-visibility'::text) AND (value = ANY (':claims'::text[])))
                                                              Heap Fetches: 0
                                                              Index Searches: 2
                                                              Buffers: shared hit=10
                                      ->  HashSetOp Except  (cost=18.00..18.07 rows=27 width=516) (actual time=0.263..0.266 rows=18.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..9.23 rows=27 width=516) (actual time=0.026..0.033 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.71 rows=1 width=516) (actual time=0.223..0.223 rows=0.00 loops=1)
                                                  Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=5
                                      ->  HashSetOp Intersect  (cost=462.88..462.95 rows=27 width=516) (actual time=0.078..0.080 rows=0.00 loops=1)
                                            Buffers: shared hit=27
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..9.23 rows=27 width=516) (actual time=0.032..0.039 rows=18.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                  Heap Fetches: 0
                                                  Index Searches: 1
                                                  Buffers: shared hit=22
                                            ->  HashSetOp Intersect  (cost=443.18..448.38 rows=2082 width=516) (actual time=0.032..0.033 rows=0.00 loops=1)
                                                  Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.014..0.014 rows=0.00 loops=1)
                                                        Index Cond: (key = 'spec.a'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 1
                                                        Buffers: shared hit=5
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..216.38 rows=2084 width=516) (never executed)
                                                        Index Cond: (key = 'spec.b'::text)
                                                        Heap Fetches: 0
                                                        Index Searches: 0
              ->  Index Scan using final_entities_pkey on final_entities  (cost=0.42..7.95 rows=1 width=37) (actual time=0.009..0.009 rows=1.00 loops=136)
                    Index Cond: ((entity_id)::text = (search.entity_id)::text)
                    Filter: (final_entity IS NOT NULL)
                    Index Searches: 136
                    Buffers: shared hit=544
Planning:
  Buffers: shared hit=20
Planning Time: 2.162 ms
Execution Time: 6.171 ms
```

## 18 negated disjunction facets (set operations, 4MB)

```text
Finalize GroupAggregate  (cost=293709.27..299941.06 rows=20668 width=70) (actual time=601.813..634.021 rows=12.00 loops=1)
  Group Key: search.original_value
  Buffers: shared hit=822540, temp read=10448 written=10512
  I/O Timings: temp read=37.485 write=95.137
  ->  Gather Merge  (cost=293709.27..299486.36 rows=49603 width=70) (actual time=601.803..634.005 rows=34.00 loops=1)
        Workers Planned: 2
        Workers Launched: 2
        Buffers: shared hit=822540, temp read=10448 written=10512
        I/O Timings: temp read=37.485 write=95.137
        ->  Sort  (cost=292709.25..292760.92 rows=20668 width=70) (actual time=594.361..594.371 rows=11.33 loops=3)
              Sort Key: search.original_value
              Sort Method: quicksort  Memory: 25kB
              Buffers: shared hit=822540, temp read=10448 written=10512
              I/O Timings: temp read=37.485 write=95.137
              Worker 0:  Sort Method: quicksort  Memory: 25kB
              Worker 1:  Sort Method: quicksort  Memory: 25kB
              ->  Partial HashAggregate  (cost=291021.18..291227.86 rows=20668 width=70) (actual time=594.184..594.297 rows=11.33 loops=3)
                    Group Key: search.original_value
                    Batches: 1  Memory Usage: 545kB
                    Buffers: shared hit=822524, temp read=10448 written=10512
                    I/O Timings: temp read=37.485 write=95.137
                    Worker 0:  Batches: 1  Memory Usage: 545kB
                    Worker 1:  Batches: 1  Memory Usage: 545kB
                    ->  Parallel Hash Join  (cost=135559.57..288895.79 rows=425078 width=62) (actual time=408.345..552.811 rows=235749.33 loops=3)
                          Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
                          Buffers: shared hit=822524, temp read=10448 written=10512
                          I/O Timings: temp read=37.485 write=95.137
                          ->  Hash Anti Join  (cost=556.14..137143.76 rows=426514 width=99) (actual time=2.968..163.964 rows=235749.33 loops=3)
                                Hash Cond: ((search.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                                Buffers: shared hit=696448
                                ->  Parallel Index Only Scan using search_facets_covering_idx on search  (cost=0.69..130634.95 rows=427848 width=99) (actual time=0.105..118.181 rows=236141.00 loops=3)
                                      Index Cond: (key = 'kind'::text)
                                      Heap Fetches: 63318
                                      Index Searches: 1
                                      Buffers: shared hit=692243
                                ->  Hash  (cost=513.07..513.07 rows=3391 width=516) (actual time=2.837..2.840 rows=1175.00 loops=3)
                                      Buckets: 4096  Batches: 1  Memory Usage: 112kB
                                      Buffers: shared hit=4205
                                      ->  HashAggregate  (cost=479.16..513.07 rows=3391 width=516) (actual time=2.509..2.656 rows=1175.00 loops=3)
                                            Group Key: ((search_flt.entity_id)::character varying(255))
                                            Batches: 1  Memory Usage: 217kB
                                            Buffers: shared hit=4205
                                            Worker 0:  Batches: 1  Memory Usage: 217kB
                                            Worker 1:  Batches: 1  Memory Usage: 217kB
                                            ->  Append  (cost=0.69..470.68 rows=3391 width=516) (actual time=0.555..2.035 rows=1312.00 loops=3)
                                                  Buffers: shared hit=4205
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.554..1.459 rows=434.00 loops=3)
                                                        Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                        Heap Fetches: 84
                                                        Index Searches: 102
                                                        Buffers: shared hit=1655
                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.047..0.465 rows=878.00 loops=3)
                                                        Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                                        Heap Fetches: 150
                                                        Index Searches: 3
                                                        Buffers: shared hit=2550
                          ->  Parallel Hash  (cost=129027.49..129027.49 rows=294155 width=37) (actual time=162.287..162.288 rows=236142.00 loops=3)
                                Buckets: 131072  Batches: 8  Memory Usage: 7328kB
                                Buffers: shared hit=126076, temp written=4356
                                I/O Timings: temp write=41.211
                                ->  Parallel Seq Scan on final_entities  (cost=0.00..129027.49 rows=294155 width=37) (actual time=0.014..97.806 rows=236142.00 loops=3)
                                      Filter: (final_entity IS NOT NULL)
                                      Rows Removed by Filter: 855
                                      Buffers: shared hit=126076
Planning:
  Buffers: shared hit=20
Planning Time: 1.022 ms
Execution Time: 634.213 ms
```

## 18 negated disjunction count (set operations, 4MB)

```text
Aggregate  (cost=300774.47..300774.48 rows=1 width=8) (actual time=1533.862..1533.871 rows=1.00 loops=1)
  Buffers: shared hit=528326, temp read=8632 written=8632
  I/O Timings: temp read=32.234 write=89.618
  ->  Hash Right Semi Join  (cost=158299.10..299057.57 rows=686760 width=0) (actual time=593.228..1486.496 rows=707248.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=528326, temp read=8632 written=8632
        I/O Timings: temp read=32.234 write=89.618
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.033..258.278 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=144026.00..144026.00 rows=702593 width=37) (actual time=592.838..592.845 rows=707251.00 loops=1)
              Buckets: 131072  Batches: 8  Memory Usage: 6971kB
              Buffers: shared hit=127475, temp written=4305
              I/O Timings: temp write=44.300
              ->  Hash Anti Join  (cost=555.46..144026.00 rows=702593 width=37) (actual time=2.585..412.600 rows=707251.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=127475
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.018..289.440 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=513.07..513.07 rows=3391 width=516) (actual time=2.559..2.564 rows=1175.00 loops=1)
                          Buckets: 4096  Batches: 1  Memory Usage: 112kB
                          Buffers: shared hit=1399
                          ->  HashAggregate  (cost=479.16..513.07 rows=3391 width=516) (actual time=2.207..2.367 rows=1175.00 loops=1)
                                Group Key: ((search_flt.entity_id)::character varying(255))
                                Batches: 1  Memory Usage: 217kB
                                Buffers: shared hit=1399
                                ->  Append  (cost=0.69..470.68 rows=3391 width=516) (actual time=0.467..1.836 rows=1312.00 loops=1)
                                      Buffers: shared hit=1399
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.466..1.340 rows=434.00 loops=1)
                                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                            Heap Fetches: 28
                                            Index Searches: 34
                                            Buffers: shared hit=549
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..216.38 rows=2084 width=516) (actual time=0.040..0.374 rows=878.00 loops=1)
                                            Index Cond: (key = 'metadata.annotations.spotify.net/repository-visibility'::text)
                                            Heap Fetches: 50
                                            Index Searches: 1
                                            Buffers: shared hit=850
Planning:
  Buffers: shared hit=20
Planning Time: 1.127 ms
Execution Time: 1534.021 ms
```

## 19 large in under or count (set operations, 4MB)

```text
Aggregate  (cost=1122363.73..1122363.74 rows=1 width=8) (actual time=2750.563..2750.572 rows=1.00 loops=1)
  Buffers: shared hit=1109465, temp read=23139 written=23142
  I/O Timings: temp read=97.749 write=274.913
  ->  Hash Right Semi Join  (cost=923076.34..1120999.05 rows=545869 width=0) (actual time=1807.754..2707.091 rows=574230.00 loops=1)
        Hash Cond: ((search.entity_id)::text = (final_entities.entity_id)::text)
        Buffers: shared hit=1109465, temp read=23139 written=23142
        I/O Timings: temp read=97.749 write=274.913
        ->  Index Only Scan using search_key_value_entity_idx on search  (cost=0.69..107798.20 rows=1063299 width=37) (actual time=0.022..303.474 rows=708423.00 loops=1)
              Index Cond: ((key = 'metadata.name'::text) AND (value IS NOT NULL))
              Heap Fetches: 64317
              Index Searches: 1
              Buffers: shared hit=400851
        ->  Hash  (cost=851216.52..851216.52 rows=857611 width=553) (actual time=1806.031..1806.038 rows=574230.00 loops=1)
              Buckets: 16384  Batches: 64  Memory Usage: 1045kB
              Buffers: shared hit=708614, temp read=11733 written=18192
              I/O Timings: temp read=47.750 write=205.894
              ->  Hash Join  (cost=648027.75..851216.52 rows=857611 width=553) (actual time=785.713..1618.874 rows=574230.00 loops=1)
                    Hash Cond: ((final_entities.entity_id)::text = (((search_flt.entity_id)::character varying(255)))::text)
                    Buffers: shared hit=708614, temp read=11733 written=11736
                    I/O Timings: temp read=47.750 write=143.237
                    ->  Seq Scan on final_entities  (cost=0.00..133159.58 rows=705973 width=37) (actual time=0.018..324.180 rows=708426.00 loops=1)
                          Filter: (final_entity IS NOT NULL)
                          Rows Removed by Filter: 2565
                          Buffers: shared hit=126076
                    ->  Hash  (cost=580127.40..580127.40 rows=860508 width=516) (actual time=785.254..785.258 rows=574230.00 loops=1)
                          Buckets: 16384  Batches: 64  Memory Usage: 721kB
                          Buffers: shared hit=582538, temp read=2884 written=6786
                          I/O Timings: temp read=10.905 write=77.005
                          ->  Unique  (cost=575824.86..580127.40 rows=860508 width=516) (actual time=441.096..659.102 rows=574230.00 loops=1)
                                Buffers: shared hit=582538, temp read=2884 written=2887
                                I/O Timings: temp read=10.905 write=25.930
                                ->  Sort  (cost=575824.86..577976.13 rows=860508 width=516) (actual time=441.092..548.058 rows=574630.00 loops=1)
                                      Sort Key: ((search_flt.entity_id)::character varying(255)) COLLATE "C"
                                      Sort Method: external merge  Disk: 23072kB
                                      Buffers: shared hit=582538, temp read=2884 written=2887
                                      I/O Timings: temp read=10.905 write=25.930
                                      ->  Append  (cost=0.69..90993.02 rows=860508 width=516) (actual time=0.030..286.118 rows=574630.00 loops=1)
                                            Buffers: shared hit=582538
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..86453.13 rows=859201 width=516) (actual time=0.029..239.818 rows=574196.00 loops=1)
                                                  Index Cond: ((key = 'kind'::text) AND (value = ANY ('{component,api,resource,subcomponent}'::text[])))
                                                  Heap Fetches: 55899
                                                  Index Searches: 2
                                                  Buffers: shared hit=581989
                                            ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..237.35 rows=1307 width=516) (actual time=0.473..1.331 rows=434.00 loops=1)
                                                  Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (':claims'::text[])))
                                                  Heap Fetches: 28
                                                  Index Searches: 34
                                                  Buffers: shared hit=549
Planning:
  Buffers: shared hit=20
Planning Time: 1.228 ms
Execution Time: 2756.619 ms
```

## 20 permission component list (set operations, 32MB)

```text
Sort  (cost=178075.27..178192.51 rows=46893 width=1209) (actual time=563.502..579.940 rows=60599 loops=1)
  Sort Key: final_entities.entity_ref COLLATE "C"
  Sort Method: external merge  Disk: 36224kB
  Buffers: shared hit=177478, temp read=4528 written=4529
  I/O Timings: temp read=7.268 write=15.907
  ->  Hash Join  (cost=25674.68..149590.56 rows=46893 width=1209) (actual time=78.940..475.337 rows=60599 loops=1)
        Hash Cond: (final_entities.entity_id = (fset.entity_id)::text)
        Buffers: shared hit=177475
        ->  Seq Scan on final_entities  (cost=0.00..122210.74 rows=649572 width=1177) (actual time=0.021..237.664 rows=649632 loops=1)
              Filter: (final_entity IS NOT NULL)
              Rows Removed by Filter: 605
              Buffers: shared hit=115707
        ->  Hash  (cost=25087.80..25087.80 rows=46951 width=32) (actual time=78.495..78.514 rows=60599 loops=1)
              Buckets: 65536  Batches: 1  Memory Usage: 4596kB
              Buffers: shared hit=61768
              ->  Subquery Scan on fset  (cost=0.69..25087.80 rows=46951 width=32) (actual time=53.579..67.483 rows=60599 loops=1)
                    Buffers: shared hit=61768
                    ->  HashSetOp Except  (cost=0.69..25087.80 rows=46951 width=36) (actual time=53.577..62.800 rows=60599 loops=1)
                          Buffers: shared hit=61768
                          ->  Append  (cost=0.69..24962.56 rows=50096 width=36) (actual time=0.072..32.533 rows=61697 loops=1)
                                Buffers: shared hit=61768
                                ->  Subquery Scan on "*SELECT* 1"  (cost=0.69..14107.14 rows=48591 width=36) (actual time=0.071..23.432 rows=60599 loops=1)
                                      Buffers: shared hit=59680
                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt  (cost=0.69..13621.23 rows=48591 width=32) (actual time=0.071..18.822 rows=60599 loops=1)
                                            Index Cond: ((key = 'kind'::text) AND (value = 'component'::text))
                                            Heap Fetches: 4366
                                            Buffers: shared hit=59680
                                ->  Result  (cost=10582.36..10604.93 rows=1505 width=36) (actual time=5.365..5.633 rows=1098 loops=1)
                                      Buffers: shared hit=2088
                                      ->  Unique  (cost=10582.36..10589.88 rows=1505 width=32) (actual time=5.363..5.544 rows=1098 loops=1)
                                            Buffers: shared hit=2088
                                            ->  Sort  (cost=10582.36..10586.12 rows=1505 width=32) (actual time=5.362..5.412 rows=1098 loops=1)
                                                  Sort Key: "*SELECT* 2".entity_id COLLATE "C"
                                                  Sort Method: quicksort  Memory: 49kB
                                                  Buffers: shared hit=2088
                                                  ->  Append  (cost=0.69..10502.93 rows=1505 width=32) (actual time=4.375..5.028 rows=1098 loops=1)
                                                        Buffers: shared hit=2088
                                                        ->  Result  (cost=0.69..9531.32 rows=1475 width=32) (actual time=4.374..4.520 rows=893 loops=1)
                                                              Buffers: shared hit=1711
                                                              ->  HashSetOp Except  (cost=0.69..9516.57 rows=1475 width=36) (actual time=4.372..4.450 rows=893 loops=1)
                                                                    Buffers: shared hit=1711
                                                                    ->  Append  (cost=0.69..9450.17 rows=26562 width=36) (actual time=0.047..4.079 rows=1157 loops=1)
                                                                          Buffers: shared hit=1711
                                                                          ->  Subquery Scan on "*SELECT* 2"  (cost=0.69..444.30 rows=1477 width=36) (actual time=0.047..0.398 rows=893 loops=1)
                                                                                Buffers: shared hit=876
                                                                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_1  (cost=0.69..429.53 rows=1477 width=32) (actual time=0.046..0.332 rows=893 loops=1)
                                                                                      Index Cond: (key = 'metadata.annotations.example.com/readers'::text)
                                                                                      Heap Fetches: 78
                                                                                      Buffers: shared hit=876
                                                                          ->  HashAggregate  (cost=8622.21..8873.06 rows=25085 width=36) (actual time=3.496..3.619 rows=264 loops=1)
                                                                                Group Key: ((search_flt_2.entity_id)::text)
                                                                                Batches: 1  Memory Usage: 817kB
                                                                                Buffers: shared hit=835
                                                                                ->  Append  (cost=0.69..8559.50 rows=25085 width=32) (actual time=1.144..3.393 rows=265 loops=1)
                                                                                      Buffers: shared hit=835
                                                                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_2  (cost=0.69..7600.87 rows=24982 width=32) (actual time=1.144..2.603 rows=265 loops=1)
                                                                                            Index Cond: ((key = 'relations.ownedby'::text) AND (value = ANY (:claims)))
                                                                                            Heap Fetches: 10
                                                                                            Buffers: shared hit=825
                                                                                      ->  Index Only Scan using search_key_value_entity_idx on search search_flt_3  (cost=0.69..833.20 rows=103 width=32) (actual time=0.773..0.774 rows=0 loops=1)
                                                                                            Index Cond: ((key = 'metadata.annotations.example.com/readers'::text) AND (value = ANY (:claims)))
                                                                                            Heap Fetches: 0
                                                                                            Buffers: shared hit=10
                                                        ->  Result  (cost=0.69..18.12 rows=15 width=32) (actual time=0.202..0.227 rows=205 loops=1)
                                                              Buffers: shared hit=186
                                                              ->  HashSetOp Except  (cost=0.69..17.97 rows=15 width=36) (actual time=0.201..0.211 rows=205 loops=1)
                                                                    Buffers: shared hit=186
                                                                    ->  Append  (cost=0.69..17.93 rows=16 width=36) (actual time=0.027..0.145 rows=205 loops=1)
                                                                          Buffers: shared hit=186
                                                                          ->  Subquery Scan on "*SELECT* 5"  (cost=0.69..9.14 rows=15 width=36) (actual time=0.026..0.104 rows=205 loops=1)
                                                                                Buffers: shared hit=181
                                                                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_4  (cost=0.69..8.99 rows=15 width=32) (actual time=0.026..0.087 rows=205 loops=1)
                                                                                      Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                                                      Heap Fetches: 16
                                                                                      Buffers: shared hit=181
                                                                          ->  Subquery Scan on "*SELECT* 6"  (cost=0.69..8.71 rows=1 width=36) (actual time=0.028..0.029 rows=0 loops=1)
                                                                                Buffers: shared hit=5
                                                                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_5  (cost=0.69..8.71 rows=1 width=32) (actual time=0.028..0.028 rows=0 loops=1)
                                                                                      Index Cond: ((key = 'spec.custom'::text) AND (value = 'x'::text))
                                                                                      Heap Fetches: 0
                                                                                      Buffers: shared hit=5
                                                        ->  Result  (cost=0.69..945.96 rows=15 width=32) (actual time=0.213..0.218 rows=0 loops=1)
                                                              Buffers: shared hit=191
                                                              ->  HashSetOp Intersect  (cost=0.69..945.81 rows=15 width=36) (actual time=0.213..0.218 rows=0 loops=1)
                                                                    Buffers: shared hit=191
                                                                    ->  Append  (cost=0.69..942.08 rows=1490 width=36) (actual time=0.018..0.162 rows=205 loops=1)
                                                                          Buffers: shared hit=191
                                                                          ->  Subquery Scan on "*SELECT* 9"  (cost=0.69..9.14 rows=15 width=36) (actual time=0.017..0.078 rows=205 loops=1)
                                                                                Buffers: shared hit=181
                                                                                ->  Index Only Scan using search_key_value_entity_idx on search search_flt_6  (cost=0.69..8.99 rows=15 width=32) (actual time=0.017..0.062 rows=205 loops=1)
                                                                                      Index Cond: ((key = 'kind'::text) AND (value = 'template'::text))
                                                                                      Heap Fetches: 16
                                                                                      Buffers: shared hit=181
                                                                          ->  Result  (cost=0.69..925.50 rows=1475 width=36) (actual time=0.067..0.071 rows=0 loops=1)
                                                                                Buffers: shared hit=10
                                                                                ->  HashSetOp Intersect  (cost=0.69..910.75 rows=1475 width=36) (actual time=0.067..0.070 rows=0 loops=1)
                                                                                      Buffers: shared hit=10
                                                                                      ->  Append  (cost=0.69..903.36 rows=2954 width=36) (actual time=0.060..0.062 rows=0 loops=1)
                                                                                            Buffers: shared hit=10
                                                                                            ->  Subquery Scan on "*SELECT* 7"  (cost=0.69..444.30 rows=1477 width=36) (actual time=0.029..0.030 rows=0 loops=1)
                                                                                                  Buffers: shared hit=5
                                                                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_7  (cost=0.69..429.53 rows=1477 width=32) (actual time=0.029..0.029 rows=0 loops=1)
                                                                                                        Index Cond: (key = 'spec.a'::text)
                                                                                                        Heap Fetches: 0
                                                                                                        Buffers: shared hit=5
                                                                                            ->  Subquery Scan on "*SELECT* 8"  (cost=0.69..444.30 rows=1477 width=36) (actual time=0.030..0.030 rows=0 loops=1)
                                                                                                  Buffers: shared hit=5
                                                                                                  ->  Index Only Scan using search_key_value_entity_idx on search search_flt_8  (cost=0.69..429.53 rows=1477 width=32) (actual time=0.029..0.029 rows=0 loops=1)
                                                                                                        Index Cond: (key = 'spec.b'::text)
                                                                                                        Heap Fetches: 0
                                                                                                        Buffers: shared hit=5
Planning:
  Buffers: shared hit=288
Planning Time: 3.582 ms
Serialization: time=454.502 ms  output=271059kB  format=binary
  Buffers: shared hit=190124
Execution Time: 1051.972 ms
```

## 20 unfiltered list (32MB)

```text
Gather Merge  (cost=287229.75..350386.99 rows=541310 width=1209) (actual time=477.463..1056.934 rows=649632 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  Buffers: shared hit=115821, temp read=100827 written=100852
  I/O Timings: temp read=165.899 write=366.598
  ->  Sort  (cost=286229.72..286906.36 rows=270655 width=1209) (actual time=471.731..609.983 rows=216544 loops=3)
        Sort Key: entity_ref COLLATE "C"
        Sort Method: external merge  Disk: 287960kB
        Buffers: shared hit=115821, temp read=100827 written=100852
        I/O Timings: temp read=165.899 write=366.598
        Worker 0:  Sort Method: external merge  Disk: 256624kB
        Worker 1:  Sort Method: external merge  Disk: 262032kB
        ->  Parallel Seq Scan on final_entities  (cost=0.00..118416.89 rows=270655 width=1209) (actual time=0.007..88.666 rows=216544 loops=3)
              Filter: (final_entity IS NOT NULL)
              Rows Removed by Filter: 202
              Buffers: shared hit=115707
Planning:
  Buffers: shared hit=132
Planning Time: 0.476 ms
Serialization: time=1030.917 ms  output=1375653kB  format=binary
  Buffers: shared hit=263635
Execution Time: 2181.320 ms
```
