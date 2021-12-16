---
'@backstage/core-app-api': minor
---

- Removed deprecated definition `createApp` from `@backstage/core-app-api` which has been replaced by `@backstage/app-defaults#createApp`
- Removed deprecated type `BackstagePluginWithAnyOutput`
- Removed deprecated constructors for `GithubAuth`, `OAuth2`, and `SamlAuth` as the `create` method should be used instead
