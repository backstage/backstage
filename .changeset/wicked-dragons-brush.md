---
'@backstage/plugin-techdocs': minor
---

Use the same initial filter `owned` for the `TechDocsIndexPage` as for the `CatalogPage`.

If you prefer to keep the previous behavior, you can change the default for the initial filter
to `all` (or `starred` if you rather prefer that).

```
<TechDocsIndexPage initiallySelectedFilter="all" />
```

In general, with this change you will be able to set props at `TechDocsIndexPage`.
