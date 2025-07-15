---
'@backstage/backend-plugin-api': minor
---

Add `resolvePackageAssets` function and update `resolveFromFile` for improved stability in production builds

**Breaking change in behavior**: `resolveFromFile` now only accepts `import.meta.url` (ES modules) and rejects `__dirname` because `__dirname` and `__filename` are not stable in production builds and bundled environments.

**New `resolvePackageAssets` function**: Provides stable path resolution for CommonJS modules by using the module resolution system instead of relying on unstable file paths.

**Migration guide:**

ES modules (recommended):
```typescript
// Use import.meta.url for stable resolution
const migrationsDir = resolveFromFile(import.meta.url, '../migrations');
```

CommonJS modules:
```typescript
// Use resolvePackageAssets instead of __dirname-based approaches
const migrationsDir = resolvePackageAssets('@backstage/plugin-auth-backend', 'migrations');
```

This ensures stable behavior across all deployment scenarios including bundled production environments.