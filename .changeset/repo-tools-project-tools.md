---
'@backstage/repo-tools': patch
---

The package no longer declares any peer dependencies. Instead, the commands that need TypeScript, Prettier or TypeDoc now always use the versions installed in your project root. If a command needs TypeScript or TypeDoc and it isn't installed there, it now fails with an error that tells you to add it to your root `package.json`. Prettier is still optional, and formatting is skipped when it isn't installed. A warning is printed if the installed version is outside the supported range, which is `> 3.0.0` for TypeScript, `^2.8.1 || ^3.8.1` for Prettier and `^0.28.0` for TypeDoc.
