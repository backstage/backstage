---
id: discovery
title: GitLab Discovery
sidebar_label: Discovery
description: Automatically discovering catalog entities from repositories in GitLab
---

The GitLab integration has a special entity provider for discovering catalog
entities from GitLab. The entity provider will crawl the GitLab instance and register
entities matching the configured paths. This can be useful as an alternative to
static locations or manually adding things to the catalog.

This provider can also be configured to ingest GitLab data based on [GitLab Webhooks](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#configure-a-webhook-in-gitlab). The events currently accepted are:

- [`push`](https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#push-events).

## Installation

As this provider is not one of the default providers, you will first need to install
the gitlab catalog plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gitlab
```

### Installation with New Backend System

Then add the following to your backend initialization:

```ts title="packages/backend/src/index.ts"
// optional if you want HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend'));
// optional if you want to use AWS SQS instead of HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend-module-aws-sqs'));
// optional - event router for gitlab. See.: https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md
// backend.add(eventsModuleGitlabEventRouter);
// optional - token validator for the gitlab topic
// backend.add(eventsModuleGitlabWebhook);
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab'));
```

You need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/blob/master/plugins/events-backend/README.md#configuration)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)
- [via Google Pub/Sub](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-google-pubsub/README.md)
- [via a Kafka topic](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-kafka/README.md)

Further documentation:

- [Events Plugin](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [GitLab Module for the Events Plugin](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md)

### Installation with Legacy Backend System (skip if you are using Backstage v1.31.0 or later)

#### Installation without Events Support

Add the segment below to `packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  builder.addEntityProvider(
    ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      // optional: alternatively, use scheduler with schedule defined in app-config.yaml
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // optional: alternatively, use schedule
      scheduler: env.scheduler,
    }),
  );
  /* highlight-add-end */
  // ..
}
```

#### Installation with Events Support

Please follow the installation instructions at

- [Events Plugin](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [GitLab Module for the Events Plugin](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md)

Additionally, you need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)
- [via Google Pub/Sub](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-google-pubsub/README.md)
- [via a Kafka topic](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-kafka/README.md)

Set up your provider

```ts title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-next-line */
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  /* highlight-add-start */
  const gitlabProvider = GitlabDiscoveryEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
    // optional: alternatively, use schedule
    scheduler: env.scheduler,
    events: env.events,
  });
  builder.addEntityProvider(gitlabProvider);
  /* highlight-add-end */
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```

## Configuration

To use the discovery provider, you'll need a GitLab integration
[set up](locations.md) with a `token`. Then you can add a provider config per group
to the catalog configuration.

:::note Note

If you are using the New Backend System, the `schedule` has to be setup in the config, as shown below.

:::

```yaml title="app-config.yaml"
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab-host # Identifies one of the hosts set up in the integrations
        branch: main # Optional. Used to discover on a specific branch
        fallbackBranch: master # Optional. Fallback to be used if there is no default branch configured at the Gitlab repository. It is only used, if `branch` is undefined. Uses `master` as default
        skipForkedRepos: false # Optional. If the project is a fork, skip repository
        includeArchivedRepos: false # Optional. If project is archived, include repository
        group: example-group # Optional (unless useSearch is true). Group and subgroup (if needed) to look for repositories. If not present the whole instance will be scanned
        groupPattern: # Optional. Filters for groups based on a list of RegEx. Default, no filters.
          - '^somegroup$'
          - 'anothergroup'
        entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
        useSearch: false # Optional. Whether to use the GitLab group search API to find files. Requires Gitlab 'Premium' or 'Ultimate' licenses.  Defaults to `false`
        projectPattern: '[\s\S]*' # Optional. Filters found projects based on provided pattern. Defaults to `[\s\S]*`, which means to not filter anything
        excludeRepos: [] # Optional. A list of project paths that should be excluded from discovery, e.g. group/subgroup/repo. Should not start or end with a slash.
        schedule: # Same options as in SchedulerServiceTaskScheduleDefinition. Optional for the Legacy Backend System
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

## Alternative processor

As alternative to the entity provider `GitlabDiscoveryEntityProvider`
you can still use the `GitLabDiscoveryProcessor`.

Note the `gitlab-discovery` type, as this is not a regular `url` processor.

The target is composed of three parts:

- The base URL, `https://gitlab.com` in this case
- The group path, `group/subgroup` in this case. This is optional: If you omit
  this path the processor will scan the entire GitLab instance instead.
- The path within each repository to find the catalog YAML file. This will
  usually be `/blob/main/catalog-info.yaml`, `/blob/master/catalog-info.yaml` or
  a similar variation for catalog files stored in the root directory of each
  repository. If you want to use the repository's default branch use the `*`
  wildcard, e.g.: `/blob/*/catalog-info.yaml`

Finally, you will have to add the processor in the catalog initialization code
of your backend.

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  builder.addProcessor(
    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  /* highlight-add-end */

  // ..
}
```

And add the following to your app-config.yaml

```yaml
catalog:
  locations:
    - type: gitlab-discovery
      target: https://gitlab.com/group/subgroup/blob/main/catalog-info.yaml
```

If you don't want create location object if file with component definition do not exists in project, you can set the `skipReposWithoutExactFileMatch` option. That can reduce count of request to gitlab with 404 status code.

If you don't want to create location object if the project is a fork, you can set the `skipForkedRepos` option.

If you want to create location object if the project is archived, you can set the `includeArchivedRepos` option.
