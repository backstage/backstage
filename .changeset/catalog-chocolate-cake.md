---
'@backstage/plugin-catalog': patch
---

Add the ability to change the initially selected filter, if not set it still defaults to `owned`.

```js
<Route
  path="/catalog"
  element={<CatalogIndexPage initiallySelectedFilter="all" />}
/>
```
