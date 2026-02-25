---
id: migrating
title: Migrating your Backend to the New Backend System
sidebar_label: Migration Guide
description: How to migrate existing backends to the new backend system
---

## Overview

This section describes how to migrate an existing Backstage backend service
package (typically in `packages/backend`) to use the new backend system.

One of the main benefits of the new backend system is that it abstracts away the
way that plugins and their dependencies are wired up, leading to a significantly
simplified backend package that rarely if ever needs to change when plugins or
their dependencies evolve. You generally don't have to convert all of your
internal plugins and support classes themselves to the backend system first -
the migration here will mostly deal with wiring and using compatibility wrappers
where possible in the backend package itself. We hope that you will find that
you end up with a much smaller, easier to understand, and easier to maintain
package as a result of these steps, and then being able to [migrate plugins](../building-plugins-and-modules/08-migrating.md) as a separate
endeavour later.

## Overall Structure

Your typical backend package has a few overall component parts:

- An `index.ts` file that houses all of the creation and wiring together of all
  of the plugins and their dependencies
- A `types.ts` file that defines the "environment", i.e. the various
  dependencies that get created by the backend and passed down into each plugin
- A `plugins` folder which has one file for each plugin, e.g.
  `plugins/catalog.ts`

The index file has this overall shape:

```ts
import todo from './plugins/todo'; // repeated for N plugins

function makeCreateEnv(config: Config) {
  return (plugin: string): PluginEnvironment => {
    // ... build per-plugin environment
  };
}

async function main() {
  // ... early init
  const createEnv = makeCreateEnv(config);
  const todoEnv = useHotMemoize(module, () => createEnv('todo')); // repeated for N plugins
  const apiRouter = Router();
  apiRouter.use('/todo', await todo(todoEnv)); // repeated for N plugins
  // ... wire up and start http server
}

module.hot?.accept();
main().catch(...);
```

## Migrating the Index File

This migration will try to leave the `plugins` folder unchanged initially, first
focusing on removing the environment type and reducing the index file to its
bare minimum. Then as a later step, we can reduce the `plugins` folder bit by
bit, replacing those files generally with one-liners in the index file instead.

Let's start by establishing the basis of your new index file. You may want to
comment out its old contents, or renaming the old file to `index.backup.ts` for
reference and making a new blank one to work on - whichever works best for you.
These are our new blank contents in the index file:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.start();
```

Note that the environment builder and the `main` dance are entirely gone.

We'll also want to add some backend system packages as dependencies. Run the
following command:

```bash
# from the repository root
yarn --cwd packages/backend add @backstage/backend-defaults @backstage/backend-plugin-api
```

You should now be able to start this up with the familiar `yarn workspace
backend start` command locally and seeing some logs scroll by. But it'll just be
a blank service with no real features added. So let's stop it with `Ctrl+C` and
reintroduce some plugins into the mix.

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
/* highlight-add-next-line */
import { legacyPlugin } from '@backstage/backend-common';

const backend = createBackend();
/* highlight-add-next-line */
backend.add(legacyPlugin('todo', import('./plugins/todo')));
backend.start();
```

The `todo` plugin used above is just an example and you may not have it enabled
in your own backend. Feel free to change it to some other plugin that you
actually have in your `plugins` folder, for example
`backend.add(legacyPlugin('catalog', import('./plugins/catalog')))`.

The `legacyPlugin` helper makes it easy to bridge the gap between the old-style
plugin files and the new backend system. It ensures that the dependencies that
you used to have to declare by hand in your env are gathered behind the scenes,
then passes them into the relevant `createPlugin` export function, and makes
sure that the route handler it returns is passed into the HTTP router with the
given prefix.

## Handling Custom Environments

In the simple case, what we did above is sufficient, TypeScript is happy, and
the backend runs with the new feature. If they do, feel free to skip this entire
section, and delete `types.ts`.

Sometimes though, type errors can be reported on the newly added line, saying
that parts of the `PluginEnvironment` type do not match. This happens when the
environment was changed from the defaults, perhaps with your own custom
additions. If this is the case in your installation, you still aren't out of
luck - you can build a customized `legacyPlugin` function.

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
/* highlight-remove-next-line */
import { legacyPlugin } from '@backstage/backend-common';
/* highlight-add-start */
import {
  makeLegacyPlugin,
  loggerToWinstonLogger,
} from '@backstage/backend-common';
import { coreServices } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const legacyPlugin = makeLegacyPlugin(
  {
    cache: coreServices.cache,
    config: coreServices.rootConfig,
    database: coreServices.database,
    discovery: coreServices.discovery,
    logger: coreServices.logger,
    permissions: coreServices.permissions,
    scheduler: coreServices.scheduler,
    tokenManager: coreServices.tokenManager,
    reader: coreServices.urlReader,
    identity: coreServices.identity,
    // ... and your own additions
  },
  {
    logger: log => loggerToWinstonLogger(log),
  },
);
/* highlight-add-end */

