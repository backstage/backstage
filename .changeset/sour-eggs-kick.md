---
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

Added the following deprecations to the `catalog-react` package:

- **DEPRECATION**: `useEntity` will now warn if the entity has not yet been loaded, and will soon throw errors instead. If you're using the default implementation of `EntityLayout` and `EntitySwitch` then these components will ensure that there is an entity loaded before rendering children. If you're implementing your own `EntityLayout` or `EntitySwitch` or something that operates outside or adjacent to them, then use `useAsyncEntity`.

- **DEPRECATION**: the `loading`, `error` and `refresh` properties that are returned from `useEntity` have been deprecated, and are available on `useAsyncEntity` instead.
