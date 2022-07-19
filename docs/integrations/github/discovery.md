---
id: discovery
title: GitHub Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in a GitHub organization
---

The GitHub integration has a discovery provider for discovering catalog
entities within a GitHub organization. The provider will crawl the GitHub
organization and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog. This is the prefered method for ingesting entities into the catalog.

## Provider Installation

You will have to add the provider in the catalog initialization code of your
backend. They are not installed by default, therefore you have to add a 
dependency on `@backstage/plugin-catalog-backend-module-github` to your backend
package

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-github
```

And then add the entity provider to your catalog builder:

```diff
  // In packages/backend/src/plugins/catalog.ts
+ import { GitHubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
+   builder.addEntityProvider(
+     GitHubEntityProvider.fromConfig(env.config, {
+       logger: env.logger,
+       schedule: env.scheduler.createScheduledTaskRunner({
+         frequency: { minutes: 30 },
+         timeout: { minutes: 3 },
+       }),
+     }),
+   );

    // [...]
  }
```

## Configuration

To use the discovery provider, you'll need a GitHub integration
[set up](locations.md) with either a [Personal Access Token](../../getting-started/configuration.md#setting-up-a-github-integration) or [GitHub Apps](./github-apps.md).

Then you can add a github config to the catalog providers configuration:

```yaml
catalog:
  providers:
    github:
      # the provider ID can be any camelCase string 
      providerId:
        target: https://github.com/myorg
      customProviderId:
        # Or use a custom pattern for a subset of all repositories with default repository
        target: https://github.com/otherorg/service-*/blob/-/catalog-info.yaml
      thirdProviderId:
        # Or use a custom file format and location 
        target: https://github.com/*/blob/-/docs/your-own-format.yaml
      fourthProvider:
        # Or use a specific branch-name
        target: https://github.com/*/blob/backstage-docs/catalog-info.yaml
```

This provider supports multiple organizations via unique provider IDs

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
rate limiting. You can change the refresh frequency of the catalog in your `packages/backend/src/plugins/catalog.ts` file:

```typescript       
schedule: env.scheduler.createScheduledTaskRunner({
  frequency: { minutes: 35 },
  timeout: { minutes: 3 },
}),
```

More information about scheduling can be found on the [TaskScheduleDefinition](https://backstage.io/docs/reference/backend-tasks.taskscheduledefinition) page.

Alternatively, or additionally, you can configure [github-apps](github-apps.md) authentication
which carries a much higher rate limit at GitHub.

This is true for any method of adding GitHub entities to the catalog, but
especially easy to hit with automatic discovery.
