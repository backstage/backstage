---
'@backstage/plugin-catalog-react': patch
---

Memoize the context value in `EntityListProvider`.

This removes quite a few unnecessary rerenders of the inner components.

When running the full `CatalogPage` test:

- Before: 98 table render calls total, 16 seconds runtime
- After: 57 table render calls total, 14 seconds runtime

This doesn't account for all of the slowness, but does give a minor difference in perceived speed in the browser too.
