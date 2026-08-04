---
id: processors
title: Custom processors
description: How to create custom catalog processors for the Backstage Software Catalog
---

Processors sit in the middle of the catalog's processing loops. They are
responsible for updating and finalizing unprocessed entities on their way to
becoming stitched entities. They can also emit new entities while doing so,
which form branches of the entity tree.

The most common uses for processors are enriching entities with annotations
and validating entities of a custom kind. If you need to ingest entities
from an external system, an
[entity provider](entity-providers.md) is a better fit.

Some defining traits of processors:

- You instantiate them using code in your backend and pass them to the catalog
  builder. There is usually one instance of each type, which gets called
  repeatedly for all entities in the catalog.
- Their invocation is driven by the fixed processing loop. All processors are
  called unconditionally for every entity. You cannot control this behavior
  beyond adjusting the loop frequency, which applies equally to all
  processors.
- They cannot delete entities directly. If a processor stops emitting a
  certain child entity, that child becomes marked as an orphan.
- Their input is an unprocessed entity, and their output is modifications to
  that same entity plus optional auxiliary data including child entities.

## Processors and the processing loop

The catalog backend runs a processing loop that periodically visits every
entity and passes it through the registered processors. Each entity goes
through the full chain of processor methods — `preProcessEntity`,
`validateEntityKind`, and `postProcessEntity` — on every visit. You cannot
target a processor at specific entities or control how often it runs
independently of other processors.

