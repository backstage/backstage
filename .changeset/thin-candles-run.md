---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: The `useEntity` hook no longer returns loading or error states, and will throw an error if the entity is not immediately available. In practice this means that `useEntity` can only be used in contexts where the entity is guaranteed to have been loaded, for example inside an `EntityLayout`. To access the loading state of the entity, use `useAsyncEntity` instead.
