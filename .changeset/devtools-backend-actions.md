---
'@backstage/plugin-devtools-backend': patch
---

Added read-only actions to the actions registry, each requiring the same permission as its DevTools page:

- `get-config` returns the sanitized backend configuration and requires `devtools.config.read`. Pass an optional `path`, such as `catalog.locations`, to return only part of it.
- `get-info` returns the runtime details shown on the Info page, such as Node.js, Backstage, and package versions. It requires `devtools.info.read`.
- `get-scheduled-tasks` returns the scheduled tasks for the given plugins, or for the plugins listed in `devTools.scheduledTasks.plugins`. It requires `devtools.scheduler.read`.