How often entities are visited is controlled by the
[`processingInterval`](../configuration.md#processing-interval) configuration,
which defaults to roughly every 100–150 seconds. All processors run on this same cycle — there is no way to give one
processor a different frequency. If you need control over scheduling, an
[entity provider](entity-providers.md) is a better fit.

For a full explanation of how entities move through ingestion, processing,
and stitching, see [The Life of an Entity](../life-of-an-entity.md).

## Creating a processor

The Backstage CLI scaffolds a complete backend module with the processor
class, module registration, and tests:

```sh
yarn new --select catalog-processor-module
```

The CLI prompts for a module ID (for example, `team-name`). This generates a
backend module package in the `plugins` folder:

```
plugins/catalog-backend-module-team-name-processor/
├── package.json
├── src/
│   ├── index.ts
│   ├── module.ts
│   └── processor/
│       ├── TeamNameProcessor.ts
│       └── TeamNameProcessor.test.ts
```

### Processor class

The generated class implements `CatalogProcessor` with a `preProcessEntity`
method as a starting point. Here is the generated structure:

```ts title="plugins/catalog-backend-module-team-name-processor/src/processor/TeamNameProcessor.ts"
import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';

export class TeamNameProcessor implements CatalogProcessor {
  static fromConfig(_config: Config): TeamNameProcessor {
    return new TeamNameProcessor();
  }

  getProcessorName(): string {
    return 'TeamNameProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    _emit: CatalogProcessorEmit,
    _originLocation: LocationSpec,
  ): Promise<Entity> {
    // Add your enrichment logic here
    return entity;
  }
}
```

### Module registration

The generated `module.ts` wires the processor into the catalog:

```ts title="plugins/catalog-backend-module-team-name-processor/src/module.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { TeamNameProcessor } from './processor/TeamNameProcessor';

export const catalogModuleTeamName = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'team-name-processor',
  register({ registerInit }) {
    registerInit({
      deps: {
        config: coreServices.rootConfig,
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog, config }) {
        catalog.addProcessor(TeamNameProcessor.fromConfig(config));
      },
    });
  },
});
```

The CLI template generates all of this, including registering the module in
your backend:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-next-line */
backend.add(import('./plugins/catalog-backend-module-team-name-processor'));

backend.start();
```

## Processor methods

The `CatalogProcessor` interface has several optional methods. Each one is
called at a different stage of the processing pipeline. The two you will
reach for most often are `preProcessEntity` and `validateEntityKind`.

### `preProcessEntity`

Called after an entity has been emitted but before it has been validated. Use
this to enrich entities with additional data — for example, adding
annotations or filling in missing fields. The entity may still be incomplete
at this point.

```ts
async preProcessEntity(
  entity: Entity,
  location: LocationSpec,
  emit: CatalogProcessorEmit,
  originLocation: LocationSpec,
  cache: CatalogProcessorCache,
): Promise<Entity>;
```

This is the most common method to implement. You can use the `location`
parameter to derive annotations from the entity's source URL, or use
information already present on the entity to fill in missing fields.

:::caution
Processors run on every entity during every processing cycle. Avoid making
external API calls in a processor — a slow response delays the entire
processing loop. If you need to fetch data from an external system, use an
[entity provider](entity-providers.md) instead, where you control the
schedule and can handle errors independently.
:::

A few patterns that work well in `preProcessEntity`:

- Filter by entity kind early so the processor skips entities it does not
  apply to.
- Check whether the annotation or field already has a value before
  overwriting it. This lets users override the processor's default in their
  `catalog-info.yaml`.
- Return the entity unchanged if the processor has nothing to add.

Here is an example that adds a `company.com/team-area` label by extracting
a team area from the entity name. If your organization uses a naming
convention like `payments-checkout-service` or `platform-auth-api`, this
processor pulls out the first segment as the team area:

```ts
import { Entity } from '@backstage/catalog-model';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';

const TEAM_AREA_LABEL = 'company.com/team-area';

export class TeamAreaProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'TeamAreaProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
  ): Promise<Entity> {
    if (entity.kind !== 'Component') {
      return entity;
    }

    if (entity.metadata.labels?.[TEAM_AREA_LABEL]) {
      return entity;
    }

    const parts = entity.metadata.name.split('-');
    if (parts.length < 2) {
      return entity;
    }

    const teamArea = parts[0];

    return {
      ...entity,
      metadata: {
        ...entity.metadata,
        labels: {
          ...entity.metadata.labels,
          [TEAM_AREA_LABEL]: teamArea,
        },
      },
    };
  }
}
```

### `validateEntityKind`

Called after pre-processing and basic validation. Use this to validate
entities of a custom kind that you have defined. Return `true` if the entity
is of a known kind and is valid, `false` if the kind is not recognized by
this processor. Throw an error if the kind is recognized but the entity is
invalid.

```ts
async validateEntityKind(entity: Entity): Promise<boolean>;
```

For example, you can enforce that all `Component` entities with
`spec.type: 'website'` include at least one link:

```ts
async validateEntityKind(entity: Entity): Promise<boolean> {
  if (entity.kind !== 'Component') {
    return false;
  }

  if (
    entity.spec?.type === 'website' &&
    (!entity.metadata.links || entity.metadata.links.length === 0)
  ) {
    throw new Error(
      'Component entities with type "website" must include at least one link',
    );
  }

  return true;
}
```

### `postProcessEntity`

Called after the entity has passed validation. Use this to emit relations,
attach additional metadata, or produce child entities based on the validated
entity.

```ts
async postProcessEntity(
  entity: Entity,
  location: LocationSpec,
  emit: CatalogProcessorEmit,
  cache: CatalogProcessorCache,
): Promise<Entity>;
```

### `getProcessorName`

Returns a unique identifier for the processor. This is the only required
method.

```ts
getProcessorName(): string;
```

### `getPriority`

Returns a number that controls the order in which processors run. The
default priority is 20. Lower values run earlier. Use this when your
processor depends on modifications made by another processor, or when
another processor depends on yours.

You can also override a processor's priority through configuration without
changing code. See the
[processor configuration](../configuration.md#processor-configuration)
documentation for details.

```ts
getPriority?(): number;
```

### `readLocation`

Reads the contents of a location and emits entities from it. Return `true`
if this processor handled the location, `false` to pass it along to other
processors.

```ts
async readLocation(
  location: LocationSpec,
  optional: boolean,
  emit: CatalogProcessorEmit,
  parser: CatalogProcessorParser,
  cache: CatalogProcessorCache,
): Promise<boolean>;
```

:::note
For most external integrations, an
[entity provider](entity-providers.md) is a better choice than
`readLocation`. Entity providers give you full control over scheduling,
delta updates, and error handling. The `readLocation` method is primarily
used by the catalog's built-in processors.
:::

## Caching processing results

If your processor does need to call an external system — and an
[entity provider](entity-providers.md) is not an option — use the
processor cache to avoid repeated calls. Many external systems support ETags
to check for changes without counting against rate limits, and the
`CatalogProcessorCache` gives you a place to store them between cycles.

This example shows how to add ETag-based caching to a processor:

```ts
import { Entity } from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';

const CACHE_KEY = 'v1';

type CacheItem = {
  etag: string;
  team: string;
};