const backend = createBackend();
backend.add(legacyPlugin('todo', import('./plugins/todo')));
backend.start();
```

The first argument to `makeLegacyPlugin` is the mapping from environment keys to
references to actual [backend system services](../architecture/03-services.md).
The second argument allows you to "tweak" the types of those services to
something more fitting to your env. For example, you'll see that the logger
service API type was changed from the raw Winston logger of old, to a different,
custom API, so we use a helper function to transform that particular one.

To make additions as mentioned above to the environment, you will start to get
into the weeds of how the backend system wiring works. You'll need to have a
service reference and a service factory that performs the actual creation of
your service. Please see [the services article](../architecture/03-services.md)
to learn how to create a service ref and its default factory. You can place that
code directly in the index file for now if you want, or near the actual implementation
class in question.

In this example, we'll assume that your added environment field is named
`example`, and the created ref is named `exampleServiceRef`.

```ts title="packages/backend/src/index.ts"
/* highlight-add-next-line */
import { exampleServiceRef } from '<somewhere>'; // if the definition is elsewhere

const legacyPlugin = makeLegacyPlugin(
  {
    // ... the above core services still go here
    /* highlight-add-next-line */
    example: exampleServiceRef,
  },
  {
    logger: log => loggerToWinstonLogger(log),
  },
);
```

After this, your backend will know how to instantiate your thing on demand and
place it in the legacy plugin environment.

:::note Note

If you happen to be dealing with a service ref that does NOT have a
default implementation, but rather has a separate service factory, then you
will also need to import that factory and pass it to the `services` array
argument of `createBackend`.

:::

## Removing `@backstage/backend-common`

The `@backstage/backend-common` package has been deprecated as part of moving to the new backend system, and you will need to replace existing usage of it. All exports from the package have been marked as deprecated in the last few releases of the package, and each export has its own deprecation message that explains how to replace that particular export.

These are the deprecation messages for the most common replacements:

- `createLegacyAuthAdapters` - Migrate to use the new backend system and auth services instead.
- `errorHandler` - Use `MiddlewareFactory.create.error` from `@backstage/backend-defaults/rootHttpRouter` instead.
- `getRootLogger` - This function will be removed in the future. If you need to get the root logger in the new system, please check out this documentation: https://backstage.io/docs/backend-system/core-services/logger
- `getVoidLogger` - This function will be removed in the future. If you need to mock the root logger in the new system, please use `mockServices.logger.mock()` from `@backstage/backend-test-utils` instead.
- `legacyPlugin` - Fully use the new backend system instead.
- `loadBackendConfig` - Please migrate to the new backend system and use `coreServices.rootConfig` instead, or the [@backstage/config-loader#ConfigSources](https://backstage.io/api/stable/classes/_backstage_config-loader.ConfigSources.html) facilities if required.
- `loggerToWinstonLogger` - Migrate to use the new `LoggerService` instead.
- `resolveSafeChildPath` - This function is deprecated and will be removed in a future release, see [#24493](https://github.com/backstage/backstage/issues/24493). Please use the `resolveSafeChildPath` function from the `@backstage/backend-plugin-api` package instead.
- `ServerTokenManager` - Please [migrate](https://backstage.io/docs/tutorials/auth-service-migration) to the new `coreServices.auth`, `coreServices.httpAuth`, and `coreServices.userInfo` services as needed instead.
- `useHotMemoize` - Hot module reloading is no longer supported for backends.

If you want to browse all of the deprecations in one place you can look at the `dist/index.d.ts` file in the package, either in `node_modules/@backstage/backend-common/dist/index.d.ts` in your own project, or it can found in the [code tab on npmjs.com](https://www.npmjs.com/package/@backstage/backend-common?activeTab=code).

## Cleaning Up the Plugins Folder

For plugins that are private and your own, you can follow a [dedicated migration guide](../building-plugins-and-modules/08-migrating.md) as you see fit, at a
later time.

For third party backend plugins, in particular the larger core plugins that are
maintained by the Backstage maintainers, you may find that they have already
been migrated to the new backend system. This section describes some specific
such migrations you can make.

:::note Note

For each of these, note that your backend still needs to have a
dependency (e.g. in `packages/backend/package.json`) to those plugin packages,
and they still need to be configured properly in your app-config. Those
mechanisms still work just the same as they used to in the old backend system.

:::

### The App Plugin

The app backend plugin that serves the frontend from the backend can trivially
be used in its new form.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-app-backend'));
```

