---
id: discovery
title: Bitbucket Cloud Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket Cloud
---

The Bitbucket Cloud integration has a special entity provider for discovering
catalog files located in [Bitbucket Cloud](https://bitbucket.org).
The provider will search your Bitbucket Cloud account and register catalog files matching the configured path
as Location entity and via following processing steps add all contained catalog entities.
This can be useful as an alternative to static locations or manually adding things to the catalog.

## Installation

You will have to add the entity provider in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket-cloud` to your backend
package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-bitbucket-cloud
```

### Installation with New Backend System

```ts
// optional if you want HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend'));
// optional if you want to use AWS SQS instead of HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend-module-aws-sqs'));
backend.add(import('@backstage/plugin-events-backend-module-bitbucket-cloud'));
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud'));
```

You need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Further documentation:

- <https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-cloud/README.md>

### Installation with Legacy Backend System

Please follow the installation instructions at

- <https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-cloud/README.md>

Additionally, you need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Set up your provider

```ts title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-start */
import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
/* highlight-add-end */

import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  const bitbucketCloudProvider = BitbucketCloudEntityProvider.fromConfig(
    env.config,
    {
      auth: env.auth,
      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
      events: env.events,
      logger: env.logger,
      scheduler: env.scheduler,
    },
  );
  builder.addEntityProvider(bitbucketCloudProvider);
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

To use the entity provider, you'll need a [Bitbucket Cloud integration set up](locations.md).
Very likely a `username` and `appPassword` will be required
(you are restricted to public repositories and a very low rate limit otherwise).

Additionally, you need to configure your entity provider instance(s):

```yaml title="app-config.yaml"
catalog:
  providers:
    bitbucketCloud:
      yourProviderId: # identifies your ingested dataset
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.*$' # optional; RegExp
          repoSlug: '^service-.*$' # optional; RegExp
        schedule: # same options as in SchedulerServiceTaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
        workspace: workspace-name
```

:::note Note

It is possible but certainly not recommended to skip the provider ID level.

> If you do so, `default` will be used as provider ID.

:::

- **`catalogPath`** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  When started with `/`, it is an absolute path from the repo root.
  It supports values as allowed by the `path` filter/modifier
  [at Bitbucket Cloud's code search](https://confluence.atlassian.com/bitbucket/code-search-in-bitbucket-873876782.html#Search-Pathmodifier).
- **`filters`** _(optional)_:
  - **`projectKey`** _(optional)_:
    Regular expression used to filter results based on the project key.
  - **`repoSlug`** _(optional)_:
    Regular expression used to filter results based on the repo slug.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.
- **`workspace`**:
  Name of your organization account/workspace.
  If you want to add multiple workspaces, you need to add one provider config each.
