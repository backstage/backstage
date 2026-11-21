---
'@backstage/backend-dynamic-feature-service': patch
---

The `/remotes` endpoint now also lists the module federation remotes that the Backstage CLI builds for the packages of the app when `app.experimental.deferredPackages` is enabled, and serves their assets. They are read from the `dist/remotes` folder of the app package that is named by `app.packageName`, each time the remotes are listed, so that the app can be built or started after the backend. A dynamic frontend plugin takes precedence over an app remote for the same package.
