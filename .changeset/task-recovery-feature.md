---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node': patch
'@backstage/plugin-scaffolder-backend-module-workspace-database': minor
---

Added task recovery feature with new `scaffolder.taskRecovery` config section. When enabled, tasks that crash or timeout are automatically recovered and resume from the last completed step, task secrets are retained until the task reaches a terminal state so recovery can continue, and completed step outputs are persisted. When recovery is disabled (the default), the previous behavior is unchanged: secrets are cleared as soon as a task is claimed and retries re-run every step. The new config consolidates previous experimental flags (`EXPERIMENTAL_recoverTasks`, `EXPERIMENTAL_workspaceSerialization`, `EXPERIMENTAL_recoverTasksTimeout`) which remain supported as fallbacks.

Workspace serialization for task recovery now requires installing a separate workspace provider module. For development, use `@backstage/plugin-scaffolder-backend-module-workspace-database` (5MB limit, not recommended for production). For production, use `@backstage/plugin-scaffolder-backend-module-gcp` or similar external storage provider.

Enabling crash recovery does not keep completed task event streams open; normal task completion remains terminal for event-stream clients.
