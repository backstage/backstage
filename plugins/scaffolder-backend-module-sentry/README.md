# Sentry Scaffolder Actions

The `@backstage/plugin-scaffolder-backend-module-sentry` package adds actions
for creating Sentry projects and retrieving a project's public DSN from
Software Templates.

## Installation

From your Backstage root directory, install the package:

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-sentry
```

Add both the Scaffolder and Sentry modules to your backend in
`packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-sentry'));
backend.start();
```

## Documentation

See the [Sentry Scaffolder Actions guide](https://backstage.io/docs/features/software-templates/sentry)
for configuration, a template example, and the action input and output
reference.
