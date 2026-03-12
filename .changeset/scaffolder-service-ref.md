---
'@backstage/plugin-scaffolder-node': patch
---

Added `scaffolderServiceRef` and `ScaffolderService` interface for backend plugins that need to interact with the scaffolder API using `BackstageCredentials` instead of raw tokens.
