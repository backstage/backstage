---
id: catalog-model-layers
title: Catalog model layers
sidebar_label: Catalog model layers (alpha)
description: Declare and extend catalog entity kinds, relations, and metadata using catalog model layers
---

:::caution[Alpha feature]

Catalog model layers are an **alpha** feature. The APIs on this page come from the `/alpha` entry points of their packages and can change in breaking ways between releases. If you don't register any model sources, the catalog behaves as it always has.

:::

A _catalog model layer_ is a declarative description of part of the catalog model. Instead of writing a custom processor to validate a new kind and emit its relations, you describe the kind with JSON Schema and list which fields produce relations. The catalog then validates entities and emits relations based on that description.

A layer can contribute:

- Entity kinds, including multiple versions and per-`spec.type` variations
- Relation pairs, such as `ownedBy` and `ownerOf`
- Well-known annotations, labels, and tags

The catalog compiles all registered layers into one model, which it uses for validation, relation generation, and the model description it gives to AI agents.

## When to use model layers

Use model layers when you want to:

- Add a new entity kind with a schema, without writing a processor
- Add a new `spec.type` variant to an existing kind, with its own schema
- Change the schema or relation fields of a built-in kind
- Declare that a relation is valid between built-in kinds and your own kinds, so that the catalog emits the inverse relation
- Document the annotations, labels, and tags used in your organization in a machine-readable way

For background on extending the catalog with processors, see [Extending the model](extending-the-model.md).

## How it works

The feature has these parts:

| Piece                        | Package                                | Purpose                                                             |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `createCatalogModelLayer`    | `@backstage/catalog-model/alpha`       | Creates a layer using a builder                                     |
| `defaultCatalogEntityModel`  | `@backstage/catalog-model/alpha`       | The layer containing all built-in kinds, relations, and annotations |
| `CatalogModelSources`        | `@backstage/catalog-model/alpha`       | Helpers for creating model sources from layers                      |
| `catalogModelExtensionPoint` | `@backstage/plugin-catalog-node/alpha` | Lets backend modules add model sources to the catalog               |
| `provideStaticCatalogModel`  | `@backstage/plugin-catalog-node/alpha` | A ready-made backend module that registers static layers            |

At startup, the catalog backend reads all registered model sources and compiles their layers into one model. Once at least one model source is registered, processing changes as follows:

- A model-driven processor replaces the built-in kinds processor (`BuiltinKindsEntityProcessor`).
- The catalog validates each entity against the JSON Schema of the kind that matches its `kind`, `apiVersion`, and `spec.type`.
- The catalog generates relations from the relation fields declared on the kind. It emits an inverse relation only when a relation pair declares the source kind, target kind, and relation type.
- Your other processors still handle kinds that the model doesn't declare.

The catalog always includes the default model, so you only provide the layers you add on top of it.

:::note

