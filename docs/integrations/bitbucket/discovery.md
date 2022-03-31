---
id: discovery
title: Bitbucket Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket
---

The Bitbucket integration has a special discovery processor for discovering
catalog entities located in Bitbucket. The processor will crawl your Bitbucket
account and register entities matching the configured path. This can be useful
as an alternative to static locations or manually adding things to the catalog.

## Installation

You will have to add the processor in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket` to your backend
package.

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-bitbucket
```

And then add the processor to your catalog builder:

```diff
// In packages/backend/src/plugins/catalog.ts
+import { BitbucketDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-bitbucket';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(
+    BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger })
+  );
```

## Self-hosted Bitbucket Server

To use the discovery processor with a self-hosted Bitbucket Server, you'll need
a Bitbucket integration [set up](locations.md) with a `BITBUCKET_TOKEN` and a
`BITBUCKET_API_BASE_URL`. Then you can add a location target to the catalog
configuration:

```yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: https://bitbucket.mycompany.com/projects/my-project/repos/service-*/catalog-info.yaml
```

Note the `bitbucket-discovery` type, as this is not a regular `url` processor.

The target is composed of four parts:

- The base instance URL, `https://bitbucket.mycompany.com` in this case
- The project key to scan, which accepts \* wildcard tokens. This can simply be
  `*` to scan repositories from all projects. This example only scans for
  repositories in the `my-project` project.
- The repository blob to scan, which accepts \* wildcard tokens. This can simply
  be `*` to scan all repositories in the project. This example only looks for
  repositories prefixed with `service-`.
- The path within each repository to find the catalog YAML file. This will
  usually be `/catalog-info.yaml` or a similar variation for catalog files
  stored in the root directory of each repository. If omitted, the default value
  `catalog-info.yaml` will be used. E.g. given that `my-project`and `service-a`
  exists, `https://bitbucket.mycompany.com/projects/my-project/repos/service-*/`
  will result in:
  `https://bitbucket.mycompany.com/projects/my-project/repos/service-a/catalog-info.yaml`.

## Bitbucket Cloud

To use the discovery processor with Bitbucket Cloud, you'll need a Bitbucket
integration [set up](locations.md) with a `username` and an `appPassword`. Then
you can add a location target to the catalog configuration:

```yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: https://bitbucket.org/workspaces/my-workspace
```

Note the `bitbucket-discovery` type, as this is not a regular `url` processor.

The target is composed of the following parts:

- The base URL for Bitbucket, `https://bitbucket.org`
- The workspace name to scan (following the `workspaces/` path part), which must
  match a workspace accessible with the username of your integration.
- (Optional) The project key to scan (following the `projects/` path part),
  which accepts \* wildcard tokens. If omitted, repositories from all projects
  in the workspace are included.
- (Optional) The repository blob to scan (following the `repos/` path part),
  which accepts \* wildcard tokens. If omitted, all repositories in the
  workspace are included.
- (Optional) The `catalogPath` query argument to specify the location within
  each repository to find the catalog YAML file. This will usually be
  `/catalog-info.yaml` or a similar variation for catalog files stored in the
  root directory of each repository. If omitted, the default value
  `catalog-info.yaml` will be used.
- (Optional) The `q` query argument to be passed through to Bitbucket for
  filtering results via the API. This is the most flexible option and will
  reduce the amount of API calls if you have a large workspace.
  [See here for the specification](https://developer.atlassian.com/bitbucket/api/2/reference/meta/filtering)
  for the query argument (will be passed as the `q` query parameter).
- (Optional) The `search=true` query argument to activate the mode utilizing code search.
  - Is mutually exclusive to the `q` query argument.
  - Allows providing values at `catalogPath` for finding catalog files as allowed by the `path` filter/modifier
    [at Bitbucket Cloud's code search](https://confluence.atlassian.com/bitbucket/code-search-in-bitbucket-873876782.html#Search-Pathmodifier).
    - `catalogPath=/catalog-info.yaml`
    - `catalogPath=catalog-info.yaml` (anywhere in the repository)
    - `catalogPath=/path/catalog-info.yaml`
    - `catalogPath=path/catalog-info.yaml`
    - `catalogPath=/path/*/catalog-info.yaml`
    - `catalogPath=path/*/catalog-info.yaml`
  - Supports multiple catalog files per repository depending on the `catalogPath` value.
  - Registers `Location` entities for existing files only vs all matching repositories.

Examples:

- `https://bitbucket.org/workspaces/my-workspace/projects/my-project` will find
  all repositories in the `my-project` project in the `my-workspace` workspace.
- `https://bitbucket.org/workspaces/my-workspace/repos/service-*` will find all
  repositories starting with `service-` in the `my-workspace` workspace.
- `https://bitbucket.org/workspaces/my-workspace/projects/apis-*/repos/service-*`
  will find all repositories starting with `service-`, in all projects starting
  with `apis-` in the `my-workspace` workspace.
- `https://bitbucket.org/workspaces/my-workspace?q=project.key ~ "my-project"`
  will find all repositories in a project containing `my-project` in its key.
- `https://bitbucket.org/workspaces/my-workspace?catalogPath=my/nested/path/catalog.yaml`
  will find all repositories in the `my-workspace` workspace and use the catalog
  file at `my/nested/path/catalog.yaml`.
- `https://bitbucket.org/workspaces/my-workspace?search=true&catalogPath=/catalog.yaml`
  will find all `catalog.yaml` files located in the root of repositories in the workspace `my-workspace`.
- `https://bitbucket.org/workspaces/my-workspace?search=true&catalogPath=catalog.yaml`
  will find all `catalog.yaml` files located anywhere within repositories in the workspace `my-workspace`.
- `https://bitbucket.org/workspaces/my-workspace?search=true&catalogPath=/my/nested/path/catalog.yaml`
  will find all `catalog.yaml` files located within the directory `/my/nested/path/` within
  repositories in the workspace `my-workspace`.
- `https://bitbucket.org/workspaces/my-workspace?search=true&catalogPath=my/nested/path/catalog.yaml`
  will find all `catalog.yaml` files located within the directory `my/nested/path/` located anywhere within
  repositories in the workspace `my-workspace`.
- `https://bitbucket.org/workspaces/my-workspace?search=true&catalogPath=/my/*/path/catalog.yaml`
  will find all `catalog.yaml` files located within a directory `path/` located within any (recursive) directory
  within the directory `my/` in the root of repositories in the workspace `my-workspace`
  (`/my/nested/path/catalog.yaml`, `/my/very/nested/path/catalog.yaml`, ...).
- `https://bitbucket.org/workspaces/my-workspace/projects/apis-*/repos/service-*?search=true&catalogPath=catalog.yaml`
  will find all `catalog.yaml` files located anywhere within repositories starting with `service-`
  in projects starting with `api-` in the workspace `my-workspace`.

## Custom repository processing

The Bitbucket Discovery Processor will by default emit a location for each
matching repository for further processing by other processors. However, it is
possible to override this functionality and take full control of how each
matching repository is processed.

`BitbucketDiscoveryProcessor.fromConfig` takes an optional parameter
`options.parser` where you can set your own parser to be used for each matched
repository.

```typescript
const processor = BitbucketDiscoveryProcessor.fromConfig(env.config, {
  parser: async function* customRepositoryParser({ client, repository }) {
    // Custom logic for interpreting the matching repository.
    // See defaultRepositoryParser for an example
  },
  logger: env.logger,
});
```
