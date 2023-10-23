# catalog-backend-module-backstage-openapi

## Summary

This module installs an entity provider that exports a single entity, your Backstage instance documentation, which merges as many backend plugins as you have defined in the config value `catalog.providers.openapi.plugins`.

## Notes

- **This only works with the new backend system.**

## Installation

To your new backend file, add

```ts title="packages/backend/src/index.ts"
backend.add(
  import('@backstage/plugin-catalog-backend-module-backstage-openapi'),
);
```

Add a list of plugins to your config like,

```yaml title="app-config.yaml"
catalog:
  providers:
    openapi:
      plugins:
        - catalog
        - todo
        - search
```

We will attempt to load each plugin's OpenAPI spec hosted at `${pluginRoute}/openapi.json`. These are automatically added if you are using `@backstage/backend-openapi-utils`'s `createValidatedOpenApiRouter`.
