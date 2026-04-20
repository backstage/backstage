---
title: Config-Driven Extension Creation
status: provisional
authors:
  - '@sarabadu'
owners:
project-areas:
  - core
creation-date: 2026-04-20
---

# BEP: Config-Driven Extension Creation

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
  - [Feature 1: Create extensions from blueprints via config](#feature-1-create-extensions-from-blueprints-via-config)
  - [Feature 2: Clone existing extensions via config](#feature-2-clone-existing-extensions-via-config)
- [Design Details](#design-details)
  - [Blueprint registration](#blueprint-registration)
  - [Extension resolution order](#extension-resolution-order)
  - [Clone mechanics](#clone-mechanics)
  - [Config parameter: `from`](#config-parameter-from)
  - [Nav item path resolution for cloned pages](#nav-item-path-resolution-for-cloned-pages)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

This proposal introduces two mechanisms to create frontend extensions purely from `app-config.yaml`, without writing code:

1. **Blueprint-from-config**: Reference a blueprint's `kind` in the extension ID. If a matching blueprint is registered in the owning plugin, a new extension is created using the blueprint's `defaultParams`.

2. **Clone-from-config**: Use a `from:` field to clone an existing extension with a new ID, optionally overriding `attachTo` and `config`.

Both features are additive. Existing config behavior is unchanged. Extension IDs that match existing extensions continue to work as config overrides.

## Motivation

Some times we find the some usage for using the same extension with different configurations, for example https://github.com/backstage/backstage/issues/33342.
Some possible simple extensions like "catalog column" could easily have a blueprint to generate more columns, would be really nice to be able to skip the code part when the extension could have a "default" where the only thing that changes is the configuration. see https://github.com/backstage/backstage/pull/32588#issuecomment-4163468952

### Goals

- Allow creating new extension instances from registered blueprints using only `app-config.yaml`.
- Allow cloning existing extensions with different config, attachment points, and IDs using only `app-config.yaml`.
- Promote the creation of more generic reusable blueprints sharing a common visual and behavioral contract, with config-driven variations.

### Non-Goals

- Runtime extension creation (all extensions are still resolved at app startup).
- Auto-cloning child extensions tree when cloning a parent the clone or creation of child extension need to be wired up manually.

## Proposal

### Feature 1: Create extensions from blueprints via config

When `app.extensions` references an extension ID that doesn't exist in code, the system parses the ID into `kind:namespace/name` and looks for a registered blueprint with matching `kind` in the plugin that owns the `namespace`. If found, a new extension is created using the blueprint's `defaultParams`.

**Example: Creating an entity icon link from config**

The `EntityIconLinkBlueprint` is registered in the catalog plugin with `defaultParams`:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-icon-link:catalog/dashboard:
        config:
          label: Dashboard
          icon: dashboard
          href: https://grafana.example.com/d/{{metadata.name}}
```

No code needed. The extension ID `entity-icon-link:catalog/dashboard` is parsed as:

- `kind`: `entity-icon-link` → matches the blueprint
- `namespace`: `catalog` → identifies the owning plugin
- `name`: `dashboard` → names the new instance

The blueprint's `defaultParams` provide sensible defaults. The config schema defines what adopters can customize.

### Feature 2: Clone existing extensions via config

The `from:` field creates a copy of an existing extension with a new ID. The clone shares the same factory, inputs, outputs, and config schema. `attachTo` and `config` can be overridden.

**Example: Creating a "Teams" page by cloning the catalog page**

```yaml
# app-config.yaml
app:
  extensions:
    # Clone the catalog page
    - page:catalog/teams:
        from: page:catalog
        config:
          path: /teams
          title: Teams

    # Clone filters and attach them to the new page
    - catalog-filter:catalog/kind-for-teams:
        from: catalog-filter:catalog/kind
        attachTo: { id: 'page:catalog/teams', input: 'filters' }
        config:
          initialFilter: group

    - catalog-filter:catalog/type-for-teams:
        from: catalog-filter:catalog/type
        attachTo: { id: 'page:catalog/teams', input: 'filters' }

    - catalog-filter:catalog/list-for-teams:
        from: catalog-filter:catalog/list
        attachTo: { id: 'page:catalog/teams', input: 'filters' }
        config:
          initialFilter: all
```

This creates a fully functional `/teams` page with a sidebar nav entry, filtered to show only groups — all without writing a single line of code.

## Design Details

### Blueprint registration

Blueprints opt in to config-driven creation by providing `defaultParams` in `createExtensionBlueprint`:

```ts
export const EntityIconLinkBlueprint = createExtensionBlueprint({
  kind: 'entity-icon-link',
  attachTo: { id: 'entity-card:catalog/about', input: 'iconLinks' },
  output: [
    /* ... */
  ],
  defaultParams: {
    useProps: () => ({}),
  },
  config: {
    schema: {
      label: z => z.string().optional(),
      href: z => z.string().optional(),
      icon: z => z.string().optional(),
    },
  },
  *factory(params, { config }) {
    // ...
  },
});
```

Plugins register blueprints via the `blueprints` option in `createFrontendPlugin`:

```ts
createFrontendPlugin({
  pluginId: 'catalog',
  extensions: [
    /* ... */
  ],
  blueprints: [EntityIconLinkBlueprint],
});
```

The `ExtensionBlueprint` interface gains:

| Property                   | Type                                       | Description                                                              |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `defaultParams`            | `T['params'] \| undefined`                 | Default params for config-driven creation. `undefined` if not supported. |
| `makeFromConfig({ name })` | `(args) => OverridableExtensionDefinition` | Creates an extension using `defaultParams`. Internal.                    |

The `InternalFrontendPlugin` type gains a `blueprints: ExtensionBlueprint[]` field.

### Extension resolution order

During `resolveAppNodeSpecs`, each config entry is processed in order:

```
for each config entry with id:
  1. if extension with that id exists → apply config overrides (existing behavior)
  2. else if `from:` is set         → clone the source extension with the new id
  3. else                            → try to create from a matching blueprint
  4. else                            → report error
```

This preserves backward compatibility. Steps 2 and 3 are the new additions.

### Clone mechanics

`tryCloneExtension` creates a shallow copy of the source extension's internal representation with a new ID:

```ts
const clonedExtension = {
  ...source.extension,
  id: extensionId,
  attachTo: overrideParam.attachTo ?? source.extension.attachTo,
  disabled: overrideParam.disabled ?? source.extension.disabled,
};
```

The clone shares the same factory function, inputs, outputs, and config schema. Only `id`, `attachTo`, `disabled`, and `config` can differ.

Children are **not** auto-cloned. Each child extension that should exist under the cloned parent must be explicitly declared in config with its own `from:` entry and `attachTo` pointing to the new parent.

### Config parameter: `from`

The `ExtensionParameters` interface gains:

```ts
export interface ExtensionParameters {
  id: string;
  from?: string; // ← new
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  config?: unknown;
}
```

`from` must be a string matching the ID of an existing extension. It is mutually exclusive with blueprint-from-config (if `from` is set, blueprint lookup is skipped).

### Nav item path resolution for cloned pages

> NOTE: please help not really sure if this vibe solution could cause other issues :pepe-think:

Cloned pages share the same `routeRef` object as the source page. Since the nav system resolves hrefs via `routeResolutionApi.resolve(routeRef)` using object identity, both the original and cloned page would resolve to the same path.

The fix: nav items now prefer `coreExtensionData.routePath` from the page node's output data (which reflects config overrides like `path: /teams`) over routeRef resolution:

```ts
const routePath = node.instance.getData(coreExtensionData.routePath);
const to = routePath ?? tryResolveLink(routeResolutionApi, routeRef);
```

This ensures cloned pages with a custom `path` config get the correct nav item href.

## Release Plan

Both features are additive and backward-compatible. No existing APIs are broken.

1. **Phase 1**: Ship `defaultParams`, `makeFromConfig`, and `blueprints` registration behind the existing extension system. No blueprint ships with `defaultParams` by default — this is opt-in per blueprint.

2. **Phase 2**: Ship `from:` clone support in `resolveAppNodeSpecs` and the `from` field in `ExtensionParameters`.

3. **Phase 3**: Add `defaultParams` to selected core blueprints (e.g. `EntityIconLinkBlueprint`, `CatalogFilterBlueprint`) to enable config-driven creation for common use cases.

## Dependencies

- New frontend system (`@backstage/frontend-plugin-api`, `@backstage/frontend-app-api`).
- Extension ID format: `kind:plugin/name`.
- `resolveAppNodeSpecs` as the single place where all extension specs are collected before tree construction.

## Alternatives

TBD
