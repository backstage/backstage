---
'@backstage/cli': patch
---

The shared ESLint configuration now reports unused imports in `config.d.ts` configuration schema files. These declaration files are not covered by the TypeScript compiler's unused-variable checks, which previously allowed a stray import to slip through. Such an import can resolve during local development but break configuration schema loading for consumers of the published package, so it is now caught at lint time.