If you need to override the app package name, which otherwise defaults to `"app"`,
you can do so via the `app.packageName` configuration key.

You should be able to delete the `plugins/app.ts` file at this point.

### The Catalog Plugin

A basic installation of the catalog plugin looks as follows.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
/* highlight-add-end */
```

Note that this also installs the scaffolder module for the catalog, which
enables the use of the `Template` kind. In the event that you do not
use templates at all, you can remove that line.

If you have other customizations made to `plugins/catalog.ts`, such as adding
custom processors or entity providers, read on. Otherwise, you should be able to
just delete that file at this point.

#### Amazon Web Services

`AwsEksClusterProcessor` and `AwsOrganizationCloudAccountProcessor` have not yet been migrated to the new backend system.
See [Other Catalog Extensions](#other-catalog-extensions) for how to use these in the new backend system.

For `AwsS3DiscoveryProcessor`, first migrate to `AwsS3EntityProvider`.

To migrate `AwsS3EntityProvider` to the new backend system, add a reference to the `@backstage/plugin-catalog-backend-module-aws` module.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-aws'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other AWS configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    awsS3:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT1H
          timeout: PT50M
        /* highlight-add-end */
```

#### Azure DevOps

For `AzureDevOpsDiscoveryProcessor`, first migrate to `AzureDevOpsEntityProvider`.

To migrate `AzureDevOpsEntityProvider` to the new backend system, add a reference to the `@backstage/plugin-catalog-backend-module-azure` module.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-azure'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Azure DevOps configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    azureDevOps:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT1H
          timeout: PT50M
        /* highlight-add-end */
```

#### Open API

`InternalOpenApiDocumentationProvider` has not yet been migrated to the new backend system.
See [Other Catalog Extensions](#other-catalog-extensions) for how to use this in the new backend system.

#### Bitbucket

For `BitbucketDiscoveryProcessor`, migrate to `BitbucketCloudEntityProvider` or `BitbucketServerEntityProvider`

To migrate `BitbucketCloudEntityProvider` to the new backend system, add a reference to the `@backstage/plugin-catalog-backend-module-bitbucket-cloud` module.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-bitbucket-cloud'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Bitbucket Cloud configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    bitbucketCloud:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT30M
          timeout: PT3M
        /* highlight-add-end */
```

To migrate `BitbucketServerEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-bitbucket-server`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-server'),
);
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Bitbucket Server configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    bitbucketServer:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT30M
          timeout: PT3M
        /* highlight-add-end */
```

#### Google Cloud Platform

To migrate `GkeEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-gcp`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gcp'));
/* highlight-add-end */
```

Configuration in app-config.yaml remains the same.

#### Gerrit

To migrate `GerritEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-gerrit`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gerrit'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Gerrit configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    gerrit:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT30M
          timeout: PT3M
        /* highlight-add-end */
```

#### GitHub

For `GithubDiscoveryProcessor`, `GithubMultiOrgReaderProcessor` and `GithubOrgReaderProcessor`, first migrate to the equivalent Entity Provider.

To migrate `GithubEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-github`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other GitHub configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    github:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT30M
          timeout: PT3M
        /* highlight-add-end */
```

To migrate `GithubMultiOrgEntityProvider` or `GithubOrgEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-github-org`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
/* highlight-add-end */
```

##### GithubOrgEntityProvider

If you were using `GithubOrgEntityProvider` you might have been configured in code like this:

```ts title="packages/backend/src/plugins/catalog.ts"
// The org URL below needs to match a configured integrations.github entry
// specified in your app-config.
builder.addEntityProvider(
  GithubOrgEntityProvider.fromConfig(env.config, {
    id: 'production',
    orgUrl: 'https://github.com/backstage',
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 60 },
      timeout: { minutes: 15 },
    }),
  }),
);
```

This now needs to be set via configuration. The options defined above are now set in `app-config.yaml` instead as shown below:

```yaml title="app-config.yaml"
catalog:
  /* highlight-add-start */
  providers:
    githubOrg:
      - id: production
        githubUrl: 'https://github.com'
        orgs: ['backstage']
        schedule:
          frequency: PT30M
          timeout: PT15M
          /* highlight-add-end */
