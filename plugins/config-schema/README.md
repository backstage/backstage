# config-schema

The `config-schema` plugin lets you browse a documentation reference of the configuration schema of a particular Backstage installation. It is intended as a tool for integrators rather than something that is useful to end users of Backstage.

## Usage

The plugin exports a single full-page extension, the `ConfigSchemaPage`, which you add to an app like a usual top-level tool on a dedicated route.

It also exports a `configSchemaApiRef` without any default implementation, meaning that an API needs to be registered in the app for the plugin to work. An implementation of the API that is provided out of the box is the `StaticSchemaLoader`, which loads the schema from a URL. It can be added to the app by adding the following to your app's `api.ts`:

```ts
createApiFactory(configSchemaApiRef, new StaticSchemaLoader());
```

The configuration schema consumed by the `StaticSchemaLoader` can be generated using the following command:

```shell
yarn --silent backstage-cli config:schema --format=json
```
