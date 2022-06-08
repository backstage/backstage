---
'@backstage/plugin-scaffolder-backend': minor
---

refactored the gitlab publish merge request action to not use the `projectId` property. Instead use the `host` and `owner` property from the `RepoUrlPicker`. This decreases the amount of fields the user has to fill in.
