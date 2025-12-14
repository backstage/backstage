---
id: metrics
title: Metrics Service (alpha)
sidebar_label: Metrics (alpha)
description: Documentation for the Metrics Service
---

## Overview

The Metrics Service is a core service designed to provide a unified interface for metrics instrumentation. This service allows plugins to create metrics with well-defined namespaces and attributes, promoting consistency across the Backstage ecosystem.

```
!!! warn
    This is an alpha API and is likely to change. Early adopters should expect breaking changes and are encouraged to provide feedback and suggestions.
```

## Setup OpenTelemetry

If you are looking to set up OpenTelemetry for your Backstage instance, please refer to the [Setup OpenTelemetry](../../tutorials/setup-opentelemetry.md) tutorial.

## Using the Service

Access the service through dependency injection:

```typescript
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        metrics: metricsServiceRef,
      },
      async init({ metrics }) {
        // Create a counter metric at the path `backstage.plugin.example.my_metric`.
        const counter = metrics.createCounter('my_metric', {
          description: 'My metric in milliseconds',
          unit: 'ms',
        });

        // Add a value to the counter
        counter.add(1);
      },
    });
  },
});
```

## Naming Conventions

All Backstage metrics are based on [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/reference/specification/metrics/semantic_conventions/) and follow a hierarchical naming pattern that provides clear context about where the metric originates and what it measures. Multi-word namespaces and metric names should use `snake_case` notation.

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

**Pattern:** `backstage.plugin.{plugin_id}.{metric_name}`

Plugin-scoped metrics represent functionality specific to individual plugins. The service handles namespacing the provided metric name with `backstage.plugin.{plugin_id}`.

**Examples:**

```md
backstage.plugin.scaffolder.tasks.total
backstage.plugin.mcp_actions.actions.duration
```

#### Core Scope

**Pattern:** `backstage.core.{metric_name}`

Core-scoped metrics represent core services that support the core framework, root-level concerns, or provide cross-cutting functionality.

**Examples:**

```md
backstage.core.database.connections.active
backstage.core.scheduler.tasks.total
backstage.core.httpRouter.middleware.duration
```

## Resources

- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/general/metrics/)
- [OpenTelemetry Naming Considerations](https://opentelemetry.io/docs/specs/semconv/general/naming/)
