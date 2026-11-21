---
'@backstage/cli-module-build': patch
'@backstage/frontend-app-api': patch
---

Added an experimental `app.experimental.deferredPackages` option. When it is enabled together with `app.packages`, the discovered packages whose plugins can be deferred are left out of the app bundle. Instead, they are built as module federation remotes into the `dist/remotes` folder of the app when the app is built or started, and the dynamic features backend serves them from its `/remotes` endpoint, so that the app loads them the first time one of their pages or elements is rendered. This requires the `dynamicFrontendFeaturesLoader` in the app and `app.experimental.deferredRemotes`. Plugins in the workspace of the app are analyzed from source, while plugins installed from npm must include the `dist/backstage-manifest.json` file that is written when they are packed for publishing. Set the option to `true`, or to an object with an `exclude` list of package names that are always bundled with the app. The CLI prints which packages are built as remotes and why the others are not.
