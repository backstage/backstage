---
'@backstage/plugin-catalog': minor
---

Allows the customization of catalog pages by providing a "base" catalog page
which lets users specify their own table components and filters.

```typescript
// You can specify the base page like so:
<CatalogIndexBasePage
  showHeaderTabs={false}
  showManagedFilters
  showSupportButton
  TableComponent={CustomTable}
/>
```
