# Catalog Backend Module for OpenAPI specifications

This is an extension module to the plugin-catalog-backend plugin, providing extensions targeted at OpenAPI specifications.

With this you can split your OpenAPI definition into multiple files and reference them. They will be bundled, using an UrlReader, during processing and stored as a single specification.

## Installation

### Install the package

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-openapi
```

### Adding the plugin to your `packages/backend`

The processor can be added by importing `OpenApiRefProcessor` in `src/plugins/catalog.ts` in your `backend` package and adding the following.

```ts
builder.addProcessor(
  OpenApiRefProcessor.fromConfig(env.config, {
    logger: env.logger,
    reader: env.reader,
  }),
);
```
