---
'@backstage/core-app-api': patch
'@backstage/plugin-auth-backend': patch
---

Added support for using authenticating via GitHub Apps in addition to GitHub OAuth Apps. It used to be possible to use GitHub Apps, but they did not handle session refresh correctly.

Note that GitHub Apps handle OAuth scope at the app installation level, meaning that the `scope` parameter for `getAccessToken` has no effect. When calling `getAccessToken` in open source plugins, one should still include the appropriate scope, but also document in the plugin README what scopes are required in the case of GitHub Apps.

In addition, the `authHandler` and `signInResolver` options have been implemented for the GitHub provider in the auth backend.
