---
'@backstage/cli-module-new': patch
---

The `frontend-plugin` template now declares package info: the generated `package.json` exports `./package.json`, and the plugin passes `info: { packageJson: () => import('../package.json') }` to `createFrontendPlugin`.
