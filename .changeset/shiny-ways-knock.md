---
'@backstage/backend-defaults': patch
---

`GerritUrlReader` now implements the `search` method, which can be used to find files matching a glob pattern (using `minimatch` patterns).

This allows the Gerrit Discovery to find all Backstage manifests (`catalog-info.yaml` files inside a repository).
