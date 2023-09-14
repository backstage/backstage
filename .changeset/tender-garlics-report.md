---
'@backstage/cli': patch
---

Removed the experimental `package fix` command that was used to automatically add dependencies to `package.json`, but has since been replaced by the `no-undeclared-imports` rule from `@backstage/eslint-plugin`.
