# Catalog Backend Module to resolve $refs in yaml documents

This is an extension module to the Catalog backend, providing extensions to resolve $refs in yaml documents.

With this you can split your yaml documents into multiple files and reference them. They will be bundled, using an UrlReader, during processing and stored as a single specification.

This is useful for OpenAPI and AsyncAPI specifications.

## Installation

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-openapi
```

### Adding the plugin to your `packages/backend`

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-openapi'));
```

This will add the `jsonSchemaRefPlaceholderResolver` for
the placeholder resolver keys `asyncapi` and `openapi`.

This allows you to use the `$openapi` placeholder when referencing your OpenAPI specification and `$asyncapi` when referencing your AsyncAPI specifications. This will then resolve all `$ref` instances in your specification.

You can also use this resolver for other kind of yaml files to resolve $ref pointer.

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

### Adding the plugin to your `packages/backend` (old backend system)

#### **jsonSchemaRefPlaceholderResolver**

The placeholder resolver can be added by importing `jsonSchemaRefPlaceholderResolver` in `src/plugins/catalog.ts` in your `backend` package and adding the following.

```ts
builder.setPlaceholderResolver('openapi', jsonSchemaRefPlaceholderResolver);
builder.setPlaceholderResolver('asyncapi', jsonSchemaRefPlaceholderResolver);
```

This allows you to use the `$openapi` placeholder when referencing your OpenAPI specification and `$asyncapi` when referencing your AsyncAPI specifications. This will then resolve all `$ref` instances in your specification.

You can also use this resolver for other kind of yaml files to resolve $ref pointer.

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
