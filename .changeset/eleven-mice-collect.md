---
'@backstage/plugin-scaffolder-backend': minor
---

Added a new `/v2/dry-run` endpoint that allows for a synchronous dry run of a provided template. A `supportsDryRun` option has been added to `createTemplateAction`, which signals whether the action should be executed during dry runs. When enabled, the action context will have the new `isDryRun` property set to signal if the action is being executed during a dry run.
