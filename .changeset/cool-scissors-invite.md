---
'@backstage/plugin-catalog': patch
---

Add the option to define custom header title and/or subtitle for the catalog layout page that would replace the greetings in random languages.

```js
<Route
  path="/catalog"
  element={
    <CatalogIndexPage
      customHeaderTitle="MyCompany Service Catalog"
      customHeaderSubtitle="Some subtitle text"
    />
  }
/>
```