export class TeamAnnotationProcessor implements CatalogProcessor {
  getProcessorName() {
    return 'TeamAnnotationProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
    _emit: CatalogProcessorEmit,
    _originLocation: LocationSpec,
    cache: CatalogProcessorCache,
  ): Promise<Entity> {
    if (entity.kind !== 'Component' || location.type !== 'url') {
      return entity;
    }

    const cacheItem = await cache.get<CacheItem>(CACHE_KEY);

    try {
      const response = await fetch('https://teams.example.com/api/lookup', {
        headers: cacheItem?.etag ? { 'If-None-Match': cacheItem.etag } : {},
      });

      if (response.status === 304 && cacheItem) {
        return this.applyTeam(entity, cacheItem.team);
      }

      const etag = response.headers.get('etag');
      const { team } = await response.json();

      if (etag && team) {
        await cache.set<CacheItem>(CACHE_KEY, { etag, team });
      }

      return team ? this.applyTeam(entity, team) : entity;
    } catch {
      if (cacheItem) {
        return this.applyTeam(entity, cacheItem.team);
      }
      return entity;
    }
  }

  private applyTeam(entity: Entity, team: string): Entity {
    return {
      ...entity,
      metadata: {
        ...entity.metadata,
        annotations: {
          ...entity.metadata.annotations,
          'company.com/team': team,
        },
      },
    };
  }
}
```

Bump the `CACHE_KEY` version if you change the processor implementation or
the `CacheItem` type. This ensures that the processor does not use stale
cached data after a code change.

## Supporting different metadata file formats

If you have existing metadata files in a format other than `catalog-info.yaml`,
you can implement a custom parser that converts them to the `Entity` format
on the fly. This integrates with built-in providers like
`GithubEntityProvider` so that you do not need a separate provider for these
files.

Start by scaffolding a backend module to hold your parser:

```sh
yarn new --select backend-plugin-module --option pluginId=catalog
```

This gives you the module boilerplate. You then need to implement the parser
itself and register it using `catalogModelExtensionPoint`.

Suppose your existing format looks like this:

```yaml
id: my-service
type: service
author: user@backstage.com
```

You need a parser that converts this into a valid `Entity`:

```ts title="plugins/catalog-backend-module-custom-parser/src/customEntityDataParser.ts"
import {
  CatalogProcessorParser,
  processingResult,
  LocationSpec,
} from '@backstage/plugin-catalog-node';
import yaml from 'yaml';
import {
  Entity,
  stringifyLocationRef,
  ANNOTATION_ORIGIN_LOCATION,
  ANNOTATION_LOCATION,
} from '@backstage/catalog-model';

const makeEntityFromCustomFormat = (
  component: { id: string; type: string; author: string },
  location: LocationSpec,
): Entity => {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: component.id,
      namespace: 'default',
      annotations: {
        [ANNOTATION_LOCATION]: `${location.type}:${location.target}`,
        [ANNOTATION_ORIGIN_LOCATION]: `${location.type}:${location.target}`,
      },
    },
    spec: {
      type: component.type,
      owner: component.author,
      lifecycle: 'experimental',
    },
  };
};

export const customEntityDataParser: CatalogProcessorParser = async function* ({
  data,
  location,
}) {
  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
  } catch (e) {
    const loc = stringifyLocationRef(location);
    yield processingResult.generalError(
      location,
      `Failed to parse YAML at ${loc}, ${e}`,
    );
    return;
  }

  for (const document of documents) {
    if (document.errors?.length) {
      const loc = stringifyLocationRef(location);
      yield processingResult.generalError(
        location,
        `YAML error at ${loc}, ${document.errors[0]}`,
      );
    } else {
      const json = document.toJSON();
      if (json && typeof json === 'object') {
        if (json.apiVersion) {
          yield processingResult.entity(location, json as Entity);
        } else {
          yield processingResult.entity(
            location,
            makeEntityFromCustomFormat(json, location),
          );
        }
      } else if (json !== null) {
        yield processingResult.generalError(
          location,
          `Expected object at root, got ${typeof json}`,
        );
      }
    }
  }
};
```

Register the parser through a backend module using the
`catalogModelExtensionPoint`:

```ts title="plugins/catalog-backend-module-custom-parser/src/module.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { customEntityDataParser } from './customEntityDataParser';

export const catalogModuleCustomDataParser = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'custom-data-parser',
  register({ registerInit }) {
    registerInit({
      deps: {
        catalogModel: catalogModelExtensionPoint,
      },
      async init({ catalogModel }) {
        catalogModel.setEntityDataParser(customEntityDataParser);
      },
    });
  },
});
```

The template also registers the module in your backend for you:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-next-line */
backend.add(
  import('@internal/backstage-plugin-catalog-backend-module-custom-parser'),
);
```
