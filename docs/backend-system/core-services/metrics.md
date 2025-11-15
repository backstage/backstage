---
id: metrics
title: Metrics Service (alpha)
sidebar_label: Metrics (alpha)
description: Documentation for the Metrics Service
---

## Overview

The Metrics Service is a core service designed to provide a unified interface for metrics instrumentation. This service allows plugins to create metrics instruments with well-defined namespaces and attributes, promoting consistency and reusability across the Backstage ecosystem.

## Using the Service

### Accessing the Service in a Plugin

To use the Metrics Service in your plugin, access it through dependency injection:

```typescript
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        metrics: metricsServiceRef,
        logger: coreServices.logger,
      },
      async init({ metrics, logger }) {
        logger.info('Creating metrics...');

        // Create a counter metric
        const counter = metrics.createCounter('my-metric', {
          description: 'My metric',
          unit: 'count',
        });

        // Add a value to the counter
        counter.add(1);

        logger.info('Counter instrument created and incremented successfully');
      },
    });
  },
});
```

## Naming Conventions

All metrics in the Backstage ecosystem are based on [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/reference/specification/metrics/semantic_conventions/). Following these conventions ensures consistency, discoverability, and compatibility with monitoring tools.

:::tip
We strive to stay aligned with the OpenTelemetry best practices. When in doubt, refer to the OpenTelemetry documentation. If you notice any inconsistencies, please open an issue or submit a PR.
:::

### Building Blocks

All Backstage metrics follow a hierarchical naming pattern that provides clear context about where the metric originates and what it measures. We recommend following this pattern for all metrics.

```md
backstage.{scope}.{scope_name}.{metric_name}
```

where:

- `backstage` - Root namespace for all Backstage metrics
- `{scope}` - System scope (`plugin` or `core`)
- `{scope_name}` - Name of the plugin or core service
- `{metric_name}` - Hierarchical metric name **provided by the implementer**

### Scopes

#### Plugin Scope

**Pattern:** `backstage.plugin.{pluginId}.{metric_name}`

Plugin-scoped metrics represent functionality specific to individual plugins. Each plugin operates as an independent microservice with its own metrics namespace.

**Examples:**

```md
backstage.plugin.catalog.entities.operations.total
backstage.plugin.scaffolder.tasks.total
backstage.plugin.techdocs.builds.duration
```

#### Core Scope

**Pattern:** `backstage.core.{metric_name}`

Core-scoped metrics represent core services that support multiple plugins or provide cross-cutting functionality.

**Examples:**

```md
backstage.core.database.connections.active
backstage.core.database.operations.duration
backstage.core.scheduler.tasks.total
backstage.core.httpRouter.middleware.duration
```

### Metric Name Structure

The `{metric_name}` component should be hierarchical using dot notation to create logical groupings.

```md
# Entity operations (use consolidated metrics with attributes)

entities.operations.total

# Task/Job operations (use consolidated metrics with attributes)

tasks.total
tasks.duration
tasks.running
tasks.queued

# Generic operations pattern

operations.total
operations.duration
```

## Finding Metrics in an example observability tool

### Prometheus

```md
backstage_plugin_catalog_entities_operations_total
```

### Grafana

```md
backstage.plugin.catalog.entities.operations.total
```

### Example scenarios

Show me all metrics related to the catalog plugin

```md
backstage.plugin.catalog.\*
```

Show me all http requests grouped by plugin

```md
backstage.plugin.\*.http.requests.total
```