```

##### GithubMultiOrgEntityProvider

If you were using `GithubMultiOrgEntityProvider` you might have been configured in code like this:

```ts title="packages/backend/src/plugins/catalog.ts"
// The GitHub URL below needs to match a configured integrations.github entry
// specified in your app-config.
builder.addEntityProvider(
  GithubMultiOrgEntityProvider.fromConfig(env.config, {
    id: 'production',
    githubUrl: 'https://github.com',
    // Set the following to list the GitHub orgs you wish to ingest from. You can
    // also omit this option to ingest all orgs accessible by your GitHub integration
    orgs: ['org-a', 'org-b'],
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 60 },
      timeout: { minutes: 15 },
    }),
  }),
);
```

This now needs to be set via configuration. The options defined above are now set in `app-config.yaml` instead as shown below:

```yaml title="app-config.yaml"
catalog:
  /* highlight-add-start */
  providers:
    githubOrg:
      - id: production
        githubUrl: 'https://github.com'
        orgs: ['org-a', 'org-b']
        schedule:
          frequency: PT30M
          timeout: PT15M
          /* highlight-add-end */
```

If you were providing transformers, these can be configured by extending `githubOrgEntityProviderTransformsExtensionPoint`

```ts title="packages/backend/src/index.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-github-org';

backend.add(
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'githubOrgTransformers',
    register(env) {
      env.registerInit({
        deps: {
          /* highlight-add-start */
          githubOrgTransformers:
            githubOrgEntityProviderTransformsExtensionPoint,
          /* highlight-add-end */
        },
        async init({ githubOrgTransformers }) {
          /* highlight-add-start */
          githubOrgTransformers.setUserTransformer(myUserTransformer);
          githubOrgTransformers.setTeamTransformer(myTeamTransformer);
          /* highlight-add-end */
        },
      });
    },
  }),
);
```

#### Microsoft Graph

For `MicrosoftGraphOrgReaderProcessor`, first migrate to `MicrosoftGraphOrgEntityProvider`

To migrate `MicrosoftGraphOrgEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-msgraph`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Microsoft Graph configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    microsoftGraphOrg:
      provider:
        /* highlight-add-start */
        schedule:
          frequency: PT4H
          timeout: PT30M
        /* highlight-add-end */
```

If you were providing transformers, these can be configured by extending `microsoftGraphOrgEntityProviderTransformExtensionPoint`

```ts title="packages/backend/src/index.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { microsoftGraphOrgEntityProviderTransformExtensionPoint } from '@backstage/plugin-catalog-backend-module-msgraph/alpha';

backend.add(
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'microsoft-graph-extensions',
    register(env) {
      env.registerInit({
        deps: {
          /* highlight-add-start */
          microsoftGraphTransformers:
            microsoftGraphOrgEntityProviderTransformExtensionPoint,
          /* highlight-add-end */
        },
        async init({ microsoftGraphTransformers }) {
          /* highlight-add-start */
          microsoftGraphTransformers.setUserTransformer(myUserTransformer);
          microsoftGraphTransformers.setGroupTransformer(myGroupTransformer);
          microsoftGraphTransformers.setOrganizationTransformer(
            myOrganizationTransformer,
          );
          /* highlight-add-end */
        },
      });
    },
  }),
);
```

#### Other Catalog Extensions

