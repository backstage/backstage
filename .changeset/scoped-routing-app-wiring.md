---
'@backstage/frontend-app-api': patch
---

The new frontend system now owns app history independently of page routing libraries, so page matching, route references, and navigation analytics use the same location and route hierarchy. Href creation and navigation require app-absolute paths starting with `/`, excluding the deployment basename, and custom `appHistoryApiRef` factories must be available during initialization without an `if` predicate. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
