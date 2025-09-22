---
id: setup-opentelemetry
title: Setup OpenTelemetry
description: Tutorial to setup OpenTelemetry metrics and traces exporters in Backstage
---

Backstage uses [OpenTelemetry](https://opentelemetry.io/) to instrument its components by reporting traces and metrics.

This tutorial shows how to setup exporters in your Backstage backend package. For demonstration purposes we will use a Prometheus exporter, but you can adjust your solution to use another one that suits your needs; see for example the article on [OTLP exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/). This tutorial also includes exporting traces using the JSON/HTTP exporter with Jaeger being the ideal target, but this too can be adjusted to fit your needs by seeing the supported tooling in the [OTLP exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/) documentation.

## Install dependencies

We will use the OpenTelemetry Node SDK and the `auto-instrumentations-node` packages.

Backstage packages, such as the catalog, use the OpenTelemetry API to send custom traces and metrics.
The `auto-instrumentations-node` will automatically create spans for code called in libraries like Express.

```bash
yarn --cwd packages/backend add \
    @opentelemetry/sdk-node \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/exporter-prometheus \
    @opentelemetry/exporter-trace-otlp-http
```

## Configure

In your `packages/backend/src` folder, create an `instrumentation.js` file.

```js title="in packages/backend/src/instrumentation.js"
// Prevent from running more than once (due to worker threads)
const { isMainThread } = require('node:worker_threads');

if (isMainThread) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
  const {
    OTLPTraceExporter,
  } = require('@opentelemetry/exporter-trace-otlp-http');

  // By default exports the metrics on localhost:9464/metrics
  const prometheusExporter = new PrometheusExporter();
  // We post the traces to localhost:4318/v1/traces
  const otlpTraceExporter = new OTLPTraceExporter({
    // Default Jaeger URL trace endpoint.
    url: 'http://localhost:4318/v1/traces',
  });
  const sdk = new NodeSDK({
    metricReader: prometheusExporter,
    traceExporter: otlpTraceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
```

You probably won't need all of the instrumentation inside `getNodeAutoInstrumentations()` so make sure to
check the [documentation](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) and tweak it properly.

### Views

The default histogram buckets for OpenTelemetry are in milliseconds, but the histograms that are created for Catalog processing emit metrics in second. You might want to adjust this to what fits your need. To do this you can use the [Views feature](https://opentelemetry.io/docs/concepts/signals/metrics/#views) like this:

```js
const prometheus = new PrometheusExporter();
const sdk = new NodeSDK({
  metricReader: prometheus,
  views: [
    new View({
      instrumentName: 'catalog.test',
      aggregation: new ExplicitBucketHistogramAggregation([
        0.01, 0.1, 0.5, 1, 5, 10, 25, 50, 100, 500, 1000,
      ]),
    }),
  ],
});
```

The above will make all the histogram buckets use the same config. If you would like to take a more targeted approach you can do this:

```js
const prometheus = new PrometheusExporter();
const sdk = new NodeSDK({
  metricReader: prometheus,
  views: [
    new View({
      instrumentName: 'catalog.test',
      aggregation: new ExplicitBucketHistogramAggregation([
        0, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 30, 60, 120, 300, 1000,
      ]),
    }),
  ],
});
```

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

You can now start your Backstage instance as usual, using `yarn start` and you'll be able to see your metrics at: <http://localhost:9464/metrics>

### Troubleshooting

If you are having issues getting metrics or traces working there are some helpful diagnostic tools from OpenTelemetry you can use that can help.

First we need to the `@opentelemetry/api` package:

```bash
yarn --cwd packages/backend add @opentelemetry/api
```

Then we want to add the following snippet before the `sdk.start()` call:

```js
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
```

This will then add OpenTelemetry debug logs that you can then look at to help get a better idea of why something may not be working as expected.

We don't recommend shipping this in production because of the log density.

## Production Setup

In your `.dockerignore`, add this line:

```text
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
