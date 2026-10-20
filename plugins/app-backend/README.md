# App backend plugin

This backend plugin can be installed to serve static content of a Backstage app.

## Installation

Add both this package and your local frontend app package as dependencies to your backend, for example

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-app-backend app
```

By adding the app package as a dependency we ensure that it is built as part of the backend, and that it can be resolved at runtime.

Now add the plugin to your app, creating it for example like this:

### New Backend

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend'));
backend.start();
```

### Old Backend

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

## Public entry point configuration

When serving a protected app with a public entry point, the app backend injects
all frontend-visible configuration into both entry points by default. To restrict
what is initially exposed to unauthenticated users, configure `app.publicConfig`:

```yaml
app:
  publicConfig:
    allowedConfig:
      - app.title
      - backend.baseUrl
      - auth.environment
      - auth.providers
    allowedExtensions:
      - sign-in-page:app
```

The presence of `app.publicConfig` enables filtering. Missing or empty lists allow
no config keys or extensions. An existing extension list is replaced with an empty
list when no extension IDs are allowed.
Allowed key paths include their descendants, except that `app.extensions` is
always controlled exclusively by `allowedExtensions`, including when `app` or
`app.extensions` is listed in `allowedConfig`. Extension IDs are matched exactly
for both string entries and object entries. These IDs select extension configuration
to expose; they do not control which extensions the public app loads. Normal
frontend visibility rules still apply. Authenticated users continue to receive the
full frontend-visible configuration.

The public HTML template also receives the restricted config. Include any keys
that your template reads, such as `app.title`, in `allowedConfig`. Asset URLs
based on `publicPath` continue to use the full frontend-visible `app.baseUrl`,
even if that key is omitted from the public config.

This filtering requires runtime configuration injection. When
`app.disableConfigInjection` is enabled, the configuration embedded at build time
is used instead. This setting only applies when serving the public entry point;
it has no effect when that entry point is absent or disabled.
