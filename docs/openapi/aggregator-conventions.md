---
id: aggregator-conventions
title: Contributing to the aggregated Backstage API
description: Conventions plugin authors should follow so their OpenAPI spec merges cleanly into the `backstage-api` catalog entity.
---

# Contributing to the aggregated Backstage API

`@backstage/plugin-catalog-backend-module-backstage-openapi` produces a single `API` catalog entity named `backstage-api` by merging the OpenAPI spec every installed backend plugin serves at `${pluginRoute}/openapi.json`. The merge is done by [`openapi-merge`](https://github.com/robertmassaioli/openapi-merge) in a scheduled refresh. On an error the entity simply stops updating until the inputs are fixed.

Follow the conventions below so your plugin's spec participates in that aggregate without surprises.

## Declare `security` per operation

Prefer declaring `security` on each operation instead of setting a document-level default.

Two things go wrong when plugins contribute a document-level `security` default:

1. The merged document has one document-level `security`, picked first-wins: only one plugin's default survives, and the others are discarded along with any schemes they introduced solely for that default.
2. The surviving default then applies to every operation in the merged document that doesn't declare its own `security`, including operations from other plugins. Your operations end up requiring whatever scheme the winning plugin picked (or, if the winning default is `security: []`, no auth at all), which is almost never what either plugin intended.

Declaring auth per operation keeps the semantics explicit, pins each operation's requirements to the operation itself, and travels unchanged into the merged document.

Good:

```yaml
paths:
  /entities:
    get:
      security:
        - JWT: []
      # ...
```

Avoid:

```yaml
security:
  - JWT: []
paths:
  /entities:
    get: ...
```

## Reuse the same `securitySchemes` name across plugins

`components.securitySchemes` is merged across inputs. The aggregator runs the merge with `securitySchemesStrategy: 'error'`:

- two plugins defining the same scheme name with identical shapes collapse to one entry (expected);
- two plugins defining different scheme names keep both;
- two plugins defining the same name with different shapes fail the next refresh, so the entity does not quietly end up with a renamed scheme no operation references.

The standard Backstage backend plugins use `JWT` as the scheme name for the backend's bearer token. New backend plugins that want their operations to require that token should reuse the `JWT` name and shape rather than invent a new one. Pick a different name only when the scheme represents a genuinely different auth concept.

A conflict is reported like this (with the plugin ids that defined the entry):

```
Conflicting `components.securitySchemes.JWT` definitions from plugins:
  plugin-a, plugin-b. Input 2: the security scheme 'JWT' is already
  defined differently by another input. (component-definition-conflict)
```

Note: this strict behaviour only applies to `components.securitySchemes`. Conflicts on other components (`components.schemas`, `components.parameters`, etc.) are resolved automatically by renaming the losing input's entry with that plugin's id as a prefix. For example, if `plugin-a` and `plugin-b` each declare `components.schemas.Config` with different shapes, the merged document ends up with `Config` from the first input and `plugin-b-Config` for the second, with any internal `$ref`s inside `plugin-b`'s spec rewritten to match. Operations referencing those schemas keep working. Security schemes are the exception because operations declare auth via `security: [{ JWT: [] }]` by bare scheme name, not via `$ref`, and `openapi-merge`'s dispute-prefix rewrite only touches `$ref` targets. If the losing scheme were silently renamed, operations referencing it by name would still point at the original name, which the merged document no longer declares.

## Keep your spec on OpenAPI 3.1

The merge is seeded on OpenAPI 3.1, which matches every Backstage plugin spec in this repository. `openapi-merge` refuses to merge mixed major.minor versions, so the aggregator filters inputs by version before merging:

- plugins declaring `openapi: 3.1.x` participate;
- plugins declaring any other version (3.0, 3.2, etc.) are skipped from the merge with an error log naming the plugin and its declared version.

A skipped plugin is logged like this (one line per skipped plugin per refresh):

```
Skipping plugin=my-plugin: its OpenAPI spec declares version 3.0.3 but
the aggregator merges on 3.1.x. Convert the spec to 3.1 to include it.
```

The aggregated entity still updates with whatever plugins remain, so one wrong-version plugin cannot block the rest. If your plugin is still on 3.0, `oasdiff upgrade spec.yaml` is a mechanical conversion. See [Getting started with OpenAPI in your Backstage plugins](./01-getting-started.md#technical-knowledge) for the two 3.0-to-3.1 shape changes to watch for.
