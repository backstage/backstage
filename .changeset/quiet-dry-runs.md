---
'@backstage/plugin-scaffolder-backend': minor
---

Applied `templateDryRunPermission` to inline Software Template dry runs and the corresponding backend action. Permission policies that deny unknown permissions must explicitly allow `scaffolder.template.dry-run` to retain existing dry-run access.
