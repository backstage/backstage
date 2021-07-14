---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-scaffolder': patch
---

Updated the software templates list page (`ScaffolderPage`) to use the `useEntityListProvider` hook from #5643. This reduces the code footprint, making it easier to customize the display of this page, and consolidates duplicate approaches to querying the catalog with filters.

- The `useEntityTypeFilter` hook has been updated along with the underlying `EntityTypeFilter` to work with multiple values, to allow more flexibility for different user interfaces. It's unlikely that this change affects you; however, if you're using either of these directly, you'll need to update your usage.
- `SearchToolbar` was renamed to `EntitySearchBar` and moved to `catalog-react` to be usable by other entity list pages
- `UserListPicker` now has an `availableTypes` prop to restrict which user-related options to present
