# Catalog React

WORK IN PROGRESS

This is shared code of the frontend part of the default catalog plugin.

It will implement the core API for handling your catalog of software, and
supplies components that can be reused by third-party plugins.

## Usage Example

```tsx
import { EntityListProvider, useEntityList } from '@backstage/plugin-catalog-react';

// Basic usage
<EntityListProvider>
  <YourCatalogComponent />
</EntityListProvider>

// With field selection for better performance
<EntityListProvider fields={['kind', 'metadata.name', 'metadata.namespace']}>
  <YourCatalogComponent />
</EntityListProvider>

// Dynamic field updates
function MyComponent() {
  const { setFields } = useEntityList();

  const handleColumnChange = (columns: string[]) => {
    setFields(columns); // Updates fields dynamically
  };

  return <CustomTable onColumnsChange={handleColumnChange} />;
}
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog)
- [Backend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend)
- [The Backstage homepage](https://backstage.io)
