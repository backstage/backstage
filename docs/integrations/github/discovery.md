---
id: discovery
title: GitHub Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in a GitHub organization
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./discovery--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

## GitHub Provider

The GitHub integration has a discovery provider for discovering catalog
entities within a GitHub organization. The provider will crawl the GitHub
organization and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog. This is the preferred method for ingesting entities into the catalog.

## Installation

You will have to add the GitHub Entity provider to your backend as it is not installed by default, therefore you have to add a
dependency on `@backstage/plugin-catalog-backend-module-github` to your backend
package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-github
```

And then update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
```

## Events Support

The catalog module for GitHub comes with events support enabled.
This will make it subscribe to its relevant topics (`github.push`)
and expects these events to be published via the `EventsService`.

Additionally, you should install the
[event router by `events-backend-module-github`](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md)
which will route received events from the generic topic `github` to more specific ones
based on the event type (e.g., `github.push`).

In order to receive Webhook events by GitHub, you have to decide how you want them
to be ingested into Backstage and published to its `EventsService`.
You can decide between the following options (extensible):

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

You can check the official docs to [configure your webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks) and to [secure your request](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks). The webhook will need to be configured to forward `push` events.

## Configuration

To use the discovery provider, you'll need a GitHub integration
[set up](locations.md) with either a [Personal Access Token](../../getting-started/config/authentication.md) or [GitHub Apps](./github-apps.md). For Personal Access Tokens you should pay attention to the [required scopes](https://backstage.io/docs/integrations/github/locations/#token-scopes), where you will need at least the `repo` scope for reading components. For GitHub Apps you will need to grant it the [required permissions](https://backstage.io/docs/integrations/github/github-apps#app-permissions) instead, where you will need at least the `Contents: Read-only` permissions for reading components.

Then you can add a `github` config to the catalog providers configuration:

```yaml
catalog:
  providers:
    github:
      # the provider ID can be any camelCase string
      providerId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
        schedule: # same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
      customProviderId:
        organization: 'new-org' # string
        catalogPath: '/custom/path/catalog-info.yaml' # string
        filters: # optional filters
          branch: 'develop' # optional string
          repository: '.*' # optional Regex
      wildcardProviderId:
        organization: 'new-org' # string
        catalogPath: '/groups/**/*.yaml' # this will search all folders for files that end in .yaml
        filters: # optional filters
          branch: 'develop' # optional string
          repository: '.*' # optional Regex
      topicProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
          topic: 'backstage-exclude' # optional string
      topicFilterProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
          topic:
            include: ['backstage-include'] # optional array of strings
            exclude: ['experiments'] # optional array of strings
      validateLocationsExist:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
        validateLocationsExist: true # optional boolean
      visibilityProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          visibility:
            - public
            - internal
      enterpriseProviderId:
        host: ghe.example.net
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
```

This provider supports multiple organizations via unique provider IDs.

> **Note:** It is possible but certainly not recommended to skip the provider ID level.
> If you do so, `default` will be used as provider ID.

- **`catalogPath`** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  You can use wildcards - `*` or `**` - to search the path and/or the filename.
  Wildcards cannot be used if the `validateLocationsExist` option is set to `true`.
- **`filters`** _(optional)_:
  - **`branch`** _(optional)_:
    String used to filter results based on the branch name.
    Defaults to the default Branch of the repository.
  - **`repository`** _(optional)_:
    Regular expression used to filter results based on the repository name.
  - **`topic`** _(optional)_:
    Both of the filters below may be used at the same time but the exclusion filter has the highest priority.
    In the example above, a repository with the `backstage-include` topic would still be excluded
    if it were also carrying the `experiments` topic.
    - **`include`** _(optional)_:
      An array of strings used to filter in results based on their associated GitHub topics.
      If configured, only repositories with one (or more) topic(s) present in the inclusion filter will be ingested
    - **`exclude`** _(optional)_:
      An array of strings used to filter out results based on their associated GitHub topics.
      If configured, all repositories _except_ those with one (or more) topics(s) present in the exclusion filter will be ingested.
  - **`visibility`** _(optional)_:
    An array of strings used to filter results based on their visibility. Available options are `private`, `internal`, `public`. If configured (non empty), only repositories with visibility present in the filter will be ingested
- **`host`** _(optional)_:
  The hostname of your GitHub Enterprise instance. It must match a host defined in [integrations.github](locations.md).
- **`organization`**:
  Name of your organization account/workspace.
  If you want to add multiple organizations, you need to add one provider config each.
- **`validateLocationsExist`** _(optional)_:
  Whether to validate locations that exist before emitting them.
  This option avoids generating locations for catalog info files that do not exist in the source repository.
  Defaults to `false`.
  Due to limitations in the GitHub API's ability to query for repository objects, this option cannot be used in
  conjunction with wildcards in the `catalogPath`.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.

## GitHub API Rate Limits

GitHub [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) API requests to 5,000 per hour (or more for Enterprise
accounts). The snippet below refreshes the Backstage catalog data every 35 minutes, which issues an API request for each discovered location.

If your requests are too frequent then you may get throttled by
rate limiting. You can change the refresh frequency of the catalog in your `app-config.yaml` file by controlling the `schedule`.

```yaml
schedule:
  frequency: { minutes: 35 }
  timeout: { minutes: 3 }
```

More information about scheduling can be found on the [TaskScheduleDefinition](https://backstage.io/docs/reference/backend-tasks.taskscheduledefinition) page.

Alternatively, or additionally, you can configure [github-apps](github-apps.md) authentication
which carries a much higher rate limit at GitHub.

This is true for any method of adding GitHub entities to the catalog, but
especially easy to hit with automatic discovery.
