---
id: migrating
title: Migrating your Backend to the New Backend System
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate existing backends to the new backend system
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. As such, it is not considered stable, and it is not recommended to migrate production backends to the new backend system until it has a stable release.**

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
package as a result of these steps, and then being able to [migrate
plugins](../building-plugins-and-modules/08-migrating.md) as a separate
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
yarn add --cwd packages/backend @backstage/backend-defaults @backstage/backend-plugin-api
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
section, and deleting `types.ts`.

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
import { makeLegacyPlugin, loggerToWinstonLogger } from '@backstage/backend-common';
import { coreServices } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const legacyPlugin = makeLegacyPlugin(
  {
    cache: coreServices.cache,
    config: coreServices.config,
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
your service. Please see [the services
article](../architecture/03-services.md#defining-a-service) to learn how to
create a service ref and its default factory. You can place that code directly
in the index file for now if you want, or near the actual implementation class
in question.

In this example, we'll assume that your added environment field is named
`example`, and the created ref is named `exampleServiceRef`.

```ts title="packages/backend/src/index.ts"
/* highlight-add-next-line */
import { exampleServiceRef } from '<somewhere>'; // if the definition is elsewhere

 const legacyPlugin = makeLegacyPlugin(
   {
     // ... the above core services still go here
     /* highlight-add-next-line */
    example: exampleServiceRef
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

For plugins that are private and your own, you can follow a [dedicated migration
guide](../building-plugins-and-modules/08-migrating.md) as you see fit, at a
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
/* highlight-add-next-line */
import { appPlugin } from '@backstage/plugin-app-backend';

const backend = createBackend();
/* highlight-add-next-line */
backend.add(appPlugin({ appPackageName: 'app' }));
```

This is an example of how options can be passed into some backend plugins. The
app plugin specifically needs to know the name of the package that holds the
frontend code. This is the `"name"` field in that package's `package.json`,
typically found in your `packages/app` folder. By default it's just plain "app".

You should be able to delete the `plugins/app.ts` file at this point.

### The Catalog Plugin

A basic installation of the catalog plugin looks as follows.

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { catalogModuleTemplateKind } from '@backstage/plugin-scaffolder-backend';
/* highlight-add-end */

const backend = createBackend();
/* highlight-add-start */
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
/* highlight-add-end */
```

Note that this also installs a module from the scaffolder, namely the one which
enables the use of the `Template` kind. In the unlikely event that you do not
use templates at all, you can remove those lines.

If you have other customizations made to `plugins/catalog.ts`, such as adding
custom processors or entity providers, read on. Otherwise, you should be able to
just delete that file at this point.

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
  pluginId: 'catalog',  // name of the plugin that the module is targeting
  moduleId: 'customExtensions',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        // ... and other dependencies as needed
      },
      init({ catalog /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        catalog.addEntityProvider(new MyEntityProvider()); // just an example
        catalog.addProcessor(new MyProcessor());           // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
/* highlight-add-next-line */
backend.add(catalogModuleCustomExtensions());
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn add --cwd packages/backend @backstage/plugin-catalog-node
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.

### The Events Plugin

A basic installation of the events plugin looks as follows.

```ts title="packages/backend/src/index.ts"
/* highlight-add-next-line */
import { eventsPlugin } from '@backstage/plugin-events-backend';

const backend = createBackend();
/* highlight-add-next-line */
backend.add(eventsPlugin());
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
import { eventsExtensionPoint } from '@backstage/plugin-events-node';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const eventsModuleCustomExtensions = createBackendModule({
  pluginId: 'events',  // name of the plugin that the module is targeting
  moduleId: 'customExtensions',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsExtensionPoint,
        // ... and other dependencies as needed
      },
      init({ events /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        events.addSubscribers(new MySubscriber()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(eventsPlugin());
/* highlight-add-next-line */
backend.add(eventsModuleCustomExtensions());
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn add --cwd packages/backend @backstage/plugin-events-node
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.

### The Scaffolder Plugin

A basic installation of the scaffolder plugin looks as follows.

```ts title="packages/backend/src/index.ts"
/* highlight-add-next-line */
import { scaffolderPlugin } from '@backstage/plugin-scaffolder-backend';

const backend = createBackend();
/* highlight-add-next-line */
backend.add(scaffolderPlugin());
```

If you have other customizations made to `plugins/scaffolder.ts`, such as adding
custom actions, read on. Otherwise, you should be able to just delete that file
at this point.

You will use the [extension points](../architecture/05-extension-points.md)
mechanism to extend or tweak the functionality of the plugin. To do that,
you'll make your own bespoke [module](../architecture/06-modules.md) which
depends on the appropriate extension point and interacts with it.

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder',  // name of the plugin that the module is targeting
  moduleId: 'customExtensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        // ... and other dependencies as needed
      },
      init({ scaffolder /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        scaffolder.addActions(new MyAction()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(scaffolderPlugin());
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomExtensions());
```

This also requires that you have a dependency on the corresponding node package,
if you didn't already have one.

```bash
# from the repository root
yarn add --cwd packages/backend @backstage/plugin-scaffolder-node
```

Here we've placed the module directly in the backend index file just to get
going easily, but feel free to move it out to where it fits best. As you migrate
your entire plugin flora to the new backend system, you will probably make more
and more of these modules as "first class" things, living right next to the
implementations that they represent, and being exported from there.
