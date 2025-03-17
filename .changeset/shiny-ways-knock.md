---
'@backstage/backend-defaults': patch
---

`GerritUrlReader` is now able to `search` files matching a given pattern URL (using `minimatch` glob patterns).

This allows the Gerrit Discovery to find all Backstage manifests inside a repository using the `**/catalog-info.yaml` pattern.
