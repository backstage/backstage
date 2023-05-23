# Catalog Backend Module for Backstage Plugins

This is an extension module to the plugin-catalog-backend plugin, providing an
opinionated mechanism for discovering Backstage plugins within a given
Backstage monorepo.

This `BackstagePluginsProvider` would be useful to you if you have a large
InnerSource ecosystem of Backstage plugins within your internal monorepo and
want to track each plugin in your internal Software Catalog without forcing
every plugin owner to declare and maintain a `catalog-info.yaml` file.

## Prerequisites

### 1. Properly configured integration(s)

Be sure that you've already configured an `integration` that corresponds to the
SCM/VCS system where your Backstage monorepo exists. As an example:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

Check the [Backstage integrations overview](https://backstage.io/docs/integrations/)
for further details.

### 2. Check that reading is allowed

Be sure that Backstage is configured to trust the host and/or path(s) where
your Backstage monorepo can be found. As an example:

```yaml
backend:
  reading:
    allow:
      - host: github.com
        paths: ['/backstage/'] # allows reads on github.com/backstage/*
```

## Installation

### 1. Install this package

```sh
yarn workspace backend add @backstage/plugin-catalog-backend-module-backstage-plugins
```

### 2. Instantiate and add the provider

This is typically done at `/packages/backend/src/plugins/catalog.ts`:

```ts
import { BackstagePluginsProvider } from '@backstage/plugin-catalog-backend-module-backstage-plugins';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  // ...

  const pluginProvider = BackstagePluginsProvider.fromConfig(env.config, {
    location: 'https://github.com/backstage/backstage/tree/master',
    defaultOwner: 'maintainers',
    logger: env.logger,
    scheduler: env.scheduler,
    scheduleDefinition: {
      frequency: { hours: 1 },
      timeout: { minutes: 5 },
    },
  });
  builder.addEntityProvider(pluginProvider);

  // ...
}
```

Naturally, you will want to supply the `location` of the Backstage monorepo
that is relevant to you, as well as a meaningful `defaultOwner` value
(typically, the group who owns and maintains the monorepo itself).

## How it works

This provider searches the `location` you provide it for `package.json` files
that appear to represent Backstage plugins (e.g. they have a `backstage.role`
key). For each such `package.json`, it provides an entity of the following
form:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage-plugin-etc-etc # slugified package.json name
  title: '@backstage/plugin-etc-etc' # exact package.json name
  description: '' # exact package.json description
  annotations:
    'backstage.io/managed-by-location': '' # location of package.json
    'backstage.io/managed-by-origin-location': '' # location of package.json
spec:
  type: backstage-plugin # always "backstage-plugin"
  plugin_role: frontend-plugin # from backstage.role key
  lifecycle: experimental # experimental by default
  owner: foo-maintainer # derived from CODEOWNERS, or defaultOwner if none
```

It's possible to customize the entities before they're provided to the Catalog
in two ways:

1. You can specify overrides on a plugin-by-plugin basis using the special
   `catalogInfo` package.json key, which represents a partial entity object. As
   an example, you could define a system and some custom tags as follows:

   ```json
   {
     "name": "@internal/plugin-acme-cloud-ci",
     "version": "0.0.0",
     "backstage": {
       "role": "frontend-plugin"
     },
     "catalogInfo": {
       "metadata": {
         "tags": ["acme", "ci"]
       },
       "spec": {
         "system": "internal-ci"
       }
     }
   }
   ```

2. You can supply a `transformer` function when you instantiate the
   `BackstagePluginsProvider`; this function is called for each entity and
   is most useful for making broad changes to entity metadata across an
   entire monorepo.

   ```ts
   // Example of setting lifecycle across a monorepo.
   BackstagePluginsProvider.fromConfig(env.config, {
     location: 'https://github.com/backstage/backstage/tree/master',
     transformer: ({ entity, packageJson }) => {
       // If the package has reached 1.0, consider it production.
       if (!packageJson.version.startsWith('0.')) {
         entity.spec.lifecycle = 'production';
       }
       return entity;
     },
     // etc.
   });
   ```

   The transformer can also be used to filter out plugins that are not relevant
   for your organization.

   ```ts
   // Example of filtering down to only the relevant plugins.
   BackstagePluginsProvider.fromConfig(env.config, {
     location: 'https://github.com/backstage/backstage/tree/master',
     transformer: ({ entity, packageJson }) => {
       // Our company only actively maintains the todo series of plugins
       if (packageJson.name.startsWith('@internal/plugin-todo-list')) {
         return entity;
       }

       // Filter out all other plugins
       return undefined;
     },
     // etc.
   });
   ```

Customizations are applied in exactly the above order:

1. A default backstage plugin component is created based on standard
   `package.json` details and `CODEOWNERS` metadata (if it exists).
2. Any details supplied in the special `catalogInfo` key in the
   `package.json` file is merged in with the default entity.
3. The merged entity is then passed to the `transformer` method, if one is
   supplied.

The resulting entities are then provided to the Catalog.
