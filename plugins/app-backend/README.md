# App backend plugin

This backend plugin can be installed to serve static content of a Backstage app.

## Installation

Add both this package and your local frontend app package as dependencies to your backend, for example

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-app-backend app
```

By adding the app package as a dependency we ensure that it is built as part of the backend, and that it can be resolved at runtime.

Now add the plugin router to your app, creating it for example like this:

```ts
const router = await createRouter({
  logger: env.logger,
  appPackageName: 'example-app',
});
```

And registering it like this:

```ts
createServiceBuilder(module)
  ...
  .addRouter('', router);
```

Be sure to register the app router last, as it serves content for HTML5-mode navigation, i.e. falling back to serving `index.html` for any route that can't be found.
