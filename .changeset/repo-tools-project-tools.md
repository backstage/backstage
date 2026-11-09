---
'@backstage/repo-tools': patch
---

The package no longer declares any peer dependencies. Instead, the commands that need TypeScript or TypeDoc now always use the versions installed in your project root. If a command needs one of them and it isn't installed there, it now fails with an error that tells you to add it to your root `package.json`. A warning is printed if the installed version is outside the supported range, which is `> 3.0.0` for TypeScript and `^0.28.0` for TypeDoc.