You will use the [extension points](../architecture/05-extension-points.md)
mechanism to extend or tweak the functionality of the plugin. To do that,
you'll make your own bespoke [module](../architecture/06-modules.md) which
depends on the appropriate extension point and interacts with it.

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const catalogModuleCustomExtensions = createBackendModule({
  pluginId: 'catalog', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ catalog /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        catalog.addEntityProvider(new MyEntityProvider()); // just an example
        catalog.addProcessor(new MyProcessor()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
/* highlight-add-next-line */
backend.add(catalogModuleCustomExtensions);
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn --cwd packages/backend add @backstage/plugin-catalog-node
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.

### The Events Plugin

A basic installation of the events plugin looks as follows.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-events-backend'));
```

If you have other customizations made to `plugins/events.ts`, such as adding
custom subscribers, read on. Otherwise, you should be able to just delete that
file at this point.

You will use the [extension points](../architecture/05-extension-points.md)
mechanism to extend or tweak the functionality of the plugin. To do that,
you'll make your own bespoke [module](../architecture/06-modules.md) which
depends on the appropriate extension point and interacts with it.

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const eventsModuleCustomExtensions = createBackendModule({
  pluginId: 'events', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ events /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        events.addHttpPostIngress({
          // ...
        });
      },
    });
  },
});
/* highlight-add-end */

/* highlight-add-start */
const otherPluginModuleCustomExtensions = createBackendModule({
  pluginId: 'other-plugin', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsServiceRef,
        // ... and other dependencies as needed
      },
      async init({ events /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-events-backend'));
/* highlight-add-next-line */
backend.add(eventsModuleCustomExtensions);
/* highlight-add-next-line */
backend.add(otherPluginModuleCustomExtensions);
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.

### The Scaffolder Plugin

A basic installation of the scaffolder plugin looks as follows.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-scaffolder-backend'));
```

With the new Backend System version of the Scaffolder plugin, any provider specific actions will need to be installed separately.
For example - GitHub actions are now collected under the `@backstage/plugin-scaffolder-backend-module-github` package.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend'));

/* highlight-add-next-line */
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
```

And of course you'll need to install those separately as well.

```bash
# from the repository root
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-github
```

You can find a list of the available modules under the [plugins directory](https://github.com/backstage/backstage/tree/master/plugins) in the monorepo.

If you have other customizations made to `plugins/scaffolder.ts`, such as adding
custom actions, read on. Otherwise, you should be able to just delete that file
at this point.

You will use the [extension points](../architecture/05-extension-points.md)
mechanism to extend or tweak the functionality of the plugin. To do that,
you'll make your own bespoke [module](../architecture/06-modules.md) which
depends on the appropriate extension point and interacts with it.

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ scaffolder /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        scaffolder.addActions(new MyAction()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend'));
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomExtensions);
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn --cwd packages/backend add @backstage/plugin-scaffolder-node
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.

### The Auth Plugin

A basic installation of the auth plugin with a Microsoft provider will look as follows.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
/* highlight-add-end */
```

An additional step you'll need to take is to add the resolvers to your configuration, here's an example:

```yaml title:"app-config.yaml"
auth:
  environment: development
  providers:
    microsoft:
      development:
        clientId: ${AZURE_CLIENT_ID}
        clientSecret: ${AZURE_CLIENT_SECRET}
        tenantId: ${AZURE_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

#### Auth Plugin Modules and Their Resolvers

As you may have noticed in the above example you'll need to import the `auth-backend` and an `auth-backend-module`. The following sections outline each of them and their resolvers.

All of the following modules include the following common resolvers:

- [emailMatchingUserEntityProfileEmail](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-node/src/sign-in/commonSignInResolvers.ts#L29)
- [emailLocalPartMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-node/src/sign-in/commonSignInResolvers.ts#L54)

##### Atlassian

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-atlassian-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [usernameMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-atlassian-provider/src/resolvers.ts#L33C16-L33C46)

##### GCP IAP (Google Identity-Aware Proxy)

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-gcp-iap-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [emailMatchingUserEntityAnnotation](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-gcp-iap-provider/src/resolvers.ts#L32C16-L32C49)

##### GitHub

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [usernameMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-github-provider/src/resolvers.ts#L33C16-L33C46)

##### GitLab

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-gitlab-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [usernameMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-gitlab-provider/src/resolvers.ts#L33C16-L33C46)

##### Google

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [emailMatchingUserEntityAnnotation](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-google-provider/src/resolvers.ts#L33C16-L33C49)

##### Microsoft

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [emailMatchingUserEntityAnnotation](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-microsoft-provider/src/resolvers.ts#L33C16-L33C49)

##### oauth2

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-oauth2-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [usernameMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-oauth2-provider/src/resolvers.ts#L33C16-L33C46)

##### oauth2 Proxy

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(
  import('@backstage/plugin-auth-backend-module-oauth2-proxy-provider'),
);
/* highlight-add-end */
```

Additional resolvers:

- [forwardedUserMatchingUserEntityName](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-oauth2-proxy-provider/src/resolvers.ts#L27C16-L27C51)

##### Okta

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-okta-provider'));
/* highlight-add-end */
```

Additional resolvers:

- [emailMatchingUserEntityAnnotation](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-okta-provider/src/resolvers.ts#L34C16-L34C49)

##### Pinniped

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-pinniped-provider'));
/* highlight-add-end */
```

##### VMware Cloud

Setup:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(
  import('@backstage/plugin-auth-backend-module-vmware-cloud-provider'),
);
/* highlight-add-end */
```

Additional resolvers:

- [vmwareCloudSignInResolvers](https://github.com/backstage/backstage/blob/5447cffd23cf00772988fb799ced0ec5e54efb2e/plugins/auth-backend-module-vmware-cloud-provider/src/resolvers.ts#L29C18-L29C44)

#### Custom Resolver

You may have a case where the common resolvers or the ones that are included with the auth module you use won't work for your needs. In this case you will need to create a custom resolver. Instead of the 2nd import for your auth provider module you would provide your own:

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
export const authModuleGoogleProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'googleProvider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'google',
          factory: createOAuthProviderFactory({
            authenticator: googleAuthenticator,
            async signInResolver(info, ctx) {
              // custom resolver ...
            },
          }),
        });
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(authModuleGoogleProvider);
/* highlight-add-end */
```

#### Using Legacy Providers

Not all authentication providers have been refactored to support the new backend system. If your authentication provider module is not available yet, you will need to import your backend auth plugin using the legacy helper:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';
/* highlight-add-next-line */
import { legacyPlugin } from '@backstage/backend-common';
import { coreServices } from '@backstage/backend-plugin-api';

const backend = createBackend();
/* highlight-remove-next-line */
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-next-line */
backend.add(legacyPlugin('auth', import('./plugins/auth')));

backend.start();
```

> You can track the progress of the module migration efforts [here](https://github.com/backstage/backstage/issues/19476).

### The Search Plugin

A basic installation of the Search plugin will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
/* highlight-add-end */
```

:::note Note

This will use the Lunr search engine which stores its index in memory.

:::

#### Search Engines

The following sections outline how you can add other Search engines than the default lunr engine.

##### Postgres

An installation of the Search plugin using the Postgres search engine will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));
/* highlight-add-end */
```

##### Elasticsearch

A basic installation of the Search plugin using the Elasticsearch search engine will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-elasticsearch'));
/* highlight-add-end */
```

#### Search Collators

The following sections outline how you add search collators (input sources for the search indexing process).

##### Catalog

A basic installation of the Search plugin with the Catalog collator will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
/* highlight-add-end */
```

##### TechDocs

A basic installation of the Search plugin with the TechDocs collator will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
/* highlight-add-end */
```

### The Permission Plugin

A basic installation of the Permission plugin will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
/* highlight-add-end */
```

:::note Note

The above example includes a default allow-all policy. If that is not what you want, do not add the second line and instead investigate one of the options below.

:::

#### Custom Permission Policy

In order to add your own permission policy you'll need to do the following:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    // TODO: Add code here that inspects the incoming request and user, and returns AuthorizeResult.ALLOW, AuthorizeResult.DENY, or AuthorizeResult.CONDITIONAL as needed. See the docs at https://backstage.io/docs/permissions/writing-a-policy for more information

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

const customPermissionBackendModule = createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CustomPermissionPolicy());
      },
    });
  },
});

const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(customPermissionBackendModule);
/* highlight-add-end */
```

### The TechDocs Plugin

A basic installation of the TechDocs plugin will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-techdocs-backend'));
/* highlight-add-end */
```

### The Kubernetes Plugin

A basic installation of the Kubernetes plugin will look as follows:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-kubernetes-backend'));
/* highlight-add-end */
```

### The Plugins in Backstage Repo

The vast majority of the backend plugins that currently live in the Backstage Repo have been migrated and their respective `README`s have details on how they should be installed using the New Backend System.

| Package                                                            | Role                  | Migrated | Uses Alpha Export | Link to `README`                                                                                                                                  |
| ------------------------------------------------------------------ | --------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| @backstage-community/plugin-adr-backend                            | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/adr/plugins/adr-backend/README.md)                                 |
| @backstage-community/plugin-airbrake-backend                       | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/airbrake/plugins/airbrake-backend/README.md)                       |
| @backstage/plugin-app-backend                                      | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/app-backend/README.md)                                                        |
| @backstage/plugin-auth-backend                                     | backend-plugin        | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend/README.md)                                                       |
| @backstage/plugin-auth-backend-module-atlassian-provider           | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-atlassian-provider/README.md)                             |
| @backstage/plugin-auth-backend-module-aws-alb-provider             | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-aws-alb-provider/README.md)                               |
| @backstage/plugin-auth-backend-module-gcp-iap-provider             | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-gcp-iap-provider/README.md)                               |
| @backstage/plugin-auth-backend-module-github-provider              | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-github-provider/README.md)                                |
| @backstage/plugin-auth-backend-module-gitlab-provider              | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-gitlab-provider/README.md)                                |
| @backstage/plugin-auth-backend-module-google-provider              | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-google-provider/README.md)                                |
| @backstage/plugin-auth-backend-module-guest-provider               | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-guest-provider/README.md)                                 |
| @backstage/plugin-auth-backend-module-microsoft-provider           | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-microsoft-provider/README.md)                             |
| @backstage/plugin-auth-backend-module-oauth2-provider              | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-oauth2-provider/README.md)                                |
| @backstage/plugin-auth-backend-module-oauth2-proxy-provider        | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-oauth2-proxy-provider/README.md)                          |
| @backstage/plugin-auth-backend-module-oidc-provider                | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-oidc-provider/README.md)                                  |
| @backstage/plugin-auth-backend-module-okta-provider                | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-okta-provider/README.md)                                  |
| @backstage/plugin-auth-backend-module-pinniped-provider            | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-pinniped-provider/README.md)                              |
| @backstage/plugin-auth-backend-module-vmware-cloud-provider        | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-vmware-cloud-provider/README.md)                          |
| @backstage-community/plugin-azure-devops-backend                   | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/azure-devops/plugins/azure-devops-backend/README.md)               |
| @backstage-community/plugin-azure-sites-backend                    | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/azure-sites/plugins/azure-sites-backend/README.md)                 |
| @backstage-community/plugin-badges-backend                         | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/badges/plugins/badges-backend/README.md)                           |
| @backstage-community/plugin-bazaar-backend                         | backend-plugin        | true     | true              | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/bazaar/plugins/bazaar-backend/README.md)                           |
| @backstage/plugin-catalog-backend                                  | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/README.md)                                                    |
| @backstage/plugin-catalog-backend-module-aws                       | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-aws/README.md)                                         |
| @backstage/plugin-catalog-backend-module-azure                     | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-azure/README.md)                                       |
| @backstage/plugin-catalog-backend-module-backstage-openapi         | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-backstage-openapi/README.md)                           |
| @backstage/plugin-catalog-backend-module-bitbucket-cloud           | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-bitbucket-cloud/README.md)                             |
| @backstage/plugin-catalog-backend-module-bitbucket-server          | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-bitbucket-server/README.md)                            |
| @backstage/plugin-catalog-backend-module-gcp                       | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-gcp/README.md)                                         |
| @backstage/plugin-catalog-backend-module-gerrit                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-gerrit/README.md)                                      |
| @backstage/plugin-catalog-backend-module-github                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-github/README.md)                                      |
| @backstage/plugin-catalog-backend-module-github-org                | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-github-org/README.md)                                  |
| @backstage/plugin-catalog-backend-module-gitlab                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-gitlab/README.md)                                      |
| @backstage/plugin-catalog-backend-module-incremental-ingestion     | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-incremental-ingestion/README.md)                       |
| @backstage/plugin-catalog-backend-module-ldap                      | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-ldap/README.md)                                        |
| @backstage/plugin-catalog-backend-module-msgraph                   | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md)                                     |
| @backstage/plugin-catalog-backend-module-openapi                   | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-openapi/README.md)                                     |
| @backstage/plugin-catalog-backend-module-puppetdb                  | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-puppetdb/README.md)                                    |
| @backstage/plugin-catalog-backend-module-scaffolder-entity-model   | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-scaffolder-entity-model/README.md)                     |
| @backstage/plugin-catalog-backend-module-unprocessed               | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-unprocessed/README.md)                                 |
| @backstage-community/plugin-code-coverage-backend                  | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/code-coverage/plugins/code-coverage-backend/README.md)             |
| @backstage/plugin-devtools-backend                                 | backend-plugin        | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/devtools-backend/README.md)                                                   |
| @backstage-community/plugin-entity-feedback-backend                | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/entity-feedback/plugins/entity-feedback-backend/README.md)         |
| @backstage/plugin-events-backend                                   | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend/README.md)                                                     |
| @backstage/plugin-events-backend-module-aws-sqs                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-aws-sqs/README.md)                                      |
| @backstage/plugin-events-backend-module-azure                      | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-azure/README.md)                                        |
| @backstage/plugin-events-backend-module-bitbucket-cloud            | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-bitbucket-cloud/README.md)                              |
| @backstage/plugin-events-backend-module-gerrit                     | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gerrit/README.md)                                       |
| @backstage/plugin-events-backend-module-github                     | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-github/README.md)                                       |
| @backstage/plugin-events-backend-module-gitlab                     | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md)                                       |
| @internal/plugin-todo-list-backend                                 | backend-plugin        | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list-backend/README.md)                                          |
| @backstage-community/plugin-explore-backend                        | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/explore/plugins/explore-backend/README.md)                         |
| @backstage-community/plugin-jenkins-backend                        | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/jenkins/plugins/jenkins-backend/README.md)                         |
| @backstage-community/plugin-kafka-backend                          | backend-plugin        | true     | true              | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/kafka/plugins/kafka-backend/README.md)                             |
| @backstage/plugin-kubernetes-backend                               | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/kubernetes-backend/README.md)                                                 |
| @backstage-community/plugin-lighthouse-backend                     | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/lighthouse/plugins/lighthouse-backend/README.md)                   |
| @backstage-community/plugin-linguist-backend                       | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/linguist/plugins/linguist-backend/README.md)                       |
| @backstage-community/plugin-nomad-backend                          | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/nomad/plugins/nomad-backend/README.md)                             |
| @backstage/plugin-notifications-backend                            | backend-plugin        | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/notifications-backend/README.md)                                              |
| @backstage-community/plugin-periskop-backend                       | backend-plugin        | true     | true              | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/periskop/plugins/periskop-backend/README.md)                       |
| @backstage/plugin-permission-backend                               | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/permission-backend/README.md)                                                 |
| @backstage/plugin-permission-backend-module-allow-all-policy       | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/permission-backend-module-policy-allow-all/README.md)                         |
| @backstage-community/plugin-playlist-backend                       | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/playlist/plugins/playlist-backend/README.md)                       |
| @backstage/plugin-proxy-backend                                    | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/proxy-backend/README.md)                                                      |
| @backstage-community/plugin-rollbar-backend                        | backend-plugin        |          |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/rollbar/plugins/rollbar-backend/README.md)                         |
| @backstage/plugin-scaffolder-backend                               | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/README.md)                                                 |
| @backstage/plugin-scaffolder-backend-module-azure                  | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-azure/README.md)                                    |
| @backstage/plugin-scaffolder-backend-module-bitbucket              | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-bitbucket/README.md)                                |
| @backstage/plugin-scaffolder-backend-module-bitbucket-cloud        | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-bitbucket-cloud/README.md)                          |
| @backstage/plugin-scaffolder-backend-module-bitbucket-server       | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-bitbucket-server/README.md)                         |
| @backstage/plugin-scaffolder-backend-module-confluence-to-markdown | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-confluence-to-markdown/README.md)                   |
| @backstage/plugin-scaffolder-backend-module-cookiecutter           | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-cookiecutter/README.md)                             |
| @backstage/plugin-scaffolder-backend-module-gerrit                 | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-gerrit/README.md)                                   |
| @backstage/plugin-scaffolder-backend-module-gitea                  | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-gitea/README.md)                                    |
| @backstage/plugin-scaffolder-backend-module-github                 | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-github/README.md)                                   |
| @backstage/plugin-scaffolder-backend-module-gitlab                 | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-gitlab/README.md)                                   |
| @backstage/plugin-scaffolder-backend-module-rails                  | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-rails/README.md)                                    |
| @backstage/plugin-scaffolder-backend-module-sentry                 | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-sentry/README.md)                                   |
| @backstage/plugin-scaffolder-backend-module-yeoman                 | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend-module-yeoman/README.md)                                   |
| @backstage/plugin-search-backend                                   | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend/README.md)                                                     |
| @backstage/plugin-search-backend-module-catalog                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-catalog/README.md)                                      |
| @backstage/plugin-search-backend-module-elasticsearch              | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-elasticsearch/README.md)                                |
| @backstage/plugin-search-backend-module-explore                    | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-explore/README.md)                                      |
| @backstage/plugin-search-backend-module-pg                         | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-pg/README.md)                                           |
| @backstage/plugin-search-backend-module-stack-overflow-collator    | backend-plugin-module | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-stack-overflow-collator/README.md)                      |
| @backstage/plugin-search-backend-module-techdocs                   | backend-plugin-module | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-techdocs/README.md)                                     |
| @backstage/plugin-signals-backend                                  | backend-plugin        | true     |                   | [README](https://github.com/backstage/backstage/blob/master/plugins/signals-backend/README.md)                                                    |
| @backstage-community/plugin-sonarqube-backend                      | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/sonarqube/plugins/sonarqube-backend/README.md)                     |
| @backstage-community/plugin-stack-overflow-backend                 | backend-plugin        |          |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/stack-overflow/plugins/stack-overflow-backend/README.md)           |
| @backstage-community/plugin-tech-insights-backend                  | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/tech-insights/plugins/tech-insights-backend/README.md)             |
| @backstage-community/plugin-tech-insights-backend-module-jsonfc    | backend-plugin-module | true     |                   | [README](https://github.com/backstage/community-plugins/blob/main/workspaces/tech-insights/plugins/tech-insights-backend-module-jsonfc/README.md) |
| @backstage/plugin-techdocs-backend                                 | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/README.md)                                                   |
| @backstage-community/plugin-todo-backend                           | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/todo/plugins/todo-backend/README.md)                               |
| @backstage/plugin-user-settings-backend                            | backend-plugin        | true     | true              | [README](https://github.com/backstage/backstage/blob/master/plugins/user-settings-backend/README.md)                                              |
| @backstage-community/plugin-vault-backend                          | backend-plugin        | true     |                   | [README](https://github.com/backstage/community-plugins/blob/master/workspaces/vault/plugins/vault-backend/README.md)                             |
