# Catalog Integration Reference

## Entity Providers (injecting entities from external sources)

```ts
// src/provider.ts
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

export class MyEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  getProviderName() { return 'my-entity-provider'; }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    // trigger an initial sync
    await this.refresh();
  }

  async refresh() {
    const entities: Entity[] = await this.fetchExternalEntities();
    await this.connection!.applyMutation({
      type: 'full',       // or 'delta'
      entities: entities.map(entity => ({
        entity,
        locationKey: `my-provider:${entity.metadata.name}`,
      })),
    });
  }
}
```

### Wire to catalog via a backend module

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyEntityProvider } from './provider';

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'my-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog:   catalogProcessingExtensionPoint,
        logger:    coreServices.logger,
        scheduler: coreServices.scheduler,
        config:    coreServices.rootConfig,
      },
      async init({ catalog, logger, scheduler, config }) {
        const provider = new MyEntityProvider({ logger, config });
        catalog.addEntityProvider(provider);

        // schedule periodic refresh
        await scheduler.scheduleTask({
          id:        'my-provider:refresh',
          frequency: { minutes: 60 },
          timeout:   { minutes: 10 },
          fn:        () => provider.refresh(),
        });
      },
    });
  },
});
```

---

## Entity Processors (transforming / validating entities)

```ts
import { CatalogProcessor, CatalogProcessorResult } from '@backstage/plugin-catalog-node';

export class MyProcessor implements CatalogProcessor {
  getProcessorName() { return 'my-processor'; }

  async validateEntityKind(entity: Entity): Promise<boolean> {
    return entity.kind === 'MyKind';
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: (result: CatalogProcessorResult) => void,
  ): Promise<Entity> {
    // Example: emit a related entity relation
    if (entity.spec?.owner) {
      emit(processingResult.relation({
        type:       RELATION_OWNED_BY,
        source:     getCompoundEntityRef(entity),
        target:     parseEntityRef(entity.spec.owner as string),
      }));
    }
    return entity;
  }
}
```

Wire via `catalogProcessingExtensionPoint.addProcessor(new MyProcessor())`.

---

## Custom Entity Kinds

```ts
// In your -common package
export interface MyKindEntity extends Entity {
  kind: 'MyKind';
  spec: {
    owner: string;
    system?: string;
    // ...
  };
}

// Type guard
export function isMyKindEntity(e: Entity): e is MyKindEntity {
  return e.kind === 'MyKind';
}
```

Register schema validation with `catalogModelExtensionPoint.addEntityKindValidator(...)`.

---

## Catalog Rules

Add to `app-config.yaml` so the catalog accepts your new kind:

```yaml
catalog:
  rules:
    - allow: [Component, API, System, MyKind]
```

---

## Common Catalog Annotations

```ts
// Standard annotations your plugin may read
export const ANNOTATION_GITHUB_SLUG    = 'github.com/project-slug';
export const ANNOTATION_SONARQUBE_KEY  = 'sonarqube.org/project-key';
export const ANNOTATION_PAGERDUTY_ID   = 'pagerduty.com/service-id';

// Use in entity components
const slug = entity.metadata.annotations?.[ANNOTATION_GITHUB_SLUG];
```

---

## Scaffolder Actions (Template Actions)

```ts
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';

export const myAction = createTemplateAction({
  id: 'my-plugin:do-thing',
  description: 'Does the thing',
  schema: {
    input: z.object({
      repoUrl: z.string().describe('Repository URL'),
      values:  z.record(z.string()).optional(),
    }),
    output: z.object({
      result: z.string(),
    }),
  },
  async handler(ctx) {
    ctx.logger.info(`Running with input: ${JSON.stringify(ctx.input)}`);

    const { repoUrl, values = {} } = ctx.input;
    // do the work...

    ctx.output('result', 'done');
  },
});
```

Wire to scaffolder via a backend module:

```ts
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'my-actions',
  register(env) {
    env.registerInit({
      deps: { scaffolder: scaffolderActionsExtensionPoint },
      async init({ scaffolder }) {
        scaffolder.addActions(myAction());
      },
    });
  },
});
```

---

## Search Collators

```ts
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';

export class MyCollatorFactory implements DocumentCollatorFactory {
  readonly type = 'my-plugin';

  async getCollator(): Promise<Readable> {
    return Readable.from(this.fetchDocuments());
  }

  private async *fetchDocuments() {
    for (const item of await this.fetchItems()) {
      yield {
        title:     item.name,
        text:      item.description,
        location:  `/my-plugin/${item.id}`,
        type:      this.type,
      };
    }
  }
}
```
