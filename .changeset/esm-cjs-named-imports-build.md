---
'@backstage/cli-module-build': patch
---

Built Node.js packages with ES module output, such as packages with `"type": "module"` or `.mts` source files, now support named imports from CommonJS packages whose exports Node.js can't detect, such as `import { get } from 'lodash'`. Previously these imports failed at runtime with a "Named export not found" error. Named imports and re-exports of packages are rewritten to fall back to the default export when the named export is missing. Browser ESM output is unchanged.
