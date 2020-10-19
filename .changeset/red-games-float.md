---
'@backstage/plugin-cost-insights': minor
---

- getProjectDailyCost and getGroupDailyCost no longer accept a metric as a parameter
- getDailyMetricData added to API for fetching daily metric data for given interval
- dailyCost removed as configurable metric
- default field added to metric configuration for displaying comparison metric data in top panel
- Metric.kind can no longer be null
- MetricData type added
