---
id: migrating
title: Migrating your Backend to the New Backend System
sidebar_label: Migration Guide
# prettier-ignore
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

> NOTE: If you happen to be dealing with a service ref that does NOT have a
> default implementation, but rather has a separate service factory, then you
> will also need to import that factory and pass it to the `services` array
> argument of `createBackend`.

## Cleaning Up the Plugins Folder

For plugins that are private and your own, you can follow a [dedicated migration guide](../building-plugins-and-modules/08-migrating.md) as you see fit, at a
later time.

For third party backend plugins, in particular the larger core plugins that are
maintained by the Backstage maintainers, you may find that they have already
been migrated to the new backend system. This section describes some specific
such migrations you can make.

> NOTE: For each of these, note that your backend still needs to have a
> dependency (e.g. in `packages/backend/package.json`) to those plugin packages,
> and they still need to be configured properly in your app-config. Those
> mechanisms still work just the same as they used to in the old backend system.

### The App Plugin

The app backend plugin that serves the frontend from the backend can trivially
be used in its new form.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-next-line */
backend.add(import('@backstage/plugin-app-backend/alpha'));
```

If you need to override the app package name, which otherwise defaults to `"app"`,
you can do so via the `app.packageName` configuration key.

You should be able to delete the `plugins/app.ts` file at this point.

### The Catalog Plugin

A basic installation of the catalog plugin looks as follows.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-aws/alpha'));
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-azure/alpha'));
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-cloud/alpha'),
);
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-catalog-backend-module-bitbucket-server/alpha'),
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gcp'));
/* highlight-add-end */
```

Configuration in app-config.yaml remains the same.

#### Gerrit

To migrate `GerritEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-gerrit`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gerrit/alpha'));
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

#### Github

For `GithubDiscoveryProcessor`, `GithubMultiOrgReaderProcessor` and `GithubOrgReaderProcessor`, first migrate to the equivalent Entity Provider.

To migrate `GithubEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-github`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Github configuration in `app-config.yaml` remains the same.

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

To migrate `GithubMultiOrgEntityProvider` and `GithubOrgEntityProvider` to the new backend system, add a reference to `@backstage/plugin-catalog-backend-module-github-org`.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github-org'));
/* highlight-add-end */
```

If you were providing a `schedule` in code, this now needs to be set via configuration.
All other Github configuration in `app-config.yaml` remains the same.

```yaml title="app-config.yaml"
catalog:
  providers:
    githubOrg:
      yourProviderId:
        # ...
        /* highlight-add-start */
        schedule:
          frequency: PT30M
          timeout: PT3M
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph/alpha'));
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
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
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
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
/* highlight-add-next-line */
backend.add(catalogModuleCustomExtensions());
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
        events.addSubscribers(new MySubscriber()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-events-backend'));
/* highlight-add-next-line */
backend.add(eventsModuleCustomExtensions());
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn --cwd packages/backend add @backstage/plugin-events-node
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
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
```

With the new Backend System version of the Scaffolder plugin, any provider specific actions will need to be installed separately.
For example - GitHub actions are now collected under the `@backstage/plugin-scaffolder-backend-module-github` package.

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));

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
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomExtensions());
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
            - resolver: emailMatchingUserEntityAnnotation
            - resolver: emailMatchingUserEntityProfileEmail
            - resolver: emailLocalPartMatchingUserEntityName
```

> Note: the resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

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

##### GCP IAM

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
