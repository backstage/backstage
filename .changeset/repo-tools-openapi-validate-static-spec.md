---
'@backstage/repo-tools': patch
---

`backstage-repo-tools repo schema openapi validate` now reads the `spec` from the generated `router.ts` file without loading it with Node.js. Previously, in projects that install `@backstage/repo-tools` as a dependency, the command failed unless a TypeScript transform was loaded first, with an `ERR_UNSUPPORTED_DIR_IMPORT` error on Node.js 22.18 and later. The command no longer needs a TypeScript transform or the router's runtime dependencies.
