---
id: org
title: GitLab Organizational Data
sidebar_label: Org Data
description: Importing users and groups from GitLab into Backstage
---

The Backstage catalog can be set up to ingest organizational data -- users and
groups -- directly from GitLab. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group)
entities that mirrors your org setup.

This provider can also be configured to ingest GitLab data based on [GitLab System hooks](https://docs.gitlab.com/ee/administration/system_hooks.html). The events currently accepted are:

- `group_create`
- `group_destroy`
- `group_rename`
- `user_create`
- `user_destroy`
- `user_add_to_group`
- `user_remove_from_group`

## Installation

As this provider is not one of the default providers, you will first need to install the Gitlab provider plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gitlab @backstage/plugin-catalog-backend-module-gitlab-org
```

### Installation with New Backend System

Then add the following to your backend initialization:

```ts title="packages/backend/src/index.ts
// optional if you want HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend'));
// optional if you want to use AWS SQS instead of HTTP endpoints to receive external events
// backend.add(import('@backstage/plugin-events-backend-module-aws-sqs'));
// optional - event router for gitlab. See.: https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md
// backend.add(eventsModuleGitlabEventRouter);
// optional - token validator for the gitlab topic
// backend.add(eventsModuleGitlabWebhook);
backend.add(import('@backstage/plugin-catalog-backend-module-gitlab-org'));
```

You need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/blob/master/plugins/events-backend/README.md#configuration)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Further documentation:

- [GitLab System hooks](https://docs.gitlab.com/ee/administration/system_hooks.html)
- [Events Plugin](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [GitLab Module for the Events Plugin](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md)

### Installation with Legacy Backend System

#### Installation without Events Support

Add the plugin to the plugin catalog `packages/backend/src/plugins/catalog.ts`:

```ts
/* packages/backend/src/plugins/catalog.ts */
/* highlight-add-next-line */
import { GitlabOrgDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /** ... other processors and/or providers ... */
  /* highlight-add-start */
  builder.addEntityProvider(
    ...GitlabOrgDiscoveryEntityProvider.fromConfig(env.config, {
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

Set up your provider

```ts title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-next-line */
import { GitlabOrgDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  /* highlight-add-start */
  const gitlabOrgProvider = GitlabOrgDiscoveryEntityProvider.fromConfig(
    env.config,
    {
      logger: env.logger,
      // optional: alternatively, use scheduler with schedule defined in app-config.yaml
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
      // optional: alternatively, use schedule
      scheduler: env.scheduler,
      events: env.events,
    },
  );
  builder.addEntityProvider(gitlabOrgProvider);
  /* highlight-add-end */
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```

## Configuration

To use the entity provider, you'll need a [Gitlab integration set up](https://backstage.io/docs/integrations/gitlab/locations).

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

This will query all users and groups from your GitLab instance. Depending on the
amount of data, this can take significant time and resources.

The token used must have the `read_api` scope, and the Users and Groups fetched
will be those visible to the account which provisioned the token.

:::note Note

If you are using the New Backend System, the `schedule` has to be setup in the config, as shown below.

:::

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams # Required for gitlab.com when `orgEnabled: true`. Optional for self managed. Must not end with slash. Accepts only this group and groups under the provided path (which will be stripped)
        relations: # Optional
          - INHERITED # Optional. Members of any ancestor groups will also be considered members of the current group.
          - DESCENDANTS # Optional. Members of any descendant groups will also be considered members of the current group.
          - SHARED_FROM_GROUPS # Optional. Members of any invited groups will also be considered members of the current group.
        groupPattern: '[\s\S]*' # Optional. Filters found groups based on provided pattern. Defaults to `[\s\S]*`, which means to not filter anything
        schedule: # Same options as in SchedulerServiceTaskScheduleDefinition. Optional for the Legacy Backend System.
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

### Groups

When the `group` parameter is provided, the corresponding path prefix will be
stripped out from each matching group when computing the unique entity name.
e.g. If `group` is `org/teams`, the name for `org/teams/avengers/gotg` will be
`avengers-gotg`.

For gitlab.com, when `orgEnabled: true`, the `group` parameter is required in
order to limit the ingestion to a group within your organisation. `Group`
entities will only be ingested for the configured group, or its descendant groups,
but not any ancestor groups higher than the configured group path. Only groups
which contain members will be ingested.

### Subgroup Membership

GitLab groups and subgroups provide a hierarchical structure for organizing projects and users. Membership in a parent group extends automatically to its subgroups, ensuring consistent permissions at all levels. Additionally, membership can be managed using invited groups, where one group can be added to another. For Backstage users integrating with GitLab, understanding this [inheritance model](https://docs.gitlab.co.jp/ee/user/group/subgroups/#subgroup-membership) and the concept of invited groups is crucial for accurately mapping and managing group and user entities.

The `GitLabOrgDiscoveryEntityProvider` mirrors GitLab's membership behavior as follows:

- By default, every direct member of a GitLab group is also a member of the corresponding group in Backstage.
- To include members of subgroups as members of the parent group, configure the `relations` array with the `DESCENDANTS` option.
- To include members of parent groups as members of their subgroups, configure the `relations` array with the `INHERITED` option. This also has the effect that subgroups with no direct members will not be skipped in the group ingestion process and will be added as a group entity in Backstage;
- To include members of invited groups as members of the inviting group, configure the `relations` array with the `SHARED_FROM_GROUPS` option.

The previous `allowInherited` will be deprecated in future versions. Use the `relations` array with the `INHERITED` option instead.

```yaml
catalog:
  providers:
    gitlab:
      development:
        relations:
          - INHERITED
          - DESCENDANTS
          - SHARED_FROM_GROUPS
```

Refer to the [GitLab Group Member Relation](https://docs.gitlab.com/ee/api/graphql/reference/#groupmemberrelation) documentation for more information.

### Users

For self hosted, all `User` entities are ingested from the entire instance by default.

For gitlab.com `User` entities for users who have [direct or inherited membership](https://docs.gitlab.com/ee/user/project/members/index.html#membership-types)
of the top-level group for the configured group path will be ingested.

In both cases (SaaS & self hosted), you can limit the ingested users to users directly assigned to the group defined in your `app-config.yaml` by setting the configuration key `restrictUsersToGroup: true`. This is especially useful when you have a large user base that you don't want to import by default.

On SaaS, you can choose to include users to be ingested that do not have a paid seat. This can be useful when using a free version of Gitlab, or when you use Guest Users on Gitlab Ultimate. Unfortunately, this will also lead to some technical users that might be imported into your user base. While project & group access tokens are filtered, service accounts will remain. [Learn more about Billable Users](https://docs.gitlab.com/ee/subscriptions/self_managed/index.html#billable-users).

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com ## Could also be self hosted.
        orgEnabled: true
        group: org/teams # Required for gitlab.com when `orgEnabled: true`. Optional for self managed. Must not end with slash. Accepts only this group and groups under the provided path (which will be stripped)
        restrictUsersToGroup: true # Optional: Backstage will ingest only users directly assigned to org/teams.
        includeUsersWithoutSeat: false # Optional: Set to true to include users without paid seat, only applicable for SaaS
```

### Limiting `User` and `Group` entity ingestion in the provider

Optionally, you can limit the entity types ingested by the provider when using
`orgEnabled: true` with the following `rules` configuration to limit it to only
`User` and `Group` entities.

```yaml
catalog:
  providers:
    gitlab:
      yourOrgDataProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams
        rules:
          - allow: [Group, User]
```

### Custom Transformers

You can inject your own transformation logic to help map GitLab API responses
into Backstage entities. You can do this on the user and group requests to
enable you to do further processing or updates to these entities.

To enable this you pass a function into the `GitlabOrgDiscoveryEntityProvider`. You can
pass a `UserTransformer`, a `GroupEntitiesTransformer` or a `GroupNameTransformer` (or all of them)). The function is invoked
for each item (user or group) that is returned from the API.

The example below uses the groupNameTransformer option to change the metadata.name property of the Backstage Group Entity. Instead of populating it with the usual `group.full_path` data that comes from GitLab, it uses the `group.id`:

```ts
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import {
  GitlabOrgDiscoveryEntityProvider,
  /* highlight-add-next-line */
  GroupNameTransformerOptions,
} from '@backstage/plugin-catalog-backend-module-gitlab';

/* highlight-add-start */
function customGroupNameTransformer(
  options: GroupNameTransformerOptions,
): string {
  return `${options.group.id}`;
}
/* highlight-add-end */

/**
 * Registers the GitlabDiscoveryEntityProvider with the catalog processing extension point.
 *
 * @alpha
 */
export const catalogModuleGitlabOrgDiscoveryEntityProvider =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'gitlabOrgDiscoveryEntityProvider',
    register(env) {
      env.registerInit({
        deps: {
          config: coreServices.rootConfig,
          catalog: catalogProcessingExtensionPoint,
          logger: coreServices.logger,
          scheduler: coreServices.scheduler,
          events: eventsServiceRef,
        },
        async init({ config, catalog, logger, scheduler, events }) {
          const gitlabOrgDiscoveryEntityProvider =
            GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
              /* highlight-add-next-line */
              groupNameTransformer: customGroupNameTransformer,
              logger: loggerToWinstonLogger(logger),
              events,
              scheduler,
            });
          catalog.addEntityProvider(gitlabOrgDiscoveryEntityProvider);
        },
      });
    },
  });
```

## Troubleshooting

**NOTE**: If any groups that are being ingested are empty groups (i.e. do not
contain any projects) and the user which provisioned the token is shared with a
higher level group via [group sharing](https://docs.gitlab.com/ee/user/group/manage.html#share-a-group-with-another-group)
and you don't see the expected number of `Group` entities in the catalog you may
be hitting this [Gitlab issue](https://gitlab.com/gitlab-org/gitlab/-/issues/267996).
