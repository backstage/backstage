# Catalog Integration Patterns

Patterns for entity providers, processors, scaffolder actions, and search collators.

## Entity Provider (Ingest from External Source)

Entity providers push entities into the catalog from external sources (GitHub orgs, cloud inventories, CMDBs).

```typescript
// src/providers/MyEntityProvider.ts
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';

export class MyEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  constructor(
    private readonly config: Config,
    private readonly logger: LoggerService,
    private readonly scheduler: SchedulerService,
  ) {}

  getProviderName(): string {
    return 'MyEntityProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;

    // Schedule periodic refresh
    await this.scheduler.scheduleTask({
      id: 'my-entity-provider-refresh',
      frequency: { minutes: 30 },
      timeout: { minutes: 5 },
      fn: async () => {
        await this.refresh();
      },
    });
  }

  private async refresh(): Promise<void> {
    if (!this.connection) return;

    this.logger.info('Refreshing entities from external source');
    const entities = await this.fetchExternalEntities();

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: 'my-entity-provider',
      })),
    });
  }

  private async fetchExternalEntities(): Promise<Entity[]> {
    // Call external API and map to Backstage entities
    return [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-service',
          namespace: 'default',
          annotations: {
            'backstage.io/managed-by-location': 'my-provider:default',
            'backstage.io/managed-by-origin-location': 'my-provider:default',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-platform',
        },
      },
    ];
  }

  static fromConfig(config: Config, opts: { logger: LoggerService; scheduler: SchedulerService }) {
    return new MyEntityProvider(config, opts.logger, opts.scheduler);
  }
}
```

### Register as Backend Module

```typescript
// src/module.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyEntityProvider } from './providers/MyEntityProvider';

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'my-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, config, logger, scheduler }) {
        catalog.addEntityProvider(
          MyEntityProvider.fromConfig(config, { logger, scheduler }),
        );
      },
    });
  },
});
```

---

## Entity Processor (Transform/Validate Entities)

Processors enrich or validate entities as they pass through the ingestion pipeline.

```typescript
// src/processors/MyProcessor.ts
import {
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';

export class MyAnnotationProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'MyAnnotationProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    // Add/modify annotations, validate, or emit related entities
    if (entity.kind === 'Component' && entity.spec?.type === 'service') {
      return {
        ...entity,
        metadata: {
          ...entity.metadata,
          annotations: {
            ...entity.metadata.annotations,
            'my-company.com/processed': 'true',
          },
        },
      };
    }
    return entity;
  }
}
```

### Register Processor as Module

```typescript
export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'my-processor',
  register(env) {
    env.registerInit({
      deps: { catalog: catalogProcessingExtensionPoint },
      async init({ catalog }) {
        catalog.addProcessor(new MyAnnotationProcessor());
      },
    });
  },
});
```

---

## Scaffolder Action (Template Steps)

Custom actions extend the scaffolder's template language.

```typescript
// src/actions/createServiceAction.ts
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export function createMyServiceAction() {
  return createTemplateAction<{
    name: string;
    team: string;
    tier: 'critical' | 'standard';
  }>({
    id: 'mycompany:service:create',
    description: 'Creates a new service in the external system',
    schema: {
      input: {
        type: 'object',
        required: ['name', 'team'],
        properties: {
          name: { type: 'string', title: 'Service Name' },
          team: { type: 'string', title: 'Owning Team' },
          tier: {
            type: 'string',
            title: 'Service Tier',
            enum: ['critical', 'standard'],
            default: 'standard',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          serviceId: { type: 'string', title: 'Created Service ID' },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(`Creating service ${ctx.input.name} for ${ctx.input.team}`);

      // Call your external API
      const serviceId = await createServiceInExternalSystem(ctx.input);

      ctx.output('serviceId', serviceId);
    },
  });
}
```

### Register as Scaffolder Module

```typescript
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'my-service-action',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, config }) {
        scaffolder.addActions(createMyServiceAction());
      },
    });
  },
});
```

### Use in Template

```yaml
# template.yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: create-service
  title: Create New Service
spec:
  steps:
    - id: create-external
      name: Create in External System
      action: mycompany:service:create
      input:
        name: ${{ parameters.serviceName }}
        team: ${{ parameters.team }}
        tier: critical
```

---

## Search Collator (Index Custom Data)

Collators feed custom data into Backstage search.

```typescript
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';

export class MySearchCollatorFactory implements DocumentCollatorFactory {
  readonly type = 'my-plugin';

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute() {
    const items = await fetchItemsFromExternalApi();

    for (const item of items) {
      yield {
        title: item.name,
        text: item.description,
        location: `/my-plugin/${item.id}`,
        authorization: { resourceRef: `my-plugin:${item.id}` },
      };
    }
  }
}
```

---

## Wiring All Modules in Backend

```typescript
// packages/backend/src/index.ts
const backend = createBackend();

// Core
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-search-backend'));

// Your plugin + modules
backend.add(import('@internal/plugin-my-plugin-backend'));
backend.add(import('@internal/plugin-catalog-backend-module-my-provider'));
backend.add(import('@internal/plugin-catalog-backend-module-my-processor'));
backend.add(import('@internal/plugin-scaffolder-backend-module-my-action'));

backend.start();
```
