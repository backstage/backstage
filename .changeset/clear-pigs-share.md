---
'@backstage/plugin-catalog-backend-module-github': minor
---

**BREAKING**: Explicitly rejects branch names containing a slash character.

The module now rejects any configuration that contains slashes in branch names. The reason for this is that the ingestion will run into downstream problems if they were let through. If you had configuration with a slash in the branch name in `filters.branch`, your application may fail to start up.

If you are affected by this, please move over to using branches that do not have slashes in them.
