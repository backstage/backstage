---
'@backstage/plugin-catalog-react': minor
---

Add optional `fields` prop to EntityListProvider to optimize API requests by reducing response payload size.

```tsx
<EntityListProvider fields={['kind', 'metadata.name', 'metadata.namespace']}>
  <CatalogTable />
</EntityListProvider>
```
