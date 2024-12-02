---
id: setup-opentelemetry
title: Setup OpenTelemetry
description: Tutorial to setup OpenTelemetry metrics and traces exporters in Backstage
---

Backstage uses [OpenTelemetery](https://opentelemetry.io/) to instrument its components by reporting traces and metrics.

This tutorial shows how to setup exporters in your Backstage backend package. For demonstration purposes we will use a Prometheus exporter, but you can adjust your solution to use another one that suits your needs; see for example the article on [OTLP exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/).

## Install dependencies

We will use the OpenTelemetry Node SDK and the `auto-instrumentations-node` packages.

Backstage packages, such as the catalog, use the OpenTelemetry API to send custom traces and metrics.
The `auto-instrumentations-node` will automatically create spans for code called in libraries like Express.

```bash
yarn --cwd packages/backend add \
    @opentelemetry/sdk-node \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/exporter-prometheus
```

## Configure

In your `packages/backend/src` folder, create an `instrumentation.js` file.

```typescript title="in packages/backend/src/instrumentation.js"
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// By default exports the metrics on localhost:9464/metrics
const prometheus = new PrometheusExporter();
const sdk = new NodeSDK({
  // You can add a traceExporter field here too
  metricReader: prometheus,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

You probably won't need all of the instrumentation inside `getNodeAutoInstrumentations()` so make sure to
check the [documentation](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) and tweak it properly.

## Local Development Setup

It's important to setup the NodeSDK and the automatic instrumentation **before**
importing any library. This is why we will use the nodejs
[`--require`](https://nodejs.org/api/cli.html#-r---require-module) flag when we
start up the application.

For local development, you can add the required flag in your `packages/backend/package.json`.

```json title="packages/backend/package.json"
"scripts": {
  "start": "backstage-cli package start --require ./src/instrumentation.js",
  ...
```

You can now start your Backstage instance as usual, using `yarn dev`.

## Production Setup

In your `.dockerignore`, add this line:

```
!packages/backend/src/instrumentation.js
```

This ensures that Docker build will not ignore the instrumentation file if you are following the recommended `.dockerignore` setup.

In your `Dockerfile`, copy `instrumentation.js` file into the root of the working directory.

```Dockerfile
COPY --chown=${NOT_ROOT_USER}:${NOT_ROOT_USER} packages/backend/src/instrumentation.js ./
```

And then add the `--require` flag that points to the file to the CMD array.

```Dockerfile
// highlight-remove-next-line
CMD ["node", "packages/backend", "--config", "app-config.yaml"]
// highlight-add-next-line
CMD ["node", "--require", "./instrumentation.js", "packages/backend", "--config", "app-config.yaml"]
```

If you need to disable/configure some OpenTelemetry feature there are lots of [environment variables](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/) which you can tweak.

### Available Metrics

The following metrics are available:

- `catalog_entities_count`: Total amount of entities in the catalog
- `catalog_registered_locations_count`: Total amount of registered locations in the catalog
- `catalog_relations_count`: Total amount of relations between entities
- `catalog.processed.entities.count`: Amount of entities processed
- `catalog.processing.duration`: Time spent executing the full processing flow
- `catalog.processors.duration`: Time spent executing catalog processors
- `catalog.processing.queue.delay`: The amount of delay between being scheduled for processing, and the start of actually being processed
- `catalog.stitched.entities.count`: Amount of entities stitched
- `catalog.stitching.duration`: Time spent executing the full stitching flow
- `catalog.stitching.queue.length`: Number of entities currently in the stitching queue
- `catalog.stitching.queue.delay`: The amount of delay between being scheduled for stitching, and the start of actually being stitched
- `scaffolder.task.count`: Count of task runs
- `scaffolder.task.duration`: Duration of a task run
- `scaffolder.step.count`: Count of step runs
- `scaffolder.step.duration`: Duration of a step runs
- `backend_tasks.task.runs.count`: Total number of times a task has been run
- `backend_tasks.task.runs.duration`: Histogram of task run durations

## References

- [Getting started with OpenTelemetry Node.js](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [OpenTelemetry NodeSDK API](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_sdk_node.NodeSDK.html)
