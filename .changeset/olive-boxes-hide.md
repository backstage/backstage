---
'@backstage/backend-plugin-api': minor
'@backstage/backend-test-utils': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/backend-defaults': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-scaffolder-node': minor
---

feat: add auditor to `coreServices`

This change introduces a new `auditor` service to the `coreServices` in Backstage.
The auditor service enables plugins to emit audit events for security-relevant actions.
