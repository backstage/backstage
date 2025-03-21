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

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/devtools)
- [The Backstage homepage](https://backstage.io)
