# DevTools Backend

Welcome to the DevTools backend plugin! This plugin provides data for the [DevTools frontend](../devtools/) features.

## Setup

Here's how to get the DevTools Backend up and running in the new backend system:

1. First we need to add the `@backstage/plugin-devtools-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-devtools-backend
   ```

2. Then add the plugin to your backend index file:

   ```ts
   // In packages/backend/src/index.ts
   const backend = createBackend();
   // ... other feature additions
   backend.add(import('@backstage/plugin-devtools-backend'));
   ```

3. Now run `yarn start-backend` from the repo root
4. Finally open `http://localhost:7007/api/devtools/health` in a browser and it should return `{"status":"ok"}`

## Actions

The plugin registers the following read-only actions with the actions registry. This makes them available to MCP clients and other action consumers. Each action checks the same permission as the matching DevTools page.

| Action                | Description                                                                                                                                                                     | Permission                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `get-config`          | Returns the backend configuration, with secret values replaced by `<secret>`. Accepts an optional dot-separated `path`, such as `catalog.locations`, to return only part of it. | `devtools.config.read`    |
| `get-info`            | Returns the operating system, resource usage, Node.js version, Backstage version, and installed package versions.                                                               | `devtools.info.read`      |
| `get-scheduled-tasks` | Returns the scheduled tasks for the given `pluginIds`, or for the plugins listed in `devTools.scheduledTasks.plugins` if none are given.                                        | `devtools.scheduler.read` |

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/devtools)
- [The Backstage homepage](https://backstage.io)
