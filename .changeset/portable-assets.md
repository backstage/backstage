---
'@backstage/backend-plugin-api': minor
'@backstage/cli': patch
---

Add `resolvePackageAssets` function as a more reliable alternative to `resolvePackagePath`.

This new function provides reliable asset resolution across all deployment scenarios by using module resolution instead of file system assumptions. The CLI now generates asset resolver modules during the build process that enable reliable runtime asset discovery.

Key improvements:
1. **No dependency on `__dirname`**: Uses package name and module resolution instead of unstable file paths
2. **Auto-generated resolver modules**: The CLI creates resolver modules that provide reliable asset paths
3. **Multi-strategy fallback**: Falls back gracefully from resolver modules to built assets to development locations
4. **Works in bundled environments**: Doesn't rely on package.json files being available at runtime

The CLI enhancement generates small resolver modules alongside copied assets, enabling runtime code to reliably find assets without making assumptions about directory structure.

Migration example:
```ts
// Before
const migrationsDir = resolvePackagePath('@backstage/plugin-catalog-backend', 'migrations');

// After  
const migrationsDir = resolvePackageAssets('@backstage/plugin-catalog-backend', 'migrations');
```