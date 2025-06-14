---
'@backstage/plugin-catalog-react': minor
---

Add optional `fields` prop and dynamic `setFields` method to EntityListProvider to optimize API requests by reducing response payload size.

```tsx
// Static field selection
<EntityListProvider fields={['kind', 'metadata.name', 'metadata.namespace']}>
  <CatalogTable />
</EntityListProvider>;

// Dynamic field updates
function MyComponent() {
  const { setFields } = useEntityList();

  const handleColumnChange = (columns: string[]) => {
    setFields(columns); // Updates fields dynamically
  };

  return <CustomTable onColumnsChange={handleColumnChange} />;
}
```
