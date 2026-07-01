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

## Events Support

The catalog module for GitLab comes with events support enabled. This will make it subscribe to its relevant topics (`gitlab.push`) and expects these events to be published via the `EventsService`.

### Prerequisites

There are two Prerequisites to use the builtin events support:

1. Creating a group level or project level webhook in GitLab
2. Installing and configuring `@backstage/plugin-events-backend-module-gitlab`

#### Configure Webhooks in GitLab

You can either configure group level webhooks or project level webhooks. Refer to the official docs on [how to configure them](https://docs.gitlab.com/user/project/integrations/webhooks/).

The webhook(s) will need to be configured to react to `push` events.

When creating the webhook in GitLab, the "URL" will look something like: `https://<your-instance-name>/api/events/http/gitlab`.

#### Install and Configure GitLab Events Module

In order to use the built-in events support you'll need to install and configure `@backstage/plugin-events-backend-module-gitlab`. This module will route received events from the generic topic `gitlab` to more specific ones based on the event type (e.g., `gitlab.push`). These more specific events are what the builtin events support is expecting.

1. Add the GitLab events package:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gitlab
   ```

2. Add the GitLab events module to your Backstage backend:

   ```ts title="in packages/backend/src/index.ts"
   backend.add(import('@backstage/plugin-events-backend'));
   /* highlight-add-start */
   backend.add(import('@backstage/plugin-events-backend-module-gitlab'));
   /* highlight-add-end */
   ```

3. Configure the GitLab events module:

   ```yaml title="app-config.yaml"
   events:
     modules:
       gitlab:
         webhookSecret: ${GITLAB_WEBHOOK_SECRET}
   ```

Though this last step is technically optional, you'll want to include it to be sure the events being received are from GitLab and not from an external bad actor.

The value of `${GITLAB_WEBHOOK_SECRET}` in this example would be the same that you used when creating the webhook on GitLab.

### Events Setup using HTTP endpoint

Using the HTTP endpoint for events just requires adding some additional configuration to your `app-config.yaml` as it is a built in feature of the Events backend, here's what that would look like:

```yaml title="app-config.yaml"
events:
  http:
    topics:
      - gitlab
```

This will then expose an endpoint like this: <http://localhost/api/events/http/gitlab>

### Events Setup using AWS SQS module

Alternatively to using the HTTP endpoint you can use the AWS SQS module, here's how.

1. Add the AWS SQS events package:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugins-events-backend-module-aws-sqs
   ```

2. Add the AWS SQS events module to your Backstage backend:

   ```ts title="in packages/backend/src/index.ts"
   backend.add(import('@backstage/plugin-events-backend'));
   backend.add(import('@backstage/plugin-events-backend-module-gitlab'));
   /* highlight-add-start */
   backend.add(import('@backstage/plugins-events-backend-module-aws-sqs'));
   /* highlight-add-end */
   ```

3. Configure the AWS SQS events module:

   ```yaml title="app-config.yaml"
   events:
     modules:
       awsSqs:
         awsSqsConsumingEventPublisher:
           topics:
             gitlab:
               queue:
                 url: 'https://sqs.us-east-2.amazonaws.com/123456789012/MyQueue'
                 region: us-east-2
   ```

The [AWS SQS module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-aws-sqs/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

### Events Setup using Google Pub/Sub module

Alternatively to using the HTTP endpoint you can use the Google Pub/Sub module, here's how.

1. Add the Google Pub/Sub events package:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugin-events-backend-module-google-pubsub
   ```

2. Add the Google Pub/Sub events module to your Backstage backend:

   ```ts title="in packages/backend/src/index.ts"
   backend.add(import('@backstage/plugin-events-backend'));
   backend.add(import('@backstage/plugin-events-backend-module-gitlab'));
   /* highlight-add-start */
   backend.add(import('@backstage/plugin-events-backend-module-google-pubsub'));
   /* highlight-add-end */
   ```

3. Configure the Google Pub/Sub events module:

   ```yaml title="app-config.yaml"
   events:
     modules:
       googlePubSub:
         googlePubSubConsumingEventPublisher:
           subscriptions:
             # A unique key for your subscription, to be used in logging and metrics
             mySubscription:
               # The fully qualified name of the subscription
               subscriptionName: 'projects/my-google-project/subscriptions/gitlab-events'
               # The event system topic to transfer to. This can also be just a plain string
               targetTopic: 'gitlab.{{ event.attributes.x-gitlab-event }}'
   ```

The [Google Pub/Sub module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-google-pubsub/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

### Events Setup using Kafka module

Alternatively to using the HTTP endpoint you can use the Kafka module, here's how.

1. Add the Kafka events package:

   ```bash title="from your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugin-events-backend-module-kafka
   ```

2. Add the Kafka events module to your Backstage backend:

   ```ts title="in packages/backend/src/index.ts"
   backend.add(import('@backstage/plugin-events-backend'));
   backend.add(import('@backstage/plugin-events-backend-module-gitlab'));
   /* highlight-add-start */
   backend.add(import('@backstage/plugin-events-backend-module-kafka'));
   /* highlight-add-end */
   ```

3. Configure the Kafka events module:

   ```yaml title="app-config.yaml"
   events:
     modules:
       kafka:
         kafkaConsumingEventPublisher:
           # Client ID used by Backstage to identify when connecting to the Kafka cluster.
           clientId: your-client-id
           # List of brokers in the Kafka cluster to connect to.
           brokers:
             - broker1
             - broker2
           topics:
             # Replace with actual topic name as expected by subscribers
             - topic: 'backstage.topic'
               kafka:
                 # The Kafka topics to subscribe to.
                 topics:
                   - topic1
                 # The GroupId to be used by the topic consumers.
                 groupId: your-group-id
   ```

The [Kafka module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-kafka/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

## Configuration

To use the discovery provider, you'll need a GitLab integration
[set up](locations.md) with a `token`. Then you can add a provider config per group
to the catalog configuration.

:::note Note

The `schedule` has to be setup in the config, as shown below.

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
