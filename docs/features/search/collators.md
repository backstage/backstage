---
id: collators
title: Collators
description: Indexing you Backstage content with Collators
---

Backstage includes 2 [collators](./concepts.md#collators) out of the box for the [Catalog](#catalog) and [TechDocs](#techdocs). There's also some from the [Backstage Community](#community-collators) too!

## Catalog

The Catalog collator will index all the Entities in your Catalog. It is installed by default but if you need to add it manually here's how.

First we add the plugin into your backend app:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-catalog
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
/* highlight-add-end */

backend.start();
```

### Configuring the Catalog Collator

The following sections outlines the available configurations for this collator.

#### Scheduling

The default schedule for the Catalog Collator is to run every 10 minutes, you can provide your own schedule by adding it to your config:

```yaml title="app-config.yaml
search:
  collators:
    catalog:
      schedule: # same options as in SchedulerServiceTaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        initialDelay: { seconds: 90 }
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { hours: 6 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

#### Filtering

You may wish to collate specific subsets of entities in your Catalog, this can be accomplished using the `filter` configuration option. Here's a basic example:

```yaml title"app-config.yaml"
search:
  collators:
    catalog:
      filter:
        kind: ['component', 'api']
        spec.lifecycle: production
```

The above example will only collate entities that are `kind` equal to `component` or `api` AND have a `spec.lifecycle` set to `production`

You can also apply a more advanced filter like this:

```yaml title"app-config.yaml"
search:
  collators:
    catalog:
      filter:
        - kind: ['API']
          spec.type: openapi
        - kind: ['Component']
          spec.lifecycle: experimental
```

Now with this example it will collate all entities that are `kind` equal to `api` with a `spec.type` equal to `openapi` OR all entities that are `kind` equal to `component` AND have a `spec.lifecycle` set to `experimental`

:::tip

The filter configuration is implemented using the `EntityFilterQuery` syntax. The [reference documentation on `EntityFilterQuery`](https://backstage.io/docs/reference/catalog-client.entityfilterquery/) provides more details.

:::

## TechDocs

The TechDocs collator will index all the TechDocs in your Catalog. It is installed by default but if you need to add it manually here's how.

First we add the plugin into your backend app:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-techdocs
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
/* highlight-add-end */

backend.start();
```

### Configuring the TechDocs Collator

The default schedule for the TechDocs Collator is to run every 10 minutes, you can provide your own schedule by adding it to your config:

```yaml title="app-config.yaml
search:
  collators:
    techdocs:
      schedule: # same options as in SchedulerServiceTaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        initialDelay: { seconds: 90 }
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { hours: 6 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

### Filtering through the catalog collator

The TechDocs collator by default filters through catalog entities where the annotation `metadata.annotations.backstage.io/techdocs-ref` exists. If you wish to further filter out entities, there are two ways to do so through the `techDocsCollatorEntityFilterExtensionPoint`.

```typescript
export const exampleCustomCatalogFiltering = createBackendModule({
  pluginId: 'search',
  moduleId: 'search-techdocs-collator-entity-filter',
  register(reg) {
    reg.registerInit({
      deps: {
        customCollatorFilter: techDocsCollatorEntityFilterExtensionPoint,
      },
      async init({ customCollatorFilter }) {
        /* filtering by catalog params */
        customCollatorFilter.setCustomCatalogApiFilters([
          { kind: ['API', 'Component', ...] },
          { metadata: ['...more filters'] },
        ]);

        /* filtering by a custom function */
        customCollatorFilter.setEntityFilterFunction((entities: Entity[]) =>
          entities.filter(
            entity => entity.metadata?.annotations?.abc === 'xyz',
          ),
        );
      },
    });
  },
});
```

## Community Collators

Here are some of the known Search Collators available in from the Backstage Community:

- [`@backstage/plugin-search-backend-module-explore`](https://github.com/backstage/backstage/tree/master/plugins/search-backend-module-explore): will index content from the [Explore plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/explore/plugins/explore).
- [`@backstage/plugin-search-backend-module-stack-overflow-collator`](https://github.com/backstage/backstage/tree/master/plugins/search-backend-module-stack-overflow-collator): will index content from Stack Overflow.
- [`@backstage-community/search-backend-module-adr`](https://github.com/backstage/community-plugins/tree/main/workspaces/adr/plugins/search-backend-module-adr): will index content from the [ADR plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/adr/plugins/adr).

## Custom Collators

To create your own collators/decorators modules, please use the [searchModuleCatalogCollator](https://github.com/backstage/backstage/blob/d7f955f300893f50c4882ea8f5c09aa42dfaacfd/plugins/search-backend-module-catalog/src/alpha.ts#L49) as an example, we recommend that modules are separated by plugin packages (e.g. `search-backend-module-<plugin-id>`). You can also find the available search engines and collator/decorator modules documentation in the Alpha API reports.
