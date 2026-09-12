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
