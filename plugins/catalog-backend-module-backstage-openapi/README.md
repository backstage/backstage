# catalog-backend-module-backstage-openapi

## Summary

This module installs an entity provider that exports a single entity, your Backstage instance documentation, which merges as many backend plugins as you have defined in the config value `catalog.providers.backstageOpenapi.plugins`.

## Notes

- **This only works with the new backend system.**

## Installation

To your new backend file, add:

```ts title="packages/backend/src/index.ts"
backend.add(
  import('@backstage/plugin-catalog-backend-module-backstage-openapi'),
);
```

Add a list of plugins and optional entity overrides to your config. For example:

```yaml title="app-config.yaml"
catalog:
  providers:
    backstageOpenapi:
      plugins:
        - catalog
        - events
        - search
      definitionFormat: 'yaml' # Optional, defaults to 'json'
      entityOverrides: # All optional
        metadata:
          name: 'my-name'
          title: 'my title'
        spec:
          owner: 'my-team'
```

We will attempt to load each plugin's OpenAPI spec hosted at `${pluginRoute}/openapi.json`. These are automatically added if you are using `@backstage/backend-openapi-utils`'s `createValidatedOpenApiRouter`.

## OpenAPI spec conventions for plugin authors

The merged `backstage-api` entity is produced by [`openapi-merge`](https://github.com/robertmassaioli/openapi-merge). To keep the merged document internally consistent, plugins contributing specs should follow a few conventions.

### Declare `security` per operation, not at the document level

Prefer declaring `security` on each operation rather than setting a document-level default. The document-level `security` field is a first-wins pick during the merge: if more than one plugin sets it, only the first one's default survives, and the others are discarded along with any schemes they introduced solely for that default. Declaring auth per-operation keeps the semantics explicit and travels with the operation into the merged document unchanged.

### Use a consistent `securitySchemes` name across plugins

`components.securitySchemes` is merged across inputs, and this module runs the merge with `securitySchemesStrategy: 'error'`. That means two plugins defining the same scheme name with identical shapes will collapse into one entry (expected), two plugins defining different scheme names will keep both, but two plugins defining the same name with different shapes will fail the merge at startup rather than silently rename one.

The standard Backstage backend plugins currently use `JWT` as the scheme name for the backend's bearer token. New backend plugins that want their operations to require that token should reuse the `JWT` name and shape rather than inventing a new one. Picking a different name is allowed, but it only makes sense when the scheme represents a genuinely different auth concept.

### Why `securitySchemesStrategy: 'error'`?

`openapi-merge@2`'s default strategy is `merge`, which silently renames conflicting definitions via a dispute prefix. That keeps the aggregator producing _some_ output on conflict, at the cost of operations ending up referencing a scheme name that doesn't match what the plugin wrote. For the `backstage-api` entity, which is consumed by SDK generators, scanners, and the API docs widget, failing loudly at startup is preferable to shipping a quietly-wrong spec — hence `error`. See [issue #36081](https://github.com/backstage/backstage/issues/36081) for the discussion that motivated this choice.
