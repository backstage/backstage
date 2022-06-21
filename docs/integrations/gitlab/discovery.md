---
id: discovery
title: GitLab Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in GitLab
---

The GitLab integration has a special entity provider for discovering catalog
entities from GitLab. The entity provider will crawl the GitLab instance and register
entities matching the configured paths. This can be useful as an alternative to
static locations or manually adding things to the catalog.

To use the discovery provider, you'll need a GitLab integration
[set up](locations.md) with a `token`. Then you can add a provider config per group
to the catalog configuration:

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab-host # Identifies one of the hosts set up in the integrations
        branch: main # Optional. Uses `master` as default
        group: example-group # Group and subgroup (if needed) to look for repositories
        entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
```

As this provider is not one of the default providers, you will first need to install
the gitlab catalog plugin:

```bash
# From the Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-gitlab
```

Once you've done that, you'll also need to add the segment below to `packages/backend/src/plugins/catalog.ts`:

```ts
/* packages/backend/src/plugins/catalog.ts */

import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
builder.addEntityProvider(
  ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

## Alternative processor

```yaml
catalog:
  locations:
    - type: gitlab-discovery
      target: https://gitlab.com/group/subgroup/blob/main/catalog-info.yaml
```

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

```diff
// In packages/backend/src/plugins/catalog.ts
+import { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(
+    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
+  );
```

If you don't want create location object if file with component definition do not exists in project, you can set the `skipReposWithoutExactFileMatch` option. That can reduce count of request to gitlab with 404 status code.
