# catalog-graph

> **Disclaimer:**
> This documentation is made for those using the experimental new Frontend system.
> If you are not using the new Backstage frontend system, please go [here](./README.md).

Welcome to the catalog graph plugin! The catalog graph visualizes the relations
between entities, like ownership, grouping or API relationships.

The plugin comes with these features:

- Catalog entity relations graph card:
  A card that displays the directly related entities to the current entity.
  This card is for use on the entity page.
  The card can be customized, for example filtering for specific relations.
  <video src='https://user-images.githubusercontent.com/648527/133401912-aaedc36a-b70b-437e-8e5f-2a14b21962f0.mov'  width=640>

- Catalog entity relations graph page:
  A standalone page that can be added to your application providing a viewer for your entities and their relations.
  The viewer can be used to navigate through the entities and filter for specific relations.
  You can access it from the `EntityCatalogGraphCard`.
  <video src='https://user-images.githubusercontent.com/648527/133403059-6584e469-23ab-41d2-a9e6-fd691a4e2737.mov' width=640>

- `EntityRelationsGraph`:
  A react component that can be used to build own customized entity relation graphs.

## Installation

This plugin installation requires the following steps:

> [!Note]
> This plugin only works if you're also using the [catalog](https://backstage.io/docs/features/software-catalog/) plugin, so make sure you've got it installed;

1. Add the `@backstage/catalog-graph` dependency to your app `package.json` file and install it;
2. In your application's configuration file, enable the catalog entity relations graphic card extension so that the card begins to be presented on the catalog entity page:

```yaml
app:
  extensions:
    - entity-card:catalog-graph/entity-relations
```

3. Then start the app, navigate to an entity's page and see the Relations graph there;
4. By clicking on the 'View Graph' card action, you will be redirected to the catalog entity relations page.

## Routes

The Catalog Graph plugin exposes routes that can be used to configure route bindings.

| Key             | Type           | Description                                |
| --------------- | -------------- | ------------------------------------------ |
| `catalogGraph`  | Regular route  | Reference to the Catalog graph page route  |
| `catalogEntity` | External route | Reference to the Catalog entity page route |

With this, you can optionally associate the entity relations graph page to a different route other than the Catalog plugin's default entity page (for more information about route binding, see [this](https://backstage.io/docs/frontend-system/architecture/routes#binding-external-route-references) documentation).

```yaml
# example binding the catalog graph entity page
app:
  routes:
    bindings:
      # defaults to catalog.catalogEntity
      catalog-graph.catalogEntity: <some-plugin-id>.<some-external-route-key>
```

You can also point an external route from another plug-in to the Catalog chart page:

```yaml
app:
  routes:
    bindings:
      <some-plugin-id>.<some-external-route-key>: catalog-graph.catalogEntity
```

## Extensions

This plugin extensions are configurable through the `app-config.yaml` file and its implementation is also replaceable.

### Catalog Entity Relations Graph Card

