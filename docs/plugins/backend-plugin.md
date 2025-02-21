---
id: backend-plugin
title: Backend plugins
description: Creating and Developing Backend plugins
---

This page describes the process of creating and managing backend plugins in your
Backstage repository.

## Creating a Backend Plugin

A new, bare-bones backend plugin package can be created by issuing the following
command in your Backstage repository root and selecting `backend-plugin`:

```sh
yarn new
```

You will be asked to supply a name for the plugin. This is an identifier that
will be part of the NPM package name, so make it short and containing only
lowercase characters separated by dashes, for example `carmen`, if it's a
package that adds an integration with a system named Carmen, for example. The
full NPM package name would then be something like
`@internal/plugin-carmen-backend`, depending on the other flags passed to the
`new` command, and your settings for the `new` command in
your root `package.json`.

Creating the plugin will take a little while, so be patient. It will helpfully
run the initial installation and build commands, so that your package is ready
to be hacked on! It will be located in a new folder in your `plugins` directory,
in this example `plugins/carmen-backend`.

For simple development purposes, a backend plugin can actually be started in a
standalone mode. You can do a first-light test of your service:

```sh
cd plugins/carmen-backend
yarn start
```

:::note Note

This documentation assumes you are using the latest version of Backstage and the new backend system. If you are not, please upgrade and migrate your backend using the [Migration Guide](../backend-system/building-backends/08-migrating.md)

:::

This will think for a bit, and then say `Listening on :7007`. In a different
terminal window, now run

```sh
curl localhost:7007/api/carmen/health
```

This should return `{"status":"ok"}`. Success! Press `Ctrl + c` to stop it
again.

## Developing your Backend Plugin

A freshly created backend plugin does basically nothing, in terms of the overall
app. It has a small set of basic dependencies and exposes an Express router in
`src/service/router.ts`. This is where you will start adding routes and
connecting those to actual underlying functionality. But nothing in your
Backstage application / backend exposes it.

To actually attach and run the plugin router, you will make some modifications
to your backend.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @internal/plugin-carmen-backend@^0.1.0 # Change this to match the plugin's package.json
```

Update `packages/backend/src/index` with the following,

```ts
const backend = createBackend();

// ...

// highlight-add-next-line
backend.add(import('@internal/plugin-carmen-backend'));

// ...

backend.start();
```

After you start the backend (e.g. using `yarn start-backend` from the repo
root), you should be able to fetch data from it.

```sh
# Note the extra /api here
curl localhost:7007/api/carmen/health
```

This should return `{"status":"ok"}` like before. Success!

## Secure by Default

In 1.25, Backstage started moving to a secure by default model for plugins. This means that network requests to plugins will by default not allow unauthenticated users. Let's take a deeper look at the above curl request which should allow unauthenticated access.

The actual endpoint that is being called is defined in

```ts title="plugins/carmen-backend/src/service/router.ts"
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  // ...

  // highlight-start
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });
  // highlight-end

  // ...
  return router;
}
```

You'll notice that there is no authentication mechanism defined here, just the route name and response data. That's because the authentication is handled in your plugin definition,

```ts title="plugins/carmen-backend/src/plugin.ts"
httpRouter.use(
  await createRouter({
    logger,
  }),
);
// highlight-start
httpRouter.addAuthPolicy({
  path: '/health',
  allow: 'unauthenticated',
});
// highlight-end
```

This allows requests to this plugin's `/health` endpoint to go through unauthenticated!

## Using Dependencies

In the new backend, dependencies are defined statically during registration and then "injected" during initialization. Here's an example of what this looks like,

```ts title="plugins/carmen-backend/src/plugin.ts"

// highlight-start
deps: {
  httpRouter: coreServices.httpRouter,
  logger: coreServices.logger,
},
// highlight-end
// And then you can use them through the options property!
// highlight-next-line
async init({ httpRouter, logger }) {
    // ...
},

```

You can add your own dependencies by adding a named item to the `deps` parameter:

```ts
deps: {
  // highlight-next-line
  myDependency: coreServices.rootConfig,
},
```

And then you can access it by referencing it in the `init` block of your plugin definition,

```ts
async init({ myDependency }) {
   // ..
}
```

And then you're free to call it and pass it into your router as needed.

Backstage provides a bunch of `coreServices` out of box, see the more in depth docs [here](../backend-system/core-services/01-index.md).

## Making Use of a Database

The Backstage backend comes with a builtin facility for SQL database access.
Most plugins that have persistence needs will choose to make use of this
facility, so that Backstage operators can manage database needs uniformly.

You can access this by adding a dependency on the `coreServices.database` service.
That will give you a [Knex](http://knexjs.org/) connection object.

```ts title="plugins/carmen-backend/src/plugin.ts"
deps: {
  // ...
  // highlight-next-line
  database: coreServices.database,
},
async init({
  // highlight-next-line
  database,
}) {
  // You will then pass this client into your actual plugin implementation
  // code, maybe similar to the following:
  const model = new CarmenDatabaseModel(database);
  httpRouter.use(
    await createRouter({
      // highlight-next-line
      model,
      logger,
    }),
  );
}
```

All plugin database needs are configured under the `backend.database` config key
of your `app-config.yaml`. The framework may even make sure behind the scenes that
the logical database is created automatically if it doesn't exist, based on
rules that the Backstage operator decides on.

The framework does not handle database schema migrations for you, however. The
builtin plugins in the main repo have chosen to use the Knex library to manage
schema migrations as well, but you can do so in any manner that you see fit.

See the [Knex library documentation](http://knexjs.org/) for examples and
details on how to write schema migrations and perform SQL queries against your
database..

## Making Use of the User's Identity

The Backstage backend also offers a core service to access the user's identity. You can access it through the `coreServices.httpAuth` and `coreServices.userInfo` dependencies.

```ts title="plugins/carmen-backend/src/plugin.ts"
deps: {
  // highlight-start
  httpAuth: coreServices.httpAuth,
  userInfo: coreServices.userInfo,
  // highlight-end
},
async init({
  // highlight-start
  httpAuth,
  userInfo,
  // highlight-end
}) {
  httpRouter.use(
    await createRouter({
      // highlight-start
      httpAuth,
      userInfo,
      // highlight-end
      logger,
    }),
  );
}
```

The plugin can then extract the identity from the request.

```ts
export interface RouterOptions {
  logger: LoggerService;
  // highlight-start
  userInfo: UserInfoService;
  httpAuth: HttpAuthService;
  // highlight-end
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { userInfo, httpAuth } = options;

  router.post('/me', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      // This rejects request from non-users. Only use this if your plugin needs to access the
      // user identity, most of the time it's enough to just call `httpAuth.credentials(req)`
      allow: ['user'],
    });

    const user = await userInfo.getUserInfo(credentials);

    res.json({
      // The catalog entity ref of the user.
      userEntityRef: user.userEntityRef,

      // The list of entities that this user or any teams this user is a part of owns.
      ownershipEntityRefs: user.ownershipEntityRefs,
    });
  });

  // ...
}
```
