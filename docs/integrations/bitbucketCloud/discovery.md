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

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-bitbucket-cloud
```

### Installation without Events Support

And then add the entity provider to your catalog builder:

```diff
// packages/backend/src/plugins/catalog.ts
+ import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
+   builder.addEntityProvider(
+     BitbucketCloudEntityProvider.fromConfig(env.config, {
+       logger: env.logger,
+       scheduler: env.scheduler,
+     }),
+   );

    // [...]
  }
```

Alternatively to the config-based schedule, you can use

```diff
-       scheduler: env.scheduler,
+       schedule: env.scheduler.createScheduledTaskRunner({
+         frequency: { minutes: 30 },
+         timeout: { minutes: 3 },
+       }),
```

### Installation with Events Support

Please follow the installation instructions at

- https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md
- https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-bitbucket-cloud/README.md

Additionally, you need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Set up your provider

```diff
// packages/backend/src/plugins/catalogEventBasedProviders.ts
+import { CatalogClient } from '@backstage/catalog-client';
+import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
 import { EntityProvider } from '@backstage/plugin-catalog-node';
 import { EventSubscriber } from '@backstage/plugin-events-node';
 import { PluginEnvironment } from '../types';

 export default async function createCatalogEventBasedProviders(
-  _: PluginEnvironment,
+  env: PluginEnvironment,
 ): Promise<Array<EntityProvider & EventSubscriber>> {
   const providers: Array<
     (EntityProvider & EventSubscriber) | Array<EntityProvider & EventSubscriber>
   > = [];
-  // add your event-based entity providers here
+  providers.push(
+    BitbucketCloudEntityProvider.fromConfig(env.config, {
+      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
+      logger: env.logger,
+      scheduler: env.scheduler,
+      tokenManager: env.tokenManager,
+    }),
+  );
   return providers.flat();
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

```yaml
# app-config.yaml

catalog:
  providers:
    bitbucketCloud:
      yourProviderId: # identifies your ingested dataset
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.*$' # optional; RegExp
          repoSlug: '^service-.*$' # optional; RegExp
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
        workspace: workspace-name
```

> **Note:** It is possible but certainly not recommended to skip the provider ID level.
> If you do so, `default` will be used as provider ID.

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
- **`schedule`** _(optional)_:
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