Registering any model source, including one added by a plugin module you install, switches built-in kinds to model-based processing. If you rely on the catalog emitting inverse relations to custom kinds, see [Relations to custom kinds](#relations-to-custom-kinds).

:::

## Enabling model layers

To opt in, add `provideStaticCatalogModel` to your backend. Without arguments, it registers only the default model:

```ts title="packages/backend/src/index.ts"
import { provideStaticCatalogModel } from '@backstage/plugin-catalog-node/alpha';

backend.add(provideStaticCatalogModel());
```

To include more layers, pass them in the `layers` option:

```ts title="packages/backend/src/index.ts"
import { provideStaticCatalogModel } from '@backstage/plugin-catalog-node/alpha';
import { scaffolderCatalogModelLayer } from '@backstage/plugin-scaffolder-common/alpha';

backend.add(
  provideStaticCatalogModel({
    layers: [scaffolderCatalogModelLayer],
  }),
);
```

When the backend starts, the catalog logs each layer it loaded, for example `Loaded catalog model layer: scaffolder.backstage.io/kind-template`.

## Creating a layer

Use `createCatalogModelLayer` to create a layer. Each layer needs a stable, unique `layerId`. Prefix it with a domain name that you control. The `backstage.io` domain is reserved for the Backstage project.

### Adding a new kind

This example declares a `Widget` kind with the `apiVersion` `example.com/v1alpha1`:

```ts
import { createCatalogModelLayer } from '@backstage/catalog-model/alpha';

export const widgetModelLayer = createCatalogModelLayer({
  layerId: 'example.com/kind-widget',
  builder: model => {
    model.addKind({
      group: 'example.com',
      names: {
        kind: 'Widget',
        singular: 'widget',
        plural: 'widgets',
      },
      description: 'A widget that is produced by the factory.',
      versions: [
        {
          name: 'v1alpha1',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
          ],
          schema: {
            jsonSchema: {
              type: 'object',
              required: ['spec'],
              properties: {
                spec: {
                  type: 'object',
                  required: ['owner', 'size'],
                  properties: {
                    owner: { type: 'string', minLength: 1 },
                    size: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      ],
    });
  },
});
```

In this example:

- The kind's `group` and the version `name` together form the `apiVersion`. You can pass an array of names, such as `['v1alpha1', 'v1beta1']`, to apply the same definition to several versions.
- The JSON Schema describes the entity _excluding_ `apiVersion`, `kind`, and `metadata`, which the catalog generates for you. The root `type` must be `object` or omitted.
- Each relation field reads an entity reference, or a list of them, from the `selector.path` of the entity and emits the given `relation`. Use `defaultKind` and `defaultNamespace` to fill in shorthand references, and `allowedKinds` to restrict which kinds the reference may point to.

An entity of this kind looks like this:

```yaml
apiVersion: example.com/v1alpha1
kind: Widget
metadata:
  name: blue-widget
spec:
  owner: team-a
  size: 3
```

### Variants per spec type

Some kinds have fields that depend on `spec.type`. Declare one version entry per `specType` to give each variant its own schema and relation fields. A version entry without a `specType` applies to entities with no type, or with a type that no other entry declares.

The built-in `AiResource` kind uses this to give `skill` and `rule` resources different required fields:

```ts
model.addKind({
  group: 'backstage.io',
  names: { kind: 'AiResource', singular: 'airesource', plural: 'airesources' },
  description: 'Contextual information consumed by AI coding tools.',
  versions: [
    { name: 'v1alpha1', schema: { jsonSchema: defaultSchema } },
    {
      name: 'v1alpha1',
      specType: 'skill',
      schema: { jsonSchema: skillSchema },
    },
    { name: 'v1alpha1', specType: 'rule', schema: { jsonSchema: ruleSchema } },
  ],
});
```

### Adding a variant to an existing kind

Use `addKindVersion` to add a new version or `spec.type` variant to a kind that another layer declared. This is how the `mcp-server` API type is added to the built-in `API` kind:

```ts
export const mcpServerApiEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-api-mcp-server',
  builder: model => {
    model.addKindVersion({
      kind: 'API',
      versions: [
        {
          name: ['v1alpha1', 'v1beta1'],
          specType: 'mcp-server',
          description: 'An MCP server exposed as an API entity.',
          relationFields: [
            /* ... */
          ],
          schema: { jsonSchema: mcpServerSchema },
        },
      ],
    });
  },
});
```

### Adding metadata

Layers can declare the annotations, labels, and tags your organization uses. Annotations and labels can also have a JSON Schema for their value.

```ts
createCatalogModelLayer({
  layerId: 'example.com/metadata',
  builder: model => {
    model.addAnnotation({
      name: 'example.com/cost-center',
      title: 'Cost center',
      description: 'The cost center that pays for this entity.',
      schema: { jsonSchema: { type: 'string', pattern: '^[0-9]{4}$' } },
    });
    model.addLabel({
      name: 'example.com/tier',
      description: 'The service tier, from 1 (most critical) to 3.',
    });
    model.addTag({
      name: 'pci',
      description: 'The entity handles payment card data.',
    });
  },
});
```

### Composing layers

A layer can include other layers with `import`. The default model works this way: it imports one layer per built-in kind. Layers are deduplicated by `layerId`, so importing the same layer from several places is safe.

```ts
export const myOrganizationModel = createCatalogModelLayer({
  layerId: 'example.com/organization-model',
  builder: model => {
    model.import(widgetModelLayer);
    model.import(metadataLayer);
  },
});
```

## Customizing existing kinds

The builder can also update and remove parts of the model, including the built-in kinds. During compilation, all declarations are applied before any updates or removals, so a layer can update a kind that another layer declares regardless of registration order.

| Method                                         | Purpose                                                |
| ---------------------------------------------- | ------------------------------------------------------ |
| `updateKind`                                   | Change a kind's description, names, or version schemas |
| `removeKind`                                   | Remove a kind from the model                           |
| `updateRelationPair`                           | Change the titles or description of a relation pair    |
| `updateAnnotation`, `updateLabel`, `updateTag` | Change the description, title, or schema of metadata   |
| `removeAnnotation`, `removeLabel`, `removeTag` | Remove metadata from the model                         |

For example, to require that every `Component` of the `v1alpha1` version has a `spec.system`, replace its schema:

```ts
createCatalogModelLayer({
  layerId: 'example.com/strict-components',
  builder: model => {
    model.updateKind({
      names: { kind: 'Component' },
      versions: [
        {
          name: 'v1alpha1',
          schema: { jsonSchema: myStricterComponentSchema },
        },
      ],
    });
  },
});
```

Compilation fails with an error at startup if a layer makes an invalid change, such as declaring the same kind twice, declaring the same version and spec type twice, or updating a kind that doesn't exist.

## Relations to custom kinds

The model emits an inverse relation only when a relation pair covers the source kind, target kind, and relation type. The default model covers relations between built-in kinds, but not your own kinds. For example, if a `Component` has `spec.dependsOn: ['technology:react']`, the catalog won't emit the inverse `dependencyOf` relation on the `Technology` entity until you declare it:

```ts
createCatalogModelLayer({
  layerId: 'example.com/technology-relations',
  builder: model => {
    model.addRelationPair({
      fromKind: ['Component', 'Resource'],
      toKind: 'Technology',
      description: 'A component or resource depends on a technology.',
      forward: { type: 'dependsOn', title: 'depends on' },
      reverse: { type: 'dependencyOf', title: 'dependency of' },
    });
  },
});
```

Relation pairs don't override a relation field's `allowedKinds`. The [Extending the model](extending-the-model.md#relations-to-custom-kinds-with-catalog-model-layers) page covers this case in more detail.

## Writing a custom model source

If `provideStaticCatalogModel` isn't enough, write your own backend module that uses the extension point:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { CatalogModelSources } from '@backstage/catalog-model/alpha';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { widgetModelLayer } from './widgetModelLayer';

export const catalogModuleWidgetModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'widget-model',
  register(reg) {
    reg.registerInit({
      deps: { model: catalogModelExtensionPoint },
      async init({ model }) {
        model.addModelSource(CatalogModelSources.static([widgetModelLayer]));
      },
    });
  },
});
```

Plugins that ship a kind should use this pattern, so adopters can install support with one `backend.add(...)` call. Several modules can each add a model source, and the catalog combines them.

A model source is an object with a `read` method that returns an async generator of layers. The catalog reads only the first value from each source, at startup.

## Where model layers are used

The following parts of Backstage use model layers:

- **Built-in kinds.** `defaultCatalogEntityModel` in `@backstage/catalog-model` declares `Component`, `API`, `Resource`, `System`, `Domain`, `Group`, `User`, and `Location`, together with the well-known relations and annotations.
- **AI resources.** The [`@backstage/plugin-catalog-backend-module-ai-model`](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-ai-model) module adds the `AiResource` kind, with the `skill`, `rule`, `plugin`, and `marketplace` spec types. It also adds the `mcp-server` type to the `API` kind. Install it with:

  ```ts title="packages/backend/src/index.ts"
  backend.add(import('@backstage/plugin-catalog-backend-module-ai-model'));
  ```

- **Software Templates.** `scaffolderCatalogModelLayer` in `@backstage/plugin-scaffolder-common/alpha` declares the `Template` kind. It isn't registered automatically; add it with `provideStaticCatalogModel` as shown in [Enabling model layers](#enabling-model-layers).
- **Catalog model description action.** The catalog backend registers a `get-catalog-model-description` action with the actions registry. It returns a Markdown description of all kinds, relations, annotations, labels, and tags in the compiled model. AI agents connected through the Model Context Protocol (MCP) actions backend can call it to learn the shape of your catalog. Without a model source, it describes the default model.

## Limitations

The feature is in alpha and has these limitations:

- APIs may change between releases. Pin your Backstage version and check the changelog for `@backstage/catalog-model` and `@backstage/plugin-catalog-node` when upgrading.
- The catalog reads model sources once, at startup. To pick up changes, restart the backend.
- The frontend doesn't use the compiled model. For example, entity pages and the catalog table don't read kind descriptions or relation titles from it.
- You still need a custom processor to validate kinds that the model doesn't declare, as described in [Extending the model](extending-the-model.md#adding-a-new-kind).
