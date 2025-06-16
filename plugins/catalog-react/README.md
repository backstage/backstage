# Catalog React

WORK IN PROGRESS

This is shared code of the frontend part of the default catalog plugin.

It will implement the core API for handling your catalog of software, and
supplies components that can be reused by third-party plugins.

## Usage Example

```tsx
import { EntityListProvider } from '@backstage/plugin-catalog-react';

<EntityListProvider>
  <YourCatalogComponent />
</EntityListProvider>;
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog)
- [Backend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend)
- [The Backstage homepage](https://backstage.io)
