---
'@backstage/backend-plugin-api': minor
---

Add `resolvePackageAssets` function as a portable alternative to `resolvePackagePath`.

This new function provides automatic asset resolution without requiring package names or relying on unstable `__dirname` paths. It uses stack trace analysis to detect the calling file and automatically resolves assets relative to the package root.

Key improvements:
1. **No package names required**: Automatically detects the calling package
2. **No dependency on `__dirname`**: Uses stack traces for reliable caller detection
3. **Works in bundled environments**: Stack traces remain stable across deployment scenarios  
4. **Multi-location fallback**: Checks dist folder, package root, and development locations
5. **Better error messages**: Returns meaningful paths even for missing assets

The function eliminates the need to know or pass package names while providing more reliable asset resolution than manual path construction.

Migration example:
```ts
// Before
const migrationsDir = resolvePackagePath('@backstage/plugin-catalog-backend', 'migrations');

// After (from within catalog-backend package)
const migrationsDir = resolvePackageAssets('migrations');
```