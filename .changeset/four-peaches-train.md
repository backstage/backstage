---
'@backstage/backend-defaults': patch
'@backstage/backend-plugin-api': patch
---

**BREAKING ALPHA**: The old `instanceMetadataService` has been removed from alpha. Please switch over to using the stable `coreServices.rootInstanceMetadata` and related types instead, available from `@backstage/backend-plugin-api`.
