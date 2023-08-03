---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder-node': patch
---

Deprecated `executeShellCommand`, `RunCommandOptions`, and `fetchContents` from `@backstage/plugin-scaffolder-backend`, since they are useful for Scaffolder modules (who should not be importing from the plugin package itself). You should now import these from `@backstage/plugin-scaffolder-backend-node` instead. `RunCommandOptions` was renamed in the Node package as `ExecuteShellCommandOptions`, for consistency.
