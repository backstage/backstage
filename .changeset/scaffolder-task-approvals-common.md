---
'@backstage/plugin-scaffolder-common': patch
---

Added `approval` field to `TaskStep` type for defining step-level approval gates in scaffolder templates. Added `waiting` status to `ScaffolderTaskStatus` for tasks paused at approval gates. Added `taskApprovePermission` for authorizing task approval actions.
