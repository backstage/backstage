---
id: migrating
title: Migrating your Backend to the New Backend System
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate existing backends to the new backend system
---

# Overview

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

# Overall Structure

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
  // ... return composite router
}

module.hot?.accept();
main().catch(...);
```

# Migrating the Index File

This migration will try to leave the `plugins` folder unchanged initially, first
focusing on removing the environment type and reducing the index file to its
bare minimum. Then as a later step, we can reduce the `plugins` folder bit by
bit, replacing those files generally with one-liners in the index file instead.

Let's start by establishing the basis of your new index file. You may want to
comment out its old contents, or renaming the old file to `index.backup.ts` for
reference and making a new blank one to work on - whichever works best for you.
These are our new blank contents in the index file:

```ts
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.start();
```

Note that the environment builder and the `main` dance are entirely gone.

We'll also want to add some backend system packages as dependencies. Run the
following command:

```bash
# from the repository root
yarn add --cwd packages/backend @backstage/backend-common @backstage/backend-defaults @backstage/backend-plugin-api
```

You should now be able to start this up with the familiar `yarn workspace
backend start` command locally and seeing some logs scroll by. But it'll just be
a blank service with no real features added. So let's stop it with `Ctrl+C` and
reintroduce some plugins into the mix.

```diff
 import { createBackend } from '@backstage/backend-defaults';
+import { legacyPlugin } from '@backstage/backend-common';

 const backend = createBackend();
+backend.add(legacyPlugin('todo', import('./plugins/todo')));
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

# Handling Custom Environments

In the simple case, what we did above is sufficient, TypeScript is happy, and
the backend runs with the new feature. If they do, feel free to skip this entire
section.

Sometimes though, type errors can be reported on the newly added line, saying
that parts of the `PluginEnvironment` type do not match. This happens when the
environment was changed from the defaults, perhaps with your own custom
additions. If this is the case in your installation, you still aren't out of
luck - you can build a customized `legacyPlugin` function.

```diff
 import { createBackend } from '@backstage/backend-defaults';
-import { legacyPlugin } from '@backstage/backend-common';
+import { makeLegacyPlugin, loggerToWinstonLogger } from '@backstage/backend-common';
+import { coreServices } from '@backstage/backend-plugin-api';

+const legacyPlugin = makeLegacyPlugin(
+  {
+    cache: coreServices.cache,
+    config: coreServices.config,
+    database: coreServices.database,
+    discovery: coreServices.discovery,
+    logger: coreServices.logger,
+    permissions: coreServices.permissions,
+    scheduler: coreServices.scheduler,
+    tokenManager: coreServices.tokenManager,
+    reader: coreServices.urlReader,
+    identity: coreServices.identity,
+    // ... and your own additions
+  },
+  {
+    logger: log => loggerToWinstonLogger(log),
+  },
+);

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
service reference, and a service factory that performs the actual creation of
your service. For now, let's add them directly in the same file, and then you
can move them out into a separate file at a later time.

In this example, we'll assume that your added environment item is named "example".

```diff
-import { coreServices } from '@backstage/backend-plugin-api';
+import { coreServices, createServiceFactory } from '@backstage/backend-plugin-api';
+import { ExampleApi, ExampleImpl } from '<somewhere>';

+const exampleServiceRef = createServiceRef<ExampleApi>({
+  id: 'example',
+  scope: 'plugin', // can be 'root' or 'plugin'
+  defaultFactory: async service => createServiceFactory({
+    service,
+    // optional; just an example of how dependencies work
+    deps: {
+      logger: coreServices.logger,
+    },
+    // here instances of the declared dependencies are injected
+    async factory({ logger }) {
+      // return your ExampleImpl
+    },
+  }),
+});

 const legacyPlugin = makeLegacyPlugin(
   {
     // ... the above core services still go here
+    example: exampleServiceRef
   },
   {
     logger: log => loggerToWinstonLogger(log),
   },
 );
```

After this, your backend will know how to instantiate your thing on demand.

# Cleaning Up the Plugins Folder

For plugins that are private and your own, you can follow a [dedicated migration
guide](../building-plugins-and-modules/08-migrating.md) as you see fit, at a
later time.

For third party backend plugins, in particular the larger core plugins that are
maintained by the Backstage maintainers, you may find that they have already
been migrated to the new backend system. Let's try to clean up the `plugins`
folder a bit.

Each plugin file is under your control, and it was added as part of following
their installation instructions. You were then free to start tweaking those
files and adding customizations. The simplest case is when you did NOT perform
any customizations at all. For those plugins, you can in general just delete the
corresponding file in the `plugins` folder, and instead importing the backend
plugin from the package directly.

```diff
 import { createBackend } from '@backstage/backend-defaults';
 import { legacyPlugin } from '@backstage/backend-common';
+import { catalogPlugin } from '@backstage/plugin-catalog-backend';

 const backend = createBackend();
 backend.add(legacyPlugin('todo', import('./plugins/todo')));
+backend.add(catalogPlugin());
 backend.start();
```

This will install a fully functioning catalog backend plugin, in its default
state (not amended with any custom processors or providers, for example). You
still need to have the `@backstage/plugin-catalog-backend` dependency in your
`package.json`. You also need to have your app-config set up properly like
before; that subsystem works the same as it used to even though its
instantiation now happens behind the scenes.

You can now delete `plugins/catalog.ts`.
