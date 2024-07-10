---
'@backstage/backend-app-api': patch
---

The ability to install backend features in callback form (`() => BackendFeature`) has been deprecated. This typically means that you need to update the installed features to use the latest version of `@backstage/backend-plugin-api`. If the feature is from a third-party package, please reach out to the package maintainer to update it.
