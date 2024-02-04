---
id: discovery
title: GitHub Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in a GitHub organization
---

## GitHub Provider

The GitHub integration has a discovery provider for discovering catalog
entities within a GitHub organization. The provider will crawl the GitHub
organization and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog. This is the preferred method for ingesting entities into the catalog.

## Installation without Events Support

You will have to add the provider in the catalog initialization code of your
backend. They are not installed by default, therefore you have to add a
dependency on `@backstage/plugin-catalog-backend-module-github` to your backend
package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-github
```

And then add the entity provider to your catalog builder:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  builder.addEntityProvider(
    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
  );
  /* highlight-add-end */

  // ..
}
```

## Installation with Events Support

Please follow the installation instructions at

- <https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md>
- <https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md>

Additionally, you need to decide how you want to receive events from external sources like

- [via HTTP endpoint](https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md)
- [via an AWS SQS queue](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md)

Set up your provider

```ts title="packages/backend/src/plugins/catalog.ts"
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
/* highlight-add-next-line */
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  /* highlight-add-start */
  const githubProvider = GithubEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    scheduler: env.scheduler,
  });
  env.eventBroker.subscribe(githubProvider);
  builder.addEntityProvider(githubProvider);
  /* highlight-add-end */
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```

You can check the official docs to [configure your webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks) and to [secure your request](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks). The webhook will need to be configured to forward `push` events.

## Configuration

To use the discovery provider, you'll need a GitHub integration
[set up](locations.md) with either a [Personal Access Token](../../getting-started/configuration.md#setting-up-a-github-integration) or [GitHub Apps](./github-apps.md).

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

## GitHub Processor (To Be Deprecated)

The GitHub integration has a special discovery processor for discovering catalog
entities within a GitHub organization. The processor will crawl the GitHub
organization and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog.

## Installation

You will have to add the processors in the catalog initialization code of your
backend. They are not installed by default, therefore you have to add a
dependency on `@backstage/plugin-catalog-backend-module-github` to your backend
package, plus `@backstage/integration` for the basic credentials management:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/integration @backstage/plugin-catalog-backend-module-github
```

And then add the processors to your catalog builder:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-start */
import {
  GithubDiscoveryProcessor,
  GithubOrgReaderProcessor,
} from '@backstage/plugin-catalog-backend-module-github';
import {
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
} from '@backstage/integration';
/* highlight-add-end */

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  const integrations = ScmIntegrations.fromConfig(env.config);
  const githubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);
  builder.addProcessor(
    GithubDiscoveryProcessor.fromConfig(env.config, {
      logger: env.logger,
      githubCredentialsProvider,
    }),
    GithubOrgReaderProcessor.fromConfig(env.config, {
      logger: env.logger,
      githubCredentialsProvider,
    }),
  );
  /* highlight-add-end */

  // ..
}
```

## Configuration

To use the discovery processor, you'll need a GitHub integration
[set up](locations.md) with either a [Personal Access Token](../../getting-started/configuration.md#setting-up-a-github-integration) or [GitHub Apps](./github-apps.md).

Then you can add a location target to the catalog configuration:

```yaml
catalog:
  locations:
    # (since 0.13.5) Scan all repositories for a catalog-info.yaml in the root of the default branch
    - type: github-discovery
      target: https://github.com/myorg
    # Or use a custom pattern for a subset of all repositories with default repository
    - type: github-discovery
      target: https://github.com/myorg/service-*/blob/-/catalog-info.yaml
    # Or use a custom file format and location
    - type: github-discovery
      target: https://github.com/*/blob/-/docs/your-own-format.yaml
    # Or use a specific branch-name
    - type: github-discovery
      target: https://github.com/*/blob/backstage-docs/catalog-info.yaml
```

Note the `github-discovery` type, as this is not a regular `url` processor.

When using a custom pattern, the target is composed of three parts:

- The base organization URL, `https://github.com/myorg` in this case
- The repository blob to scan, which accepts \* wildcard tokens. This can simply
  be `*` to scan all repositories in the organization. This example only looks
  for repositories prefixed with `service-`.
- The path within each repository to find the catalog YAML file. This will
  usually be `/blob/main/catalog-info.yaml`, `/blob/master/catalog-info.yaml` or
  a similar variation for catalog files stored in the root directory of each
  repository. You could also use a dash (`-`) for referring to the default
  branch.

## GitHub API Rate Limits

GitHub [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) API requests to 5,000 per hour (or more for Enterprise
accounts). The default Backstage catalog backend refreshes data every 100
seconds, which issues an API request for each discovered location.

This means if you have more than ~140 catalog entities, you may get throttled by
rate limiting. You can change the refresh rate of the catalog in your `packages/backend/src/plugins/catalog.ts` file:

```typescript
const builder = await CatalogBuilder.create(env);

// For example, to refresh every 5 minutes (300 seconds).
builder.setProcessingIntervalSeconds(300);
```

Alternatively, or additionally, you can configure [github-apps](github-apps.md) authentication
which carries a much higher rate limit at GitHub.

This is true for any method of adding GitHub entities to the catalog, but
especially easy to hit with automatic discovery.
