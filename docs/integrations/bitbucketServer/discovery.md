---
id: discovery
title: Bitbucket Server Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket Server
---

The Bitbucket Server integration has a special entity provider for discovering
catalog files located in Bitbucket Server.
The provider will search your Bitbucket Server account and register catalog files matching the configured path
as Location entity and via following processing steps add all contained catalog entities.
This can be useful as an alternative to static locations or manually adding things to the catalog.

## Installation

You will have to add the entity provider in the catalog initialization code of your
backend. The provider is not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-bitbucket-server` to your backend
package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-bitbucket-server
```

And then add the entity provider to your catalog builder:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-start */
  builder.addEntityProvider(
    BitbucketServerEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
  );
  /* highlight-add-end */

  // ..
}
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
        schedule: # same options as in TaskScheduleDefinition
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
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.

## Custom location processing

The Bitbucket Server Entity Provider will by default emit a location for each
matching repository. However, it is possible to override this functionality and take full control of how each
matching repository is processed.

`BitbucketServerEntityProvider.fromConfig` takes an optional parameter
`options.parser` where you can set your own parser to be used for each matched
repository.

```typescript
const provider = BitbucketServerEntityProvider.fromConfig(env.config, {
  logger: env.logger,
  schedule: env.scheduler,
  parser: async function* customLocationParser(options: {
    location: LocationSpec;
    client: BitbucketServerClient;
  }) {
    // Custom logic for interpreting the matching repository
    // See defaultBitbucketServerLocationParser for an example
  },
});
```
