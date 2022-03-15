---
'@backstage/codemods': patch
---

Inlined the table of symbols used by the `core-imports` codemod so that future updates to the core packages don't break the codemod. An entry for has also been added to direct imports of `createApp` to `@backstage/app-defaults`.
