---
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-backend': patch
---

TechDocs now removes the source it downloads for `dir:` references once a build finishes. Previously these were left behind in `backend.workingDirectory` after every build of an entity registered from a URL location. Preparers can now return `shouldCleanPreparedDirectory` on `PreparerResponse` to decide this per build; when it is not set, `PreparerBase.shouldCleanPreparedDirectory()` is used as before.
