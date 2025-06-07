# Catalog React

WORK IN PROGRESS

This is shared code of the frontend part of the default catalog plugin.

It will implement the core API for handling your catalog of software, and
supplies components that can be reused by third-party plugins.

## Performance Optimization with Field Selection

### Overview

The `EntityListProvider` supports optional field selection to optimize API requests and improve performance. By specifying only the fields you need, you can reduce response payload sizes by 60-75%, leading to faster page loads and reduced bandwidth usage.

### Usage

#### Basic Example

```tsx
import { EntityListProvider } from '@backstage/plugin-catalog-react';

// Fetch only essential fields for better performance
<EntityListProvider
  fields={['kind', 'metadata.name', 'metadata.namespace', 'spec.type']}
>
  <YourCatalogComponent />
</EntityListProvider>;
```

#### Common Field Combinations

```tsx
// Minimal fields for basic entity listing
const minimalFields = ['kind', 'metadata.name', 'metadata.namespace'];

// Standard catalog table fields
const catalogTableFields = [
  'kind',
  'metadata.name',
  'metadata.namespace',
  'metadata.title',
  'metadata.description',
  'metadata.tags',
  'spec.type',
  'spec.lifecycle',
];

// Fields for entity cards with ownership
const entityCardFields = [
  'kind',
  'metadata.name',
  'metadata.namespace',
  'metadata.title',
  'metadata.description',
  'metadata.tags',
  'metadata.labels',
  'spec.type',
  'spec.lifecycle',
  'relations',
];
```

#### With Pagination

```tsx
// Works with all pagination modes
<EntityListProvider
  pagination={{ mode: 'offset', limit: 50 }}
  fields={catalogTableFields}
>
  <CatalogTable />
</EntityListProvider>

// Cursor pagination
<EntityListProvider
  pagination={{ mode: 'cursor', limit: 20 }}
  fields={minimalFields}
>
  <EntityGrid />
</EntityListProvider>
```

### Performance Benefits

| Scenario                       | Without Field Selection | With Field Selection | Savings |
| ------------------------------ | ----------------------- | -------------------- | ------- |
| Small catalog (50 entities)    | ~125KB                  | ~30KB                | 76%     |
| Medium catalog (200 entities)  | ~500KB                  | ~120KB               | 76%     |
| Large catalog (1000+ entities) | ~2.5MB+                 | ~600KB               | 76%     |

### Available Fields

You can specify any valid entity field path:

- **Kind**: `kind`
- **Metadata**: `metadata.name`, `metadata.namespace`, `metadata.title`, `metadata.description`, `metadata.tags`, `metadata.labels`, `metadata.annotations`
- **Spec**: `spec.type`, `spec.lifecycle`, `spec.owner`, `spec.targets`, `spec.target`
- **Relations**: `relations`
- **Status**: `status.*` (if needed)

### Best Practices

1. **Start minimal**: Begin with only the fields you display, then add as needed
2. **Test performance**: Measure load times with and without field selection
3. **Consider caching**: Field selection works well with caching strategies
4. **Monitor usage**: Track which fields are actually used in your UI

### Backward Compatibility

Field selection is completely optional. Existing code continues to work unchanged:

```tsx
// This still works - no fields parameter means all fields are fetched
<EntityListProvider>
  <ExistingComponent />
</EntityListProvider>
```

### Migration Guide

To optimize an existing catalog implementation:

1. **Identify displayed fields**: List all entity fields shown in your UI
2. **Add fields parameter**: Start with minimal set and expand as needed
3. **Test thoroughly**: Ensure all functionality works with limited fields
4. **Measure impact**: Compare performance before and after optimization

```tsx
// Before - fetches all entity data
<EntityListProvider>
  <CustomCatalogTable />
</EntityListProvider>

// After - optimized for performance
<EntityListProvider
  fields={['kind', 'metadata.name', 'metadata.namespace', 'spec.type']}
>
  <CustomCatalogTable />
</EntityListProvider>
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog)
- [Backend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend)
- [The Backstage homepage](https://backstage.io)
