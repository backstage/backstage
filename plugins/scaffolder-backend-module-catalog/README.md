# @backstage/plugin-scaffolder-backend-module-catalog

The catalog module for [@backstage/plugin-scaffolder-backend](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend).

This plugin provides a set of actions that allow you to interact with the catalog, including querying, fetching, and
validating entities.

## Getting started

The following sections will help you getting started

### Configure Actions in Backend

From your Backstage root directory run:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-catalog
```

Then ensure that both the scaffolder, catalog and this module are added to your backend:

```typescript
// In packages/backend/src/index.ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-catalog'));
```
