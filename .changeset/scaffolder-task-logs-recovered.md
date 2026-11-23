---
'@backstage/plugin-scaffolder-backend': patch
---

The `get-scaffolder-task-logs` action no longer fails its own output validation for a task that went through task recovery. The `recovered` event carries no `message`, so the field is now optional in the action's output schema.
