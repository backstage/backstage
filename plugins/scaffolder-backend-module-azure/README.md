# @backstage/plugin-scaffolder-backend-module-azure

The Azure DevOps module for [@backstage/plugin-scaffolder-backend](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend).

This module provides the `publish:azure` action, which publishes the content
of a scaffolder workspace to a new repository in Azure DevOps.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-azure
```

Then add it to your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend-module-azure'));
```

## Documentation

See [Azure DevOps Scaffolder Actions](https://backstage.io/docs/integrations/azure/scaffolder)
for configuration, an example template, and the full list of action inputs and
outputs.
