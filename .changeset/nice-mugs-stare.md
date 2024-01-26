---
'@backstage/plugin-xcmetrics': patch
---

Fixed bug in XcMetricsClient where it was not including parameter for excludeCI, which is now a required param for XCMetrics.
