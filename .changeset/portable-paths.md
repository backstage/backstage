---
'@backstage/backend-plugin-api': minor
---

Add `resolvePackageDir` function to provide more portable path resolution without requiring package names

**New `resolvePackageDir` function**: Provides safer path resolution by making `__dirname` usage explicit. Instead of developers writing error-prone `path.resolve(__dirname, '../../..')` patterns, they can use a more controlled helper function.

**Migration guide:**

```typescript
// Old approach (requires package name)
const migrationsDir = resolvePackagePath('@backstage/plugin-catalog-backend', 'migrations');

// New approach (explicit __dirname, no package name needed)
const migrationsDir = resolvePackageDir(__dirname, '..', '..', 'migrations');
```

This approach eliminates the need to specify package names while providing a safer alternative to manual path construction. While it still uses `__dirname`, it centralizes this usage and makes it explicit, reducing errors compared to manual path resolution.