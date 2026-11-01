---
'@backstage/cli': patch
'@backstage/cli-module-build': patch
'@backstage/cli-node': patch
---

Switched the compilation target to ES2024, which all supported Node.js versions fully support. Package builds, app bundles, and the backend development server now compile code for ES2024, and the TypeScript `target` and `lib` options in `@backstage/cli/config/tsconfig.json` are set to `ES2024`. This requires TypeScript 5.9 or later, which is now the oldest supported version according to the [versioning policy](https://backstage.io/docs/overview/versioning-policy#typescript-releases).

The `lib` change allows code to use ES2024 built-in APIs such as `Object.groupBy` and `Promise.withResolvers`. Backstage doesn't include polyfills, so frontend code that uses these APIs needs at least Chrome or Edge 119, Firefox 121, or Safari 17.4.
