---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
'@backstage/frontend-app-api': patch
---

Added `elements` and `wrappers` inputs to `app/root`, that let you add things to the root of the React tree above the layout. You can use the `createAppRootElementExtension` and `createAppRootWrapperExtension` extension creator, respectively, to conveniently create such extensions.
