# config-schema

The `config-schema` plugin allows you to read a documentation reference for the configuration schema of a certain Backstage installation. It is designed to be used by integrators rather than end users of Backstage.

## Usage

The plugin generates a single full-page extension, the `ConfigSchemaPage`, which you may add to your app as a top-level tool on a dedicated route.

It also exposes a `configSchemaApiRef` with no default implementation, which means that the plugin requires an API to be registered in the app to function. The `StaticSchemaLoader` is an out-of-the-box API implementation that loads the schema from a URL. It may be incorporated into the app by adding the following to your app's `api.ts`:

```ts
createApiFactory(configSchemaApiRef, new StaticSchemaLoader());
```

The configuration schema consumed by the `StaticSchemaLoader` can be generated using the following command:

```shell
yarn --silent backstage-cli config:schema --format=json
```
