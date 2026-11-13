---
'@backstage/plugin-scaffolder-backend': minor
---

The `GET /v2/tasks` endpoint now supports filtering tasks by the template they were created from with the `templateRef` query parameter, and by creation time with the `createdAfter` and `createdBefore` query parameters. Tasks can also be ordered by `template_ref`. A database migration adds an indexed column for the template of each task and fills it in for existing tasks.
