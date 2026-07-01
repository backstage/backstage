---
'@backstage/plugin-catalog-backend': patch
---

Made `entitiesCatalog`, `locationAnalyzer`, `refreshService`, and `locationService` required in the catalog router options, removing the conditional guards around their route registrations. These services are always provided by the catalog builder and have never been optional in practice.
