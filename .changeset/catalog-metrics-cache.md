---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance of the `catalog_entities_count` metric.

The legacy Prometheus and OpenTelemetry observable gauges previously each ran their own copy of the per-kind count query against the `search` table on every metrics scrape. On large catalogs this could pile up faster than the queries completed, contending for buffers and stalling the database.

The two callbacks now share a single query result with a short in-process TTL cache, and the underlying query reads from `final_entities` instead of `search`, avoiding the bitmap heap scans that dominated the previous form. The emitted labels and values are unchanged.
