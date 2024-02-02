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

In your `packages/backend` folder, create an `instrumentation.ts` file.

```typescript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

Your probably won't need all the instrumentation inside `getNodeAutoInstrumentations()` so make sure to
check the [documentation](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) and tweak it properly.

It's important to setup the NodeSDK and the automatic instrumentation **before** importing any library.

This is why we will use the nodejs [`--require`](https://nodejs.org/api/cli.html#-r---require-module)
flag when we start up the application.

In your `Dockerfile` add the `--require` flag which points to the `instrumentation.ts` file

```Dockerfile
FROM node:18-bookworm-slim
...
# More functionality goes here
...
WORKDIR /app
RUN chown node:node /app
USER node

ENV NODE_ENV production

COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./

# We need the instrumentation file inside the Docker image so we can use it with --require
// highlight-add-next-line
COPY --chown=node:node packages/backend/instrumentation.ts ./

COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production

COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

// highlight-remove-next-line
CMD ["node", "packages/backend", "--config", "app-config.yaml"]
// highlight-add-next-line
CMD ["node", "--require", "./instrumentation.ts", "packages/backend", "--config", "app-config.yaml"]
```

## Run Backstage

The above configuration will only work in production once your start a Docker container from the image.

To be able to test locally you can import the `./instrumentation.ts` file at the top (before all imports) of your backend `index.ts` file

```ts
import '../instrumentation.ts'
// Other imports
...
```

You can now start your Backstage instance as usual, using `yarn dev`.

When the backend is started, you should see in your console traces and metrics emitted by OpenTelemetry.

Of course in production you probably won't use the console exporters but instead send traces and metrics to an OpenTelemetry Collector or other exporter using [OTLP exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/).

If you need to disable/configure some OpenTelemetry feature there are lots of [environment variables](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/) which you can tweak.

## References

- [Getting started with OpenTelemetry Node.js](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [OpenTelemetry NodeSDK API](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_sdk_node.NodeSDK.html)
