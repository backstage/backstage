---
'@backstage/plugin-scaffolder-backend': minor
---

- The GitLab Project ID for the `publish:gitlab:merge-request` action is now passed through the query parameter `project` in the `repoUrl`. It still allows people to not use the `projectid` and use the `repoUrl` with the `owner` and `repo` query parameters instead. This makes it easier to publish to repositories instead of writing the full path to the project.
