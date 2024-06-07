# backstage-plugin-catalog-backend-module-logs

A module that subscribes to catalog related events and logs them.

Catalog errors are published to the [events plugin](https://github.com/backstage/backstage/tree/master/plugins/events-node): `@backstage/plugin-events-node`. You can subscribe to events and respond to errors, for example you may wish to log them.

The first step is to add the events backend plugin to your Backstage application. Navigate to your Backstage application directory and add the plugin package.

```ts
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-node
```

Now you can install the events backend plugin in your backend.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend/alpha'));
```

Now install the catalog logs module.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
```

You should now see logs as the catalog emits events. Example:

```
[1] 2024-06-07T00:00:28.787Z events warn Policy check failed for user:default/guest; caused by Error: Malformed envelope, /metadata/tags must be array entity=user:default/guest location=file:/Users/foobar/code/backstage-demo-instance/examples/org.yaml
```
