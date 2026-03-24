---
id: metrics
title: Metrics Service (alpha)
sidebar_label: Metrics Service (alpha)
description: Documentation for the Metrics service
---

The Metrics Service provides a unified interface for emitting application-level metrics from Backstage backend plugins. It wraps the [OpenTelemetry](https://opentelemetry.io/) Meter API and automatically scopes each plugin's metrics using the OpenTelemetry [Instrumentation Scope](https://opentelemetry.io/docs/concepts/instrumentation-scope/), so telemetry backends can identify which plugin produced each metric.

:::note
This service is currently in **alpha** and is imported from `@backstage/backend-plugin-api/alpha`. The API may change in future releases.
:::

## Setting up OpenTelemetry

The Metrics Service does **not** configure the OpenTelemetry SDK itself. You are responsible for initializing the OpenTelemetry Node SDK — including exporters, resource attributes, and views — before starting the Backstage backend. Follow the [tutorial](../../tutorials/setup-opentelemetry.md) for more information.

## How it Relates to OpenTelemetry Auto-Instrumentation

The Metrics Service **complements** auto-instrumentation rather than replacing it. Auto-instrumentation captures infrastructure-level signals like HTTP request counts and durations automatically. The Metrics Service is for **application-level metrics** that only your plugin can provide — things like entities processed, tasks completed, or active sessions.

```ts
// Auto-instrumentation provides automatically:
//   http.server.request.duration{method="GET", route="/catalog/entities"}

// MetricsService provides manually:
const processed = metrics.createCounter('entities.processed.total', {
  description: 'Total entities processed during refresh',
});
processed.add(entities.length, { operation: 'refresh' });
```

## Using the Service

Since the Metrics Service is an alpha API, the service reference is imported from `@backstage/backend-plugin-api/alpha` instead of `coreServices`.

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';

createBackendPlugin({
  pluginId: 'todos',
  register(env) {
    env.registerInit({
      deps: {
        metrics: metricsServiceRef,
      },
      async init({ metrics }) {
        const todoCount = metrics.createCounter('todos.total', {
          description: 'Total number of todos',
        });

        // Later, when adding a todo:
        todoCount.add(1, { 'todo.category': 'personal' });
      },
    });
  },
});
```

## Instrument Types

The service provides both synchronous and observable (asynchronous) instrument types, matching the OpenTelemetry specification.

### Synchronous Instruments

Synchronous instruments are used inline where the measurement occurs.

| Method                | Description                                            | Example Use Case                   |
| --------------------- | ------------------------------------------------------ | ---------------------------------- |
| `createCounter`       | Monotonically increasing sum (non-negative increments) | Total requests, entities processed |
| `createUpDownCounter` | Sum that can increase or decrease                      | Active connections, queue depth    |
| `createHistogram`     | Distribution of values (e.g. durations, sizes)         | Request latency, payload sizes     |
| `createGauge`         | Point-in-time value                                    | CPU usage, memory utilization      |

```ts
const counter = metrics.createCounter('todos.completed.total', {
  description: 'Total todos completed',
});
counter.add(1, { 'todo.status': 'completed' });

const histogram = metrics.createHistogram('todo.duration', {
  description: 'Time spent processing a todo',
  unit: 'seconds',
  advice: { explicitBucketBoundaries: [0.01, 0.05, 0.1, 0.5, 1, 5] },
});
histogram.record(durationInSeconds, {
  'todo.category': 'personal',
  'todo.status': 'completed',
});

const upDown = metrics.createUpDownCounter('todos.in_flight', {
  description: 'Number of todos currently in flight',
});
upDown.add(1);
// ... later
upDown.add(-1);
```

### Observable Instruments

Observable instruments use callbacks that are invoked when a metric collection occurs. This is useful for metrics that are expensive to compute or that come from external sources like databases.

| Method                          | Description                                         | Example Use Case                       |
| ------------------------------- | --------------------------------------------------- | -------------------------------------- |
| `createObservableCounter`       | Monotonically increasing sum, reported via callback | Total items ingested from external API |
| `createObservableUpDownCounter` | Sum that can go up or down, reported via callback   | Connection pool size                   |
| `createObservableGauge`         | Point-in-time value, reported via callback          | Row counts, cache hit ratios           |

```ts
const entityCount = metrics.createObservableGauge('catalog.entities.count', {
  description: 'Total amount of entities in the catalog',
});

entityCount.addCallback(async gauge => {
  const results = await getEntityCountsByKind();
  for (const { kind, count } of results) {
    gauge.observe(count, { kind });
  }
});
```

## Metric Options

All `create*` methods accept an optional `MetricOptions` object:

| Property      | Type     | Description                                                          |
| ------------- | -------- | -------------------------------------------------------------------- |
| `description` | `string` | Human-readable description of the metric                             |
| `unit`        | `string` | Unit of measurement (e.g. `'seconds'`, `'{entity}'`, `'bytes'`)      |
| `advice`      | `object` | Aggregation hints, such as `explicitBucketBoundaries` for histograms |

## Type-Safe Attributes

Metric instruments accept a generic type parameter that constrains the attributes passed to `add`, `record`, or `observe`:

```ts
interface TodoAttributes {
  'todo.category': string;
  'todo.status': 'completed' | 'in_progress' | 'blocked';
}

const completed = metrics.createCounter<TodoAttributes>(
  'todos.completed.total',
  { description: 'Total todos completed' },
);

// Type-safe attributes are enforced
completed.add(1, { 'todo.category': 'personal', 'todo.status': 'completed' });
```

## Advanced Configuration

The service reads optional configuration from `app-config.yaml` under `backend.metrics.plugin.<pluginId>.meter`. This lets operators override the OpenTelemetry Instrumentation Scope for a specific plugin without code changes.

:::tip
Each plugin automatically receives a meter named `backstage-plugin-<pluginId>`. You typically won't need to configure it.
:::

```yaml
backend:
  metrics:
    plugin:
      catalog:
        meter:
          name: 'custom-catalog-meter'
          version: '2.0.0'
          schemaUrl: 'https://example.com/schema'
```

| Property    | Type     | Default                       | Description                     |
| ----------- | -------- | ----------------------------- | ------------------------------- |
| `name`      | `string` | `backstage-plugin-<pluginId>` | Name of the OpenTelemetry meter |
| `version`   | `string` | —                             | Version string for the meter    |
| `schemaUrl` | `string` | —                             | Schema URL for the meter        |
