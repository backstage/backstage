---
'@backstage/repo-tools': patch
---

Added `skipLibCheck` parameter to `generateTypeDeclarations` while preserving the default value `false`. This allows plugins that use the `--skipLibCheck` in their `tsconfig.json` to generate type declarations.
