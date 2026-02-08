# @backstage/plugin-catalog-backend-module-codeowners

This module will add a processor that will look in the `CODEOWNERS` file to determine the correct value to apply to the `spec.owner` file for you API, Component, Domain, Resource, System entities.

## Setup

Here's how to get the module up and running:

1. First we need to add the `@backstage/plugin-catalog-backend-module-codeowners` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-codeowners
   ```

2. Then add the plugin to your backend index file:

   ```ts
   // In packages/backend/src/index.ts
   const backend = createBackend();
   // ... other feature additions
   backend.add(import('@backstage/plugin-catalog-backend'));
   backend.add(import('@backstage/plugin-catalog-backend-module-codeowners'));
   ```

3. Now run `yarn start` from the repo root

Once catalog process has ran you should see the Owners match what is in their respective `CODEOWNERS` file.
