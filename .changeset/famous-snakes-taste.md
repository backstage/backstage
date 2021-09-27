---
'@backstage/core-plugin-api': minor
'@backstage/core-app-api': patch
'@backstage/core-components': patch
'@backstage/test-utils': patch
'@backstage/plugin-catalog-react': patch
---

Extend `StorageApi#set` to support a function argument that provides the old value prior to setting the new value.

This pattern was implemented in the provided interface implementations, in the `useStarredEntities` hook, and in the `DismissableBanner` component.
