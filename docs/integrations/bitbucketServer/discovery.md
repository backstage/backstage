---
id: discovery
title: Bitbucket Server Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket Server
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./discovery--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Bitbucket Server integration has a special entity provider for discovering
catalog files located in Bitbucket Server.
The provider will search your Bitbucket Server account and register catalog files matching the configured path
as Location entity and via following processing steps add all contained catalog entities.
This can be useful as an alternative to static locations or manually adding things to the catalog.

## Installation

You will have to add the entity provider in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket-server` to your backend package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-bitbucket-server
```

### Installation with New Backend System

```ts
// optional if you want HTTP endpojnts to receive external events
// backend.add(import('@backstage/plugin-events-backend'));
// optional if you want to use AWS SQS instead of HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend-module-aws-sqs'));
backend.add(import('@backstage/plugin-events-backend-module-bitbucket-server'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-server'),
);
```

You need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Further documentation:

- <https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-server/README.md>

### Installation with Legacy Backend System

#### Installation without Events Support

You will have to add the entity provider in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket-server` to your backend
package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-bitbucket-server
```

And then add the entity provider to your catalog builder:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-server'),
);
/* highlight-add-end */
```

#### Installation with Events Support

Please follow the installation instructions at

- <https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-server/README.md>

Additionally, you need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
  - Bitbucket Server events webhook url should be set to `{backstageBaseUrl}/api/events/http/bitbucketServer`
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Set up your provider

```ts title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-start */
import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';
/* highlight-add-end */

import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  /* highlight-add-start */
  const bitbucketServerProvider = BitbucketServerEntityProvider.fromConfig(
    env.config,
    {
      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
      logger: env.logger,
      scheduler: env.scheduler,
      events: env.events,
      tokenManager: env.tokenManager,
    },
  );
  env.eventBroker.subscribe(bitbucketServerProvider);
  builder.addEntityProvider(bitbucketServerProvider);
  /* highlight-add-end */
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```

**Attention:**
`catalogApi` and `tokenManager` are required at this variant
compared to the one without events support.

## Configuration

To use the entity provider, you'll need a [Bitbucket Server integration set up](locations.md).

Additionally, you need to configure your entity provider instance(s):

```yaml title="app-config.yaml"
catalog:
  providers:
    bitbucketServer:
      yourProviderId: # identifies your ingested dataset
        host: 'bitbucket.mycompany.com'
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.*$' # optional; RegExp
          repoSlug: '^service-.*$' # optional; RegExp
          skipArchivedRepos: true # optional; boolean
        schedule: # same options as in SchedulerServiceTaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

- **`host`**:
  The host of the Bitbucket Server instance, **note**: the host needs to registered as an integration as well, see [location](locations.md).
- **`catalogPath`** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  When started with `/`, it is an absolute path from the repo root.
- **`filters`** _(optional)_:
  - **`projectKey`** _(optional)_:
    Regular expression used to filter results based on the project key.
  - **`repoSlug`** _(optional)_:
    Regular expression used to filter results based on the repo slug.
  - **`skipArchivedRepos`** _(optional)_:
    Boolean flag to filter out archived repositories.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.
