# scaffolder-backend-module-cookiecutter

The `@backstage/plugin-scaffolder-backend-module-cookiecutter` package adds the
`fetch:cookiecutter` action to the Scaffolder backend.

## Installation

From your Backstage root directory, install the package in your backend:

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-cookiecutter
```

Then register it in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-cookiecutter'));
```

See the [Cookiecutter Scaffolder action documentation](https://backstage.io/docs/features/software-templates/cookiecutter)
for prerequisites, configuration, and usage.
