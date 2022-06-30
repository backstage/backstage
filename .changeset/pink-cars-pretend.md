---
'@backstage/plugin-scaffolder-backend': patch
---

new setUserAsOwner flag for publish:gitlab action

The field default is `false`. When true it will use the token configured in the gitlab integration for the matching host, to try and set the user logged in via `repoUrlPicker` `requestUserCredentials` OAuth flow as owner of the repository created in GitLab.
