---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node': patch
'@backstage/plugin-scaffolder-backend-module-workspace-database': minor
---

Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step. Secrets are now preserved until task completion. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks.

Workspace serialization for task recovery now requires installing a separate workspace provider module. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (5MB limit, not recommended for production). For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or similar external storage provider.
