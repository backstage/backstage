---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': patch
---

Added the ability to support supplying secrets when creating tasks in the `scaffolder-backend`.

**deprecation**: Deprecated `ctx.token` from actions in the `scaffolder-backend`. Please move to using `ctx.secrets.backstageToken` instead.

**deprecation**: Deprecated `task.token` in `TaskSpec` in the `scaffolder-backend`. Please move to using `task.secrets.backstageToken` instead.
