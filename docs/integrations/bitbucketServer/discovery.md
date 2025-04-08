---
id: discovery
title: Bitbucket Server Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket Server
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./discovery--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Bitbucket Server integration has a special entity provider for discovering
catalog files located in Bitbucket Server.
The provider will search your Bitbucket Server account and register catalog files matching the configured path
as Location entity and via following processing steps add all contained catalog entities.
This can be useful as an alternative to static locations or manually adding things to the catalog.

## Installation

You will have to add the entity provider in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket-server` to your backend package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-bitbucket-server
```

And update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-server'),
);
/* highlight-add-end */
```

## Configuration

To use the entity provider, you'll need a [Bitbucket Server integration set up](locations.md).

Additionally, you need to configure your entity provider instance(s):

```yaml title="app-config.yaml"
catalog:
  providers:
    bitbucketServer:
      yourProviderId: # identifies your ingested dataset
        host: 'bitbucket.mycompany.com'
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '^apis-.*$' # optional; RegExp
          repoSlug: '^service-.*$' # optional; RegExp
          skipArchivedRepos: true # optional; boolean
        schedule: # same options as in SchedulerServiceTaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

- **`host`**:
  The host of the Bitbucket Server instance, **note**: the host needs to registered as an integration as well, see [location](locations.md).
- **`catalogPath`** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  When started with `/`, it is an absolute path from the repo root.
- **`filters`** _(optional)_:
  - **`projectKey`** _(optional)_:
    Regular expression used to filter results based on the project key.
  - **`repoSlug`** _(optional)_:
    Regular expression used to filter results based on the repo slug.
  - **`skipArchivedRepos`** _(optional)_:
    Boolean flag to filter out archived repositories.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.
