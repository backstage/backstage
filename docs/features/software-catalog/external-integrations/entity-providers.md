---
id: entity-providers
title: Custom entity providers
description: How to create custom entity providers for the Backstage Software Catalog
---

Entity providers sit at the very edge of the catalog. They are the original
sources of entities that form roots of the processing tree. The dynamic
location store API and the static locations you specify in `app-config.yaml`
are two examples of built-in providers.

Some defining traits of entity providers:

- You instantiate them using code in your backend and pass them to the catalog
  builder. Often there is one provider instance per remote system.
- You may be responsible for actively running them. Some providers need to be
  triggered periodically; others react to webhooks or pub/sub events.
- Their timing is detached from the processing loops. One provider may run
  every 30 seconds, another on every incoming webhook call.
- They can perform detailed updates on their set of entities, either replacing
  the full set or issuing individual additions and removals.
- Their output is a set of unprocessed entities, which then go through the
  processing loops before becoming final, stitched entities.
- When they remove an entity, the entire subtree of processor-generated
  entities under that root is removed as well.

## Creating an entity provider

The fastest way to get started is with the Backstage CLI, which scaffolds a
complete backend module with the provider class, configuration parsing,
scheduling, and tests:

```sh
yarn new --select catalog-provider-module
```

The CLI prompts for a module ID (for example, `frobs`). This generates a
backend module package in the `plugins` folder with the following structure:

```text
plugins/catalog-backend-module-frobs-provider/
├── config.d.ts
├── package.json
├── src/
│   ├── index.ts
│   ├── module.ts
│   └── provider/
│       ├── FrobsProvider.ts
│       ├── FrobsProvider.test.ts
│       └── readProviderConfigs.ts
```

### Provider class

The generated provider class implements the `EntityProvider` interface and
handles scheduling, connection management, and mutation. Here is the key
structure (with the module ID `frobs` as an example):

```ts title="plugins/catalog-backend-module-frobs-provider/src/provider/FrobsProvider.ts"
import { Config } from '@backstage/config';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { randomUUID } from 'node:crypto';
import { readProviderConfigs } from './readProviderConfigs';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

export class FrobsProvider implements EntityProvider {
  static fromConfig(
    configRoot: Config,
    options: { logger: LoggerService; scheduler: SchedulerService },
  ): FrobsProvider[] {
    return readProviderConfigs(configRoot).map(providerConfig => {
      return new FrobsProvider({
        id: providerConfig.id,
        target: providerConfig.target,
        logger: options.logger,
        taskRunner: options.scheduler.createScheduledTaskRunner(
          providerConfig.schedule,
        ),
      });
    });
  }

  readonly #id: string;
  readonly #target: string;
  readonly #logger: LoggerService;
  readonly #taskRunner: SchedulerServiceTaskRunner;

  constructor(options: {
    id: string;
    target: string;
    logger: LoggerService;
    taskRunner: SchedulerServiceTaskRunner;
  }) {
    this.#id = options.id;
    this.#target = options.target;
    this.#logger = options.logger;
    this.#taskRunner = options.taskRunner;
  }

  getProviderName() {
    return `FrobsProvider:${this.#id}`;
  }

  async connect(connection: EntityProviderConnection) {
    const id = `${this.getProviderName()}:refresh`;

    await this.#taskRunner.run({
      id,
      fn: async () => {
        const logger = this.#logger.child({
          taskId: id,
          taskInstanceId: randomUUID(),
        });

        try {
          const entities = await this.read({ logger });
          logger.info(`Read ${entities.length} entities`);
          await connection.applyMutation({
            type: 'full',
            entities,
          });
        } catch (error) {
          logger.error(`Refresh failed`, error);
        }
      },
    });
  }

  async read(options: { logger: LoggerService }): Promise<DeferredEntity[]> {
    const { logger } = options;
    logger.info(`Reading entities from ${this.#target}`);

    // Replace this with your actual data-fetching logic
    const entities: DeferredEntity[] = [];
    return entities;
  }
}
```

The `fromConfig` static method reads all configured provider instances from
`app-config.yaml` and creates one provider per configuration block, each with
its own schedule. The `getProviderName` method returns a name that must be
unique across all providers and stable over time — the catalog uses it to
identify which "bucket" of entities belongs to this provider.

When the catalog engine starts up, it calls `connect` on every registered
provider. The generated code uses this hook to schedule a recurring task that
calls the `read` method. The `read` method is where you add your logic for
fetching data from the external system and returning it as `DeferredEntity`
objects.

Each `DeferredEntity` must include the `backstage.io/managed-by-location`
and `backstage.io/managed-by-origin-location` annotations; without these, the
entity does not appear in the catalog and generates warning logs. See the
[well-known annotations](../well-known-annotations.md#backstageiomanaged-by-location)
documentation for guidance on what values to use.

### Module registration

The generated `module.ts` wires the provider into the catalog using the
backend module system:

```ts title="plugins/catalog-backend-module-frobs-provider/src/module.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { FrobsProvider } from './provider/FrobsProvider';

