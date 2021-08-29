---
'@backstage/core-components': minor
---

Changed the `titleComponent` prop on `ContentHeader` to accept `ReactNode` instead of a React `ComponentType`. Usages of this prop should be converted from passing a component to passing in the rendered element:

```diff
-<ContentHeader titleComponent={MyComponent}>
+<ContentHeader titleComponent={<MyComponent />}>
```
