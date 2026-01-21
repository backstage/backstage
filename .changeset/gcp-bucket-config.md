---
'@backstage/plugin-scaffolder-backend-module-gcp': patch
---

Added new config path `scaffolder.taskRecovery.gcsBucket.name` for GCS workspace provider. The previous `EXPERIMENTAL_workspaceSerializationGcpBucketName` config is still supported as a fallback.
