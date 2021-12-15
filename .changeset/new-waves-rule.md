---
'@backstage/core-app-api': patch
---

- Remove deprecated `@backstage/core-app-api@createApp` which has been replaced by `@backstage/app-defaults#createApp`
- Remove deprecated type `BackstagePluginWithAnyOutput`
- Remove deprecated constructors for `GithubAuth`, `OAuth2`, and `SamlAuth` as the `create` method should be used instead
