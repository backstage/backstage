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

And then add the entity provider to your catalog builder:

```diff
  // In packages/backend/src/plugins/catalog.ts
+ import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
+   builder.addEntityProvider(
+     BitbucketCloudEntityProvider.fromConfig(env.config, {
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
        workspace: workspace-name
```

> **Note:** It is possible but certainly not recommended to skip the provider ID level.
> If you do so, `default` will be used as provider ID.

- **catalogPath** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  When started with `/`, it is an absolute path from the repo root.
  It supports values as allowed by the `path` filter/modifier
  [at Bitbucket Cloud's code search](https://confluence.atlassian.com/bitbucket/code-search-in-bitbucket-873876782.html#Search-Pathmodifier).
- **filters** _(optional)_:
  - **projectKey** _(optional)_:
    Regular expression used to filter results based on the project key.
  - **repoSlug** _(optional)_:
    Regular expression used to filter results based on the repo slug.
- **workspace**:
  Name of your organization account/workspace.
  If you want to add multiple workspaces, you need to add one provider config each.

## Alternative

_Deprecated!_ Please raise issues for use cases not covered by the entity provider.

[You can use the `BitbucketDiscoveryProcessor`.](../bitbucket/discovery.md#bitbucket-cloud)
