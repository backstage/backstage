---
'@backstage/backend-plugin-api': minor
---

Add `resolveFromFile` as a portable alternative to `resolvePackagePath`

`resolveFromFile` is a new utility that provides a more portable way to resolve paths relative to the calling module. Unlike `resolvePackagePath`, which relies on package.json files being present, `resolveFromFile` works with both CommonJS (`__dirname`) and ES modules (`import.meta.url`) and doesn't break in bundled environments.

Example usage:
```ts
// ES modules
const assetsDir = resolveFromFile(import.meta.url, '../assets');

// CommonJS  
const assetsDir = resolveFromFile(__dirname, '../assets');
```

The existing `resolvePackagePath` function is now deprecated and should be migrated to use `resolveFromFile` where possible.