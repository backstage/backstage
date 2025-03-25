---
id: configuration
title: Catalog Configuration
description: Documentation on Software Catalog Configuration
---

## Processors

The catalog has a concept of _processors_ to perform catalog ingestion tasks,
such as reading raw entity data from a remote source, parsing it, transforming
it, and validating it. These processors are configured under the
`catalog.processors` configuration key.

### Static Location Configuration

The simplest configuration for the catalog, as shown in the default
`@backstage/create-app` template, is to declaratively add locations pointing to
YAML files with [static configuration](../../conf/index.md).

Locations are added to the catalog under the `catalog.locations` key:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/artist-lookup-component.yaml
```

The `url` type locations are handled by a standard processor included with the
catalog (`UrlReaderProcessor`), so no processor configuration is needed. This
processor _does however_ need an [integration](../../integrations/index.md) to
understand how to retrieve a given URL. For the example above, you would need to
configure the [GitHub integration](../../integrations/github/locations.md) to
read files from [github.com](https://github.com/).

The locations added through static configuration cannot be removed through the
catalog locations API. To remove these locations, you must remove them from the
configuration.

Syntax errors or other types of errors present in `catalog-info.yaml` files will
be logged for investigation. Errors do not cause processing to abort.

When multiple `catalog-info.yaml` files with the same `metadata.name` property
are discovered, one will be processed and all others will be skipped. This
action is logged for further investigation.

### Local File (`type: file`) Configurations

In addition to url locations, you can use the `file` location type to bring in content from the local file system. You should only use this for local development, test setups, and example data, not for production data.
You are also not able to use placeholders in them like `$text`, `$json` or `$yaml`. You can however reference other files relative to the current file. See the full [catalog example data set here](https://github.com/backstage/backstage/tree/master/packages/catalog-model/examples) for an extensive example.

Here is an example pulling in the `all.yaml` file from the examples folder. Note the use of `../../` to go up two levels from the current execution path of the backend. This is typically `packages/backend/`.

```yaml
catalog:
  locations:
    - type: file
      target: ../../examples/all.yaml
```

:::note
There might be cases where you need to test some `file` configurations in a Docker container. In a case like this, as the backend is serving the frontend in a default setup, the path would be from the root. Also, you need to **make sure to copy your files into your container**.

Using the example above that would look like this:

```yaml
catalog:
  locations:
    - type: file
      target: ./examples/all.yaml
```

:::

### Integration Processors

Integrations may simply provide a mechanism to handle `url` location type for an
external provider or they may also include additional processors out of the
box, such as the GitHub [discovery](../../integrations/github/discovery.md)
processor that scans a GitHub organization for
[entity descriptor files](descriptor-format.md).

Check the [integrations](../../integrations/index.md) documentation to see what
is offered by each integration.

### Custom Processors

To ingest entities from an existing system already tracking software, you can
also write a _custom processor_ to convert between the existing system and
Backstage's descriptor format. This is documented in
[External Integrations](external-integrations.md).

## Catalog Rules

By default, the catalog will only allow the ingestion of entities with the kind
`Component`, `API`, and `Location`. In order to allow entities of other kinds to
be added, you need to add rules to the catalog. Rules are added either in a
separate `catalog.rules` key or added to statically configured locations.

For example, given the following configuration:

```yaml
catalog:
  rules:
    - allow: [Component, API, Location, Template]

  locations:
    - type: url
      target: https://github.com/org/example/blob/master/org-data.yaml
      rules:
        - allow: [Group]
```

We are able to add entities of kind `Component`, `API`, `Location`, or
`Template` from any location, and `Group` entities from the `org-data.yaml`,
which will also be read as a statically configured location.

Note that if the `catalog.rules` key is present it will replace the default
value, meaning that you need to add rules for the default kinds if you want
those to still be allowed.

The following configuration will reject any kind of entities from being added to
the catalog:

```yaml
catalog:
  rules: []
```

## Readonly mode

Processors provide a good way to automate the ingestion of entities when combined
with [Static Location Configuration](#static-location-configuration) or a
discovery processor like
[GitHub Discovery](../../integrations/github/discovery.md). To enforce the usage of
processors to locate entities we can configure the catalog into `readonly` mode.
This configuration disables registering and deleting locations with the catalog APIs.

```yaml
catalog:
  readonly: true
```

> **Note that any plugin relying on the catalog API for creating, updating, and
> deleting entities will not work in this mode.**

Deleting an entity by UUID, `DELETE /entities/by-uid/:uid`, is allowed when using this mode. It may be rediscovered as noted in [explicit deletion](life-of-an-entity.md#explicit-deletion).

A common use case for this configuration is when organizations have a remote
source that should be mirrored into Backstage. To make Backstage a mirror of
this remote source, users cannot also register new entities with e.g. the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Clean up orphaned entities

In short, entities can become orphaned through multiple means, such as when a catalog-info YAML file is moved from one place to another in the version control system without updating the registration in the catalog. For safety reasons, the default behavior is to just tag the orphaned entities, and keep them around. You can read more about orphaned entities [here](life-of-an-entity.md#orphaning).

However, if you do wish to automatically remove the orphaned entities, you can use the following configuration, and everything with an orphaned entity tag will be eventually deleted.

```yaml
catalog:
  orphanStrategy: delete
