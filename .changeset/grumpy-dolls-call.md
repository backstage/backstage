---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-scaffolder': patch
---

Updated the software templates list page (`ScaffolderPage`) to use the `useEntityListProvider` hook from #5643. This reduces the code footprint, making it easier to customize the display of this page, and consolidates duplicate approaches to querying the catalog with filters.

- `SearchToolbar` was renamed to `EntitySearchBar` and moved to `catalog-react` to be usable by other entity list pages
- The `useEntityTypeFilter` hook now allows multiple selected types
- `UserListPicker` now has an `availableTypes` prop to restrict which user-related options to present
