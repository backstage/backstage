---
'@backstage/plugin-catalog-react': patch
---

Fixed `EntityOwnerPicker` to properly handle entity references that are not in cache. The `getOptionLabel` function now correctly handles the type difference between cached entities (full `Entity` objects) and parsed references (`CompoundEntityRef`), and gracefully handles invalid entity references by catching parsing errors.
