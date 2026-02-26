---
'@backstage/plugin-scaffolder-backend': minor
---

Adds new `list-scaffolder-tasks` action for MCP integration that allows querying existing scaffolder tasks, with optional filtering by ownership and other task metadata, and support for pagination when listing large task histories. This enables AI and other MCP clients to discover, inspect, and work with scaffolder task history for use cases such as debugging failed runs, auditing recent activity, and building tailored UX around previously executed templates.
