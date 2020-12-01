---
'@backstage/plugin-catalog-backend': patch
---

Add metrics around catalog refresh. This adds the following metrics:

```
# HELP backstage_catalog_entities_total Count of entities in the catalog
# TYPE backstage_catalog_entities_total gauge
backstage_catalog_entities_total 185

# HELP backstage_catalog_locations_total Count of locations in the catalog
# TYPE backstage_catalog_locations_total gauge
backstage_catalog_locations_total 1

# HELP backstage_catalog_refresh_duration_seconds Duration of a catalog refresh in seconds
# TYPE backstage_catalog_refresh_duration_seconds gauge
backstage_catalog_refresh_duration_seconds 25.251336767

# HELP backstage_catalog_locations_refreshed_total Total amount of refreshed locations
# TYPE backstage_catalog_locations_refreshed_total counter
backstage_catalog_locations_refreshed_total 1

# HELP backstage_catalog_entities_refreshed_total Total amount of refreshed entities
# TYPE backstage_catalog_entities_refreshed_total counter
backstage_catalog_entities_refreshed_total 185

# HELP backstage_catalog_locations_refresh_failures_total Total amount of location refresh failures
# TYPE backstage_catalog_locations_refresh_failures_total counter
backstage_catalog_locations_refresh_failures_total 0

# HELP backstage_catalog_entities_refresh_failures_total Total amount of entity refresh failures
# TYPE backstage_catalog_entities_refresh_failures_total counter
backstage_catalog_entities_refresh_failures_total 0
```
