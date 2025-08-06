---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The `element` param for `AppRootElementBlueprint` no longer accepts a component. If you are currently passing a component such as `element: () => <MyComponent />` or `element: MyComponent`, simply switch to `element: <MyComponent />`.
