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

#### **openApiPlaceholderResolver**

The placeholder resolver can be added by importing `openApiPlaceholderResolver` in `src/plugins/catalog.ts` in your `backend` package and adding the following.

```ts
builder.setPlaceholderResolver('openapi', openApiPlaceholderResolver);
```

This allows you to use the `$openapi` placeholder when referencing your OpenAPI specification. This will then resolve all `$ref` instances in your specification.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: example
  description: Example API
spec:
  type: openapi
  lifecycle: production
  owner: team
  definition:
    $openapi: ./spec/openapi.yaml # by using $openapi Backstage will now resolve all $ref instances
```

#### **OpenAPIRefProcessor** (deprecated)

The processor can be added by importing `OpenApiRefProcessor` in `src/plugins/catalog.ts` in your `backend` package and adding the following.

```ts
builder.addProcessor(
  OpenApiRefProcessor.fromConfig(env.config, {
    logger: env.logger,
    reader: env.reader,
  }),
);
```
