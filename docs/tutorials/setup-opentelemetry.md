---
id: setup-opentelemetry
title: Setup OpenTelemetry
description: Tutorial to setup OpenTelemetry metrics and traces exporters in Backstage
---

Backstage uses [OpenTelemetery](https://opentelemetry.io/) to instrument its components by reporting traces and metrics.

This tutorial shows how to setup exporters in your Backstage backend package. For demonstration purposes we will use the simple console exporters.

## Install dependencies

We will use the OpenTelemetry Node SDK and the `auto-instrumentations-node` packages.

Backstage packages, such as the catalog, uses the OpenTelemetry API to send custom traces and metrics.
The `auto-instrumentations-node` will automatically create spans for code called in libraries like Express.

```bash
yarn --cwd packages/backend add @opentelemetry/sdk-node \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/sdk-metrics \
    @opentelemetry/sdk-trace-node
```

## Configure

In your `packages/backend/src` folder, create an `instrumentation.ts` file.

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

In the `index.ts`, import this file **at the beginning**:

```typescript
import './instrumentation'; // Setup the OpenTelemetry instrumentation

// other imports and backend init...
```

It's important to setup the NodeSDK and the automatic instrumentation **before** importing any library.

## Run Backstage

You can now start your Backstage instance as usual, using `yarn dev`.

When the backend is started, you should see in your console traces and metrics emitted by OpenTelemetry.

Of course in production you probably won't use the console exporters but instead send traces and metrics to an OpenTelemetry Collector using [OTLP exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/).

## References

- [Getting started with OpenTelemetry Node.js](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [OpenTelemetry NodeSDK API](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_sdk_node.NodeSDK.html)
