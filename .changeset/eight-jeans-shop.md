---
'@backstage/frontend-plugin-api': minor
'@backstage/frontend-defaults': minor
'@backstage/frontend-app-api': patch
---

Introduced a `createFrontendFeatureLoader()` function, as well as a `FrontendFeatureLoader` interface, to gather several frontend plugins, modules or feature loaders in a single exported entrypoint and load them, possibly asynchronously. This new feature, very similar to the `createBackendFeatureLoader()` already available on the backend, supersedes the previous `CreateAppFeatureLoader` type which has been deprecated.
