# @backstage/plugin-scaffolder-backend-module-confluence-to-markdown

This module provides the `confluence:transform:markdown` Software Templates
action, which converts Confluence pages to Markdown, downloads attachments, and
updates MkDocs navigation in an existing GitHub repository.

## Installation

```shell
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-confluence-to-markdown
```

Add the module alongside the scaffolder plugin in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-confluence-to-markdown'),
);
```

## Documentation

See the [Confluence to Markdown guide](https://backstage.io/docs/features/software-templates/confluence-to-markdown)
for configuration, authentication methods, an example template, and action inputs
and outputs.
