---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

Added the following deprecations to the `catalog-react` package:

- **DEPRECATION**: `useEntity` will now warn if the entity has not yet been loaded. This hook is now designed only to be used inside of an `EntityPage` where the `entity` prop is guaranteed to be defined. If you would like to use it outside, please use `useAsyncEntity` instead.
- **DEPRECATION**: the `loading`, `error` and `refresh` properties that are returned from `useEntity` have been deprecated, and are available on `useAsyncEntity` instead.
