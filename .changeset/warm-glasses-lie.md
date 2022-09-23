---
'@backstage/plugin-scaffolder-backend': minor
---

Remove deprecation of `projectid` in template action `publish:gitlab:merge-request`, since it makes it easier to publish to repositories instead of writing the full path to the project, but will still allow people to not use the `projectid` and use the `repoUrl` instead.
