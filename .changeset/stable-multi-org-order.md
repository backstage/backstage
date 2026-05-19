---
'@backstage/plugin-catalog-backend-module-github': patch
---

The `GithubMultiOrgEntityProvider` now emits entities in a stable order during full mutations. Entities are sorted by entity ref, with the location annotation as a tiebreaker for entities that share the same ref. This prevents entity data from flickering between different GitHub orgs across refresh cycles when `alwaysUseDefaultNamespace` is enabled and teams with identical slugs exist in multiple orgs.
