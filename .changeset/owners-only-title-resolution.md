---
'@backstage/plugin-catalog-react': patch
---

Fixed `EntityOwnerPicker` in `owners-only` mode to display human-readable entity titles (from `metadata.title` or `spec.profile.displayName`) instead of opaque internal names, both in the dropdown list and in the selected owner chips. The owner list is now virtualized, keeping the picker responsive for catalogs with large numbers of owner entities.
