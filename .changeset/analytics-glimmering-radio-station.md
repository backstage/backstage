---
'@backstage/plugin-analytics-module-ga': patch
---

Initial Google Analytics implementation for the Backstage Analytics API, which:

- Handles pageview and custom event instrumentation idiomatically.
- Enables custom dimension and metric collection via app config.
- Includes configurable debug/test mode for non-production environments.