A [Entity Card](https://backstage.io/docs/frontend-system/building-plugins/extension-types#entitycard---reference) extension renders the relation graph for a Catalog entity on the Catalog entity page. This extension has an action that redirects users to the Catalog entity's relations graph [page](#catalog-entity-relations-graph-page).

| kind        | namespace     | name             | id                                           |
| ----------- | ------------- | ---------------- | -------------------------------------------- |
| entity-card | catalog-graph | entity-relations | `entity-card:catalog-graph/entity-relations` |

#### Output

A React component defined by the [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata/) type.

#### Inputs

There are no inputs available for this extension.

#### Config

The card configurations should be defined under the `app.extensions.entity-card:catalog-graph/entity-relations.config` key:

```yaml
# example configuring the card title
app:
  extensions:
    # this is the extension id and it follows the naming pattern bellow:
    # <extension-kind>/<plugin-namespace>:<extension-name>
    - entity-card:catalog-graph/entity-relations:
        config:
          # defaults to "Relations"
          title: 'Entities Relations Graph'
```

See below the complete list of available configs:

| Key               | Description                                                                                                                                        | Type                                                                                                        | Optional | Default value                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `filter`          | A query to filter when to show the card based on the entity metadata, for more details [see](./https://github.com/backstage/backstage/pull/21480). | `string`                                                                                                    | yes      | -                                                                                                                           |
| `title`           | The card title text.                                                                                                                               | `string`                                                                                                    | yes      | `'Relations'`                                                                                                               |
| `variant`         | The card layout variants.                                                                                                                          | `flex` \| `fullHeight` \| `gridItem`                                                                        | yes      | `'gridItem'`                                                                                                                |
| `height`          | The card height fixed size.                                                                                                                        | `number`                                                                                                    | yes      | -                                                                                                                           |
| `rootEntityNames` | A single our multiple compound root entity ref objects.                                                                                            | `{ kind: string, namespace: string, name: string }` \| `{ kind: string, namespace: string, name: string}[]` | yes      | Defaults to the entity available in the entity page context                                                                 |
| `kinds`           | List of "kinds" used to filter which entities to show on the graph.                                                                                | `string[]`                                                                                                  | yes      | Show all entity [kinds](https://backstage.io/docs/features/software-catalog/descriptor-format#apiversion-and-kind-required) |
| `relations`       | List of "relations" used to filter which entities to show on the graph.                                                                            | `string[]`                                                                                                  | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations)             |
| `maxDepth`        | Amount of relationship levels.                                                                                                                     | `number`                                                                                                    | yes      | `1`                                                                                                                         |
| `unidirectional`  | Shows only unidirectional relations.                                                                                                               | `boolean`                                                                                                   | yes      | `true`                                                                                                                      |
| `mergeRelations`  | Enable merging entity relation pairs.                                                                                                              | `boolean`                                                                                                   | yes      | `true`                                                                                                                      |
| `direction`       | Render direction of the graph.                                                                                                                     | `TB` \| `BT` \| `LR` \| `RL`                                                                                | yes      | `'LR'`                                                                                                                      |
| `relationPairs`   | A list of pairs of entity relations, used to define which relations are merged together and which the primary relation is.                         | `string[]`                                                                                                  | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations)             |
| `zoom`            | Controls zoom behavior of graph.                                                                                                                   | `enabled` \| `disabled` \| `enable-on-click`                                                                | yes      | `'enabled'`                                                                                                                 |
| `curve`           | A factory name for curve generators addressing both lines and areas.                                                                               | `curveStepBefore` \| `curveMonotoneX`                                                                       | yes      | `'enable-on-click' `                                                                                                        |

#### How to override the card extension

There is more than one option on where to place extension overrides, see the official [documentation](https://backstage.io/docs/frontend-system/architecture/extension-overrides) to learn more about the recommendations.

> [!Warning]
> To maintain the same level of configuration, you should define the same or an extended configuration schema.

```tsx
import { createExtensionOverrides } from '@backstage/backstage-plugin-api';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';

createExtensionOverrides(
  extensions: [
    createEntityCardExtension({
      // This namespace is necessary so the system knows that this extension will replace the default 'entity-relations' card extension that is provided by the 'catalog-graph' plugin
      namespace: 'catalog-graph',
      name: 'entity-relations',
      loader: () => import('./components').then(m => <m.MyEntityRelationsCard />)
    })
  ]
);
```

### Catalog Entity Relations Graph Page

This page displays a more detailed relation graph for a Catalog entity. It contains a few filters that you can use to narrow down what's displayed.

| kind | namespace     | name | id                   |
| ---- | ------------- | ---- | -------------------- |
| page | catalog-graph | -    | `page:catalog-graph` |

#### Output

A React component defined by the [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata/) type.

#### Inputs

There are no inputs available for this extension.

#### Config

The page configurations should be defined under the `app.extensions.page:catalog-graph.config` key:

```yaml
# example configuring the page path
app:
  extensions:
    # this is the extension id and it follows the naming pattern bellow:
    # <extension-kind>/<plugin-namespace>:<extension-name>
    - page:catalog-graph:
        config:
          # defaults to "/catalog-graph"
          path: '/entity-graph'
```

See below the complete list of available configs:

| Key               | Description                                                                                                                | Type                                                                                                                                                                                                                                                | Optional | Default value                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `path`            | The page route path.                                                                                                       | `string`                                                                                                                                                                                                                                            | true     | '/catalog-graph'                                                                                                            |
| `initialState`    | The page initial state.                                                                                                    | `{ selectedRelations?: string[],selectedKinds?: string[],rootEntityRefs?: string[],maxDepth?: number,unidirectional?: boolean,mergeRelations?: boolean,direction?: Direction,showFilters?: boolean,curve?: 'curveStepBefore' \| 'curveMonotoneX' }` | true     | {}                                                                                                                          |
| `rootEntityNames` | A single our multiple compound root entity ref objects.                                                                    | `{ kind: string, namespace: string, name: string }` \| `{ kind: string, namespace: string, name: string}[]`                                                                                                                                         | yes      | Defaults to the entity available in the entity page context                                                                 |
| `kinds`           | List of "kinds" used to filter which entities to show on the graph.                                                        | `string[]`                                                                                                                                                                                                                                          | yes      | Show all entity [kinds](https://backstage.io/docs/features/software-catalog/descriptor-format#apiversion-and-kind-required) |
| `relations`       | List of "relations" used to filter which entities to show on the graph.                                                    | `string[]`                                                                                                                                                                                                                                          | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations)             |
| `maxDepth`        | Amount of relationship levels.                                                                                             | `number`                                                                                                                                                                                                                                            | yes      | `1`                                                                                                                         |
| `unidirectional`  | Shows only unidirectional relations.                                                                                       | `boolean`                                                                                                                                                                                                                                           | yes      | `true`                                                                                                                      |
| `mergeRelations`  | Enable merging entity relation pairs.                                                                                      | `boolean`                                                                                                                                                                                                                                           | yes      | `true`                                                                                                                      |
| `direction`       | Render direction of the graph.                                                                                             | `TB` \| `BT` \| `LR` \| `RL`                                                                                                                                                                                                                        | yes      | `'LR'`                                                                                                                      |
| `relationPairs`   | A list of pairs of entity relations, used to define which relations are merged together and which the primary relation is. | `string[]`                                                                                                                                                                                                                                          | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations)             |
| `zoom`            | Controls zoom behavior of graph.                                                                                           | `enabled` \| `disabled` \| `enable-on-click`                                                                                                                                                                                                        | yes      | `'enabled'`                                                                                                                 |
| `curve`           | A factory name for curve generators addressing both lines and areas.                                                       | `curveStepBefore` \| `curveMonotoneX`                                                                                                                                                                                                               | yes      | `'enable-on-click' `                                                                                                        |

## How to override the page extension

There is more than one option on where to place extension overrides, see the official [documentation](https://backstage.io/docs/frontend-system/architecture/extension-overrides) to learn more about the recommendations.

> [!Warning]
> To maintain the same level of configuration, you should define the same or an extended configuration schema. Also remember to use the same default path so that applications that use the default path still point to the same page and the same route reference to avoid side effects on external plugins that expect this page to be associated with the default route reference.

```tsx
import { createExtensionOverrides, createPageExtension } from '@backstage/backstage-plugin-api';

createExtensionOverrides(
  extensions: [
    createPageExtension({
      // Ommiting name since it is an index page
      // This namespace is necessary so the system knows that this extension will replace the default 'entity-relations' card extension that is provided by the 'catalog-graph' plugin
      namespace: 'catalog-graph',
      defaultPath: '/catalog-graph',
      routeRef: convertLegacyRouteRef(catalogGraphRouteRef),
      loader: () => import('./components').then(m => <m.MyEntityRelationsPage />)
    })
  ]
);
```