```

## Clean up entities from orphaned entity providers

By default, if an entity provider which has provided entities to the catalog, is no longer configured, then the entities remain in the catalog until they are manually unregistered.

To remove these entities automatically, you can use the following configuration.

```yaml
catalog:
  orphanProviderStrategy: delete
```

## Processing Interval

The [processing loop](./life-of-an-entity.md#processing) is
responsible for running your registered processors on all entities, on a certain
interval. That interval can be configured with the `processingInterval`
app-config parameter.

```yaml
catalog:
  processingInterval: { minutes: 45 }
```

The value is a duration object, that has one or more of the fields `years`,
`months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, and `milliseconds`.
You can combine them, for example as `{ hours: 1, minutes: 15 }` which
essentially means that you want the processing loop to visit entities roughly
once every 75 minutes.

Note that this is only a suggested minimum, and the actual interval may be
longer. Internally, the catalog will scale up this number by a small factor and
choose random numbers in that range to spread out the load. If the catalog is
overloaded and cannot process all entities during the interval, the time taken
between processing runs of any given entity may also be longer than specified
here.

Setting this value too low risks exhausting rate limits on external systems that
are queried by processors, such as version control systems housing catalog-info
files.

## Stitching strategy

[Stitching](./life-of-an-entity.md#stitching) finalizes the entity. It can be run in
two modes:

- `immediate` - performs stitching in-band immediately when needed
- `deferred` - performs the stitching asynchronously

It can be configured with the `stitchingStrategy` app-config parameter.

```yaml title="app-config.yaml"
catalog:
  stitchingStrategy:
    mode: immediate
```

For the `deferred` mode you can set up additional parameters to further tune the process,
by setting the following parameters:

- `pollingInterval` - the interval between polling for entities that need stitching
- `stitchTimeout` - the maximum time to wait for an entity to be stitched

These parameters accept a duration object, similar to the `processingInterval` parameter.

```yaml title="app-config.yaml"
catalog:
  stitchingStrategy:
    mode: deferred
    pollingInterval: { seconds: 1 }
    stitchTimeout: { minutes: 1 };
```

## Subscribing to Catalog Errors

Catalog errors are published to the [events plugin](https://github.com/backstage/backstage/tree/master/plugins/events-node): `@backstage/plugin-events-node`. You can subscribe to events and respond to errors, for example you may wish to log them.

The first step is to add the events backend plugin to your Backstage application. Navigate to your Backstage application directory and add the plugin package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-events-backend
```

Now you can install the events backend plugin in your backend.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend'));
```

### Logging Errors

If you want to log catalog errors you can install the `@backstage/plugin-catalog-backend-module-logs` module.

Install the catalog logs module.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-logs
```

Add the module to your backend.

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
```

This will log errors with a level of `warn`.

You should now see logs as the catalog emits events. Example:

```
[1] 2024-06-07T00:00:28.787Z events warn Policy check failed for user:default/guest; caused by Error: Malformed envelope, /metadata/tags must be array entity=user:default/guest location=file:/Users/foobar/code/backstage-demo-instance/examples/org.yaml
```

### Custom Error Handling

If you wish to handle catalog errors with specific logic different from logging the errors the following should help you get started. For example, you may wish to send a notification or create a ticket for someone to investigate.

Create a backend module that subscribes to the catalog error events. The topic is `experimental.catalog.errors`.

```ts title="packages/backend/src/index.ts"
import { CATALOG_ERRORS_TOPIC } from '@backstage/plugin-catalog-backend';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { eventsServiceRef, EventParams } from '@backstage/plugin-events-node';

interface EventsPayload {
  entity: string;
  location?: string;
  errors: Error[];
}

interface EventsParamsWithPayload extends EventParams {
  eventPayload: EventsPayload;
}

const eventsModuleCatalogErrors = createBackendModule({
  pluginId: 'events',
  moduleId: 'catalog-errors',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsServiceRef,
        logger: coreServices.logger,
      },
      async init({ events, logger }) {
        events.subscribe({
          id: 'catalog',
          topics: [CATALOG_ERRORS_TOPIC],
          async onEvent(params: EventParams): Promise<void> {
            const event = params as EventsParamsWithPayload;
            const { entity, location, errors } = event.eventPayload;
            // Add custom logic here for responding to errors
            for (const error of errors) {
              logger.warn(error.message, {
                entity,
                location,
              });
            }
          },
        });
      },
    });
  },
});
```

Now install your module.

```ts title="packages/backend/src/index.ts"
backend.add(eventsModuleCatalogErrors);
```
