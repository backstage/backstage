---
id: telemetry-registry
title: Telemetry Registry Service (alpha)
sidebar_label: Telemetry Registry Service (alpha)
description: Documentation for the Telemetry Registry service
---

The Telemetry Registry Service is a root service that keeps track of the metrics and spans that plugins produce through the [Metrics Service](./metrics.md) and the [Tracing Service](./tracing.md). Use it when you need to list the telemetry that a Backstage backend emits, for example to show it in an admin tool.

:::note
This service is currently in **alpha** and is imported from `@backstage/backend-plugin-api/alpha`. The API may change in future releases.
:::

## What the registry records

The default Metrics and Tracing services report to the registry automatically. You don't need to call it yourself.

- **Metrics:** each instrument a plugin creates, with its plugin ID, name, instrument type, description, and unit.
- **Spans:** each distinct span name a plugin starts, with its plugin ID, span kind, how many times it was started, and when it was last started.

The registry stores definitions only. It doesn't store metric values or span attributes.

:::caution
The registry only sees telemetry that goes through the Metrics and Tracing services. Metrics and spans created by calling the OpenTelemetry API directly, or by auto-instrumentation, aren't included.
:::

The registry keeps up to 1,000 distinct span names in memory. Once it reaches that limit, it ignores new span names but keeps counting the ones it already has. Each backend instance has its own registry, so in a deployment with several instances, each one only lists what it has seen.

## Using the service

The following example lists everything the registry has recorded:

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { telemetryRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

export default createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        telemetryRegistry: telemetryRegistryServiceRef,
      },
      async init({ logger, telemetryRegistry }) {
        const { metrics } = await telemetryRegistry.listMetrics();
        const { spans } = await telemetryRegistry.listSpans();
        logger.info(
          `Found ${metrics.length} metrics and ${spans.length} spans`,
        );
      },
    });
  },
});
```

## Installing the service

`createBackend` installs the service by default. If you build your own list of service factories and include the alpha Metrics or Tracing service factories, you also need to add `telemetryRegistryServiceFactory` from `@backstage/backend-defaults/alpha`.
