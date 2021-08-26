---
'@backstage/plugin-catalog-react': patch
---

Use the history API directly in `useEntityListProvider`.

This replaces `useSearchParams`/`useNavigate`, since they cause at least one additional re-render compared to using this method.

Table re-render count is down additionally:

- Initial render of catalog page: 12 -> 9
- Full `CatalogPage` test: 57 -> 48
