# scaffolder-backend-module-gitlab

This module for the Backstage scaffolder backend provides actions that work
with GitLab, such as publishing new projects, opening merge requests, managing
groups, issues, tokens, and CI/CD variables, and triggering pipelines.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitlab
```

Then register the module in your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
```

## Documentation

See [GitLab Scaffolder Actions](https://backstage.io/docs/integrations/gitlab/scaffolder)
for configuration, example templates, and the list of available actions.
