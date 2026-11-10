---
'@backstage/plugin-scaffolder-common': major
---

**BREAKING**: Adds `waiting` to the stable `ScaffolderTaskStatus` type. Update
exhaustive task status switches and mappings to handle the new status.

Adds a manual task resume client endpoint and a task resume permission.