export const catalogModuleFrobs = createBackendModule({
  moduleId: 'frobs-provider',
  pluginId: 'catalog',
  register({ registerInit }) {
    registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        processing: catalogProcessingExtensionPoint,
      },
      async init({ logger, scheduler, config, processing }) {
        processing.addEntityProvider(
          FrobsProvider.fromConfig(config, {
            logger,
            scheduler,
          }),
        );
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
backend.add(import('./plugins/catalog-backend-module-frobs-provider'));

backend.start();
```

### Configuration

The generated `readProviderConfigs.ts` parses configuration from
`app-config.yaml`. The template supports both a single provider instance and
multiple named instances:

```yaml title="app-config.yaml"
catalog:
  providers:
    frobsProvider:
      target: https://frobs.example.com/api/v2
      schedule:
        frequency: { minutes: 30 }
        timeout: { minutes: 3 }
```

For multiple instances pointing at different environments:

```yaml title="app-config.yaml"
catalog:
  providers:
    frobsProvider:
      production:
        target: https://frobs.example.com/api/v2
        schedule:
          frequency: { minutes: 30 }
          timeout: { minutes: 3 }
      staging:
        target: https://frobs-staging.example.com/api/v2
        schedule:
          frequency: { hours: 1 }
          timeout: { minutes: 3 }
```

If you do not specify a schedule, the provider defaults to running every 30
minutes with a 3-minute timeout. You can also
[add a schema to your config](../../../conf/defining.md) using the generated
`config.d.ts` file.

## Provider mutations

Each provider instance has its own "bucket" of entities, identified by the
stable name returned from `getProviderName`. Every time the provider issues
a "mutation", it changes the contents of that bucket. Nothing outside the
bucket is accessible.

There are two types of mutation.

_Full mutation_ — replaces the entire bucket contents. The catalog
implements this as an efficient delta internally, since the difference
between runs is typically small. This is the default strategy in the
generated template, and works well when you can batch-fetch all entities
from the remote source.

```ts
await connection.applyMutation({
  type: 'full',
  entities: entities.map(entity => ({
    entity,
    locationKey: `frobs-provider:${this.#id}`,
  })),
});
```

_Delta mutation_ — upserts or deletes specific entities in the bucket.
This is a better fit for event-based providers where you receive individual
change notifications rather than full snapshots.

```ts
await connection.applyMutation({
  type: 'delta',
  added: newEntities.map(entity => ({
    entity,
    locationKey: `frobs-provider:${this.#id}`,
  })),
  removed: removedEntities.map(entity => ({
    entity,
    locationKey: `frobs-provider:${this.#id}`,
  })),
});
```

In both cases, the catalog treats the entities as unprocessed. After they
land in the database, the registered processors transform them into final,
processed and stitched entities.

### Location keys

Every entity emitted by a provider can have a `locationKey`. This is a
conflict resolution key — an opaque string that should be unique for each
location where an entity could originate. Set it to a string that distinctly
identifies the provider and its instance properties.

A conflict happens when two entity definitions share the same entity
reference (kind, namespace, and name). The location key resolves conflicts
using these rules:

- If the existing entity has no location key, the new entity wins.
- If the existing entity has a location key, the new entity only wins when
  the location keys match.
- If the entity does not already exist, the catalog inserts it with the
  provided location key.

This prevents "rogue" takeovers of entities that belong to other providers.

## Example: User entity provider

This example shows a provider that syncs user entities from an HR system
and enriches them with Slack profile links.

<details>
<summary>Full user entity provider example</summary>

```ts
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  UserEntity,
} from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { kebabCase } from 'lodash';

interface Staff {
  displayName: string;
  slackUserId: string;
  jobTitle: string;
  photoUrl: string;
  address: string;
  email: string;
}

export class UserEntityProvider implements EntityProvider {
  private readonly getStaffUrl: string;
  private readonly slackTeam: string;
  private connection?: EntityProviderConnection;

  constructor(options: { getStaffUrl: string; slackTeam: string }) {
    this.getStaffUrl = options.getStaffUrl;
    this.slackTeam = options.slackTeam;
  }

  getProviderName(): string {
    return 'user-entity-provider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const response = await fetch(this.getStaffUrl);
    const staff: Staff[] = await response.json();

    const userResources: UserEntity[] = staff.map(user => {
      const links =
        user.slackUserId && user.slackUserId.length > 0
          ? [
              {
                url: `slack://user?team=${this.slackTeam}&id=${user.slackUserId}`,
                title: 'Slack',
                icon: 'message',
              },
            ]
          : undefined;

      return {
        kind: 'User',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          annotations: {
            [ANNOTATION_LOCATION]: `hr-user:${this.getStaffUrl}`,
            [ANNOTATION_ORIGIN_LOCATION]: `hr-user:${this.getStaffUrl}`,
          },
          links,
          name: kebabCase(user.displayName),
          title: user.displayName,
        },
        spec: {
          profile: {
            displayName: user.displayName,
            email: user.email,
            picture: user.photoUrl,
          },
          memberOf: [],
        },
      };
    });

    await this.connection.applyMutation({
      type: 'full',
      entities: userResources.map(entity => ({
        entity,
        locationKey: `hr-user:${this.getStaffUrl}`,
      })),
    });
  }
}
```

</details>
