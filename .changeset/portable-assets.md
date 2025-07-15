---
'@backstage/backend-plugin-api': minor
'@backstage/cli': patch
---

Add `resolvePackageAssets` function as a more portable alternative to `resolvePackagePath`.

This new function works by leveraging the CLI build system to copy asset directories (like `migrations`, `assets`, `templates`) to predictable locations in the built package. The CLI now includes a rollup plugin that automatically copies these directories during the build process.

The `resolvePackageAssets` function then looks for assets in multiple locations:
1. Relative to the built module (for production)
2. In the package root (for development)
3. In the dist directory (fallback)

This approach is more portable than `resolvePackagePath` because it doesn't rely on package.json files being available, making it work better in bundled environments.

Migration example:
```ts
// Before
const migrationsDir = resolvePackagePath('@backstage/plugin-catalog-backend', 'migrations');

// After  
const migrationsDir = resolvePackageAssets(__dirname, 'migrations');
```