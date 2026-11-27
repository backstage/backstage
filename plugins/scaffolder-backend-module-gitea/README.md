# scaffolder-backend-module-gitea

This module for the Backstage scaffolder backend provides the `publish:gitea`
action, which publishes the content of a scaffolder workspace to a new
repository on a Gitea instance.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitea
```

Then register the module in your backend:

```typescript
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitea'));
```

## Documentation

See [Gitea Scaffolder Actions](https://backstage.io/docs/integrations/gitea/scaffolder)
for configuration, an example template, and the full list of action inputs and
outputs.
