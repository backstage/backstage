---
'@backstage/repo-tools': patch
---

`backstage-repo-tools repo schema openapi validate` no longer fails with an `ERR_UNSUPPORTED_DIR_IMPORT` error on Node.js 24 and 26 in projects that install `@backstage/repo-tools` as a dependency. The command now reads the `spec` from the generated `router.ts` file without loading it with Node.js, so it no longer needs a TypeScript transform or the router's runtime dependencies. Its errors now name the schema file that was checked and explain how to regenerate it.
