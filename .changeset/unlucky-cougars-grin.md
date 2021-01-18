---
'@backstage/create-app': patch
---

Remove the `@types/helmet` dev dependency from the app template. This
dependency is now unused as the package `helmet` brings its own types.

To update your existing app, simply remove the `@types/helmet` dependency from
the `package.json` of your backend package.
