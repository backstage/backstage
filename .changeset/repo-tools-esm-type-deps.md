---
'@backstage/repo-tools': patch
---

The type-deps check no longer reports ESM-only dependencies as missing: packages whose exports expose no `require` or `default` condition cannot be seen by `require.resolve`, so installed dependencies were reported as missing. The check now falls back to asking TypeScript itself to resolve the specifier, accepting it only when it resolves to type declarations inside the repository. Declarations are also collected through the TypeScript parser rather than line-based matching, so re-exports, `import()` type references and ambient module declarations are now checked too.
