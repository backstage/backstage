---
title: Backstage Metrics Service
status: implementable
authors:
  - '@kurtaking'
owners:
  - '@kurtaking'
project-areas:
  - core-framework
  - observability
creation-date: 2025-06-23
---

# BEP: Backstage Metrics Service

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Configuration](#configuration)
  - [Interface](#interface)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Add a core `MetricsService` to Backstage's framework to provide a unified interface for metrics instrumentation. The service offers OpenTelemetry-based capabilities with support for app configuration (e.g. `app-config.yaml`).

This approach leverages industry standards while focusing the `MetricsService` on distinct Backstage concerns, following the same pattern as other core services (DatabaseService builds on Knex, LoggerService builds on Winston, HttpRouterService builds on Express, etc.).

## Motivation

There is no guidance when it comes to metrics instrumentation. While individual plugins may implement their own metrics, there's no standardized approach for metrics collection, naming, or configuration.

By providing a core metrics service:

- **Plugin Authors** and the **Community** gain a straightforward way to address metrics instrumentation and can focus on business logic instead of needing to reimplement metrics plumbing.
- **Backstage Admins** receive a reliable stream of metrics from the core system for monitoring, alerting, and troubleshooting.

### Goals

- Plugin-scoped metric namespacing
- Consistent metrics patterns across all plugins
- Aligned with OpenTelemetry industry standards
- Provide a familiar interface as other core services
- Standardized initialization and lifecycle management

The catalog and scaffolder plugins will be updated to use the new metrics service in the initial alpha release.

### Non-Goals

- Adding metrics to plugins that don't currently have it (outside of catalog and scaffolder)
- Tracing and other telemetry concerns are out of scope for this BEP.
- Refactoring the existing `LoggerService`. Future work to unify observability related concerns would be ideal, but not a goal.

## Proposal

Following similar patterns to other core services, create a new `RootMetricsService` responsible for initializing metrics, root-level concerns, and the creation of plugin-specific `MetricsService` instances. The root service delegates to the plugin-scoped `MetricsService` to initialize a meter for each registered plugin based on the `service.name` and optional `service.version` provided in the app's `app-config.yaml` file. This is based on the recommendation in the OpenTelemetry [documentation](https://opentelemetry.io/docs/languages/js/instrumentation/#acquiring-a-meter).

## Design Details

### Integration with OpenTelemetry Auto-Instrumentation

The `RootMetricsService` will automatically enable instrumentation for known libraries leveraged by the Backstage framework.

- Express
- Knex
- Winston
- etc.

Configuration will be provided to enable or disable auto-instrumentation via inclusion or exclusion lists.

The `MetricsService` **complements** rather than duplicates auto-instrumentation by focusing on **application-level metrics** that only Backstage can provide.

For example, the catalog plugin may want to track the number of entities processed by the `refresh` operation and the kind of entity being processed.

```ts
// Auto-instrumentation provides (automatically):
// - http.server.requests.total{method="GET", route="/catalog/entities", status_code="200"}
// - http.server.request.duration{method="GET", route="/catalog/entities"}

// MetricsService provides (manually):
const entityMetrics = metricsService.createCounter('entities.processed.total');
entityMetrics.add(entities.length, { operation: 'refresh', kind: 'Component' });
```

### Configuration

```ts
// Not final, but this is the general idea...
interface MetricsConfig {
  enabled: boolean;

  resource: {
    serviceName?: string;
    serviceVersion?: string;
    environment?: string;
  };

  collection?: {
    exportIntervalMillis?: number;
    // ...
  };

  exporters: Array<{
    type: 'prometheus' | 'otlp' | 'console' | '...';
    enabled: boolean;
    config?: Record<string, any>;
  }>;

  autoInstrumentation: {
    enabled: boolean;
    include?: string[];
    exclude?: string[];
  };
}
```

```yaml
backend:
  metrics:
    enabled: true

    resource:
      serviceName: backstage
      serviceVersion: 0.0.1
      environment: production

    # Collection settings
    collection:
      exportIntervalMillis: 15000

    exporters:
      - type: prometheus
        enabled: true
        config:
          port: 9464
      # ...
      - type: console
        enabled: true
        config:
          logLevel: debug

    autoInstrumentation:
      enabled: true
      include:
        - 'some other library'
      exclude:
        - 'express'
```

### Interface

Provide a thin wrapper around OpenTelemetry's API while re-exporting the types from the `@opentelemetry/api` package. This introduces concepts already familiar to both the Backstage community and those familiar with OpenTelemetry. The OTEL maintainers state this is the recommended approach and that we can rely on `@opentelemetry/api` to be the source of truth and not to have breaking changes.

```ts
interface MetricsService {
  // Synchronous instrumentation
  createCounter(name: string, options?: MetricOptions): Counter;
  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
  createHistogram(name: string, options?: MetricOptions): Histogram;
  createGauge(name: string, options?: MetricOptions): Gauge;

  // Asynchronous instrumentation
  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter;
  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter;
  createObservableGauge(name: string, options?: MetricOptions): ObservableGauge;

  // Future - add additional convenience methods as we learn more about the needs of the framework
}
```

The `RootMetricsService` is responsible for initializing the OpenTelemetry SDK and creating plugin-scoped metrics services. If the end user wants to initialize their own SDK, they are responsible for initializing the OpenTelemetry SDK with their own configuration. The `RootMetricsService` is responsible for providing metrics to other root services and creating plugin-scoped metrics services.

```ts
export const rootMetricsServiceFactory = createServiceFactory({
  // depends on as little as possible so that it can be initialized as early as possible.
  service: rootMetricsServiceRef,
  deps: {
    rootConfig: coreServices.rootConfig,
  },
  factory: ({ rootConfig }) => {
    return DefaultRootMetricsService.fromConfig(rootConfig);
  },
});
```

It also provides a method for creating a plugin-scoped `MetricsService` for each registered plugin.

```ts
interface RootMetricsService extends MetricsService {
  forPlugin(pluginId: string): MetricsService;
}

class DefaultRootMetricsService implements RootMetricsService {
  private sdk: NodeSDK;

  static fromConfig(config: Config): RootMetricsService {
    const metricsConfig = config.getOptionalConfig('backend.metrics');

    const sdk = new NodeSDK({
      resource: createResourceFromConfig(metricsConfig),
      instrumentations: [
        getNodeAutoInstrumentations({
          ...getAutoInstrumentationConfig(metricsConfig),
        }),
      ],
      metricReader: createMetricReadersFromConfig(metricsConfig),
    });

    sdk.start();

    return new DefaultRootMetricsService(sdk);
  }

  constructor(private sdk: NodeSDK) {}

  forPlugin(pluginId: string): MetricsService {
    return new PluginMetricsService(pluginId);
  }

  async shutdown(): Promise<void> {
    await this.sdk.shutdown();
  }
}
```

Each plugin receives a metrics service that automatically namespaces all metrics to match the naming conventions outlined in the section below.

```ts
const metricsServiceFactory = createServiceFactory({
  service: metricsServiceRef,
  deps: {
    rootConfig: coreServices.rootConfig,
    pluginMetadata: coreServices.pluginMetadata,
    rootMetrics: coreServices.rootMetrics,
  },
  factory: ({ rootMetrics, pluginMetadata }) => {
    return rootMetrics.forPlugin(pluginMetadata.getId());
  },
});

class PluginMetricsService implements MetricsService {
  // ...
  constructor(private pluginId: string) {
    this.meter = metrics.getMeter(`backstage.plugin.${pluginId}`);
  }

  createCounter(name: string, options?: MetricOptions): Counter {
    const fullName = this.prefixMetricName(name);
    return this.meter.createCounter(fullName, options);
  }

  // ... other interface methods

  private prefixMetricName(name: string): string {
    return `backstage.plugin.${this.pluginId}.${name}`;
  }
}
```

### Example

````ts
const entitiesProcessed = metricsService.createCounter('entities.processed.total', {
  description: 'Total entities processed during refresh',
  unit: '{entity}',
});

entitiesProcessed.add(100);

// ...
// metric is now available as `backstage.plugin.catalog.entities.processed.total`

### Naming Conventions

All Backstage metrics follow this hierarchical pattern:

`backstage.{plugin|core}.{scope_name}.{category}.{metric_name}`

**Where:**

- `backstage` is the root namespace for all Backstage metrics
- `{scope}` is the system scope (either **plugin** or **core**)
- `{scope_name}` is the name of the plugin or core service (e.g. `my-plugin`, `catalog`, `scaffolder`, etc.)
- `{category}` is the logical grouping within the `{scope}`
- `{metric_name}` is the name of the metric as provided by the plugin author.

#### Scope

The `scope` represents where it belongs in the Backstage ecosystem.

- `plugin` - A plugin-specific metric (e.g. `backstage.plugin.catalog.entities.count`)
- `core` - A core service metric (e.g. `backstage.core.database.connections.active`)

#### Plugin-Scoped Metrics

Pattern: `backstage.plugin.{pluginId}.{category}.{metric_name}`

```yaml
# Examples
backstage.plugin.catalog.entities.processed.total
backstage.plugin.scaffolder.tasks.completed.total
backstage.plugin.techdocs.builds.active
backstage.plugin.auth.sessions.active.total # todo: technically a core service and a backend plugin
````

#### Core Metrics

Pattern: `backstage.core.{core_service}.{category}.{metric_name}`

```yaml
# Examples
backstage.core.database.connections.active
backstage.core.scheduler.tasks.queued.total
backstage.core.http.requests.total
```

### References

- [General naming considerations](https://opentelemetry.io/docs/specs/semconv/general/naming/#general-naming-considerations)
- [Acquiring a meter](https://opentelemetry.io/docs/languages/js/instrumentation/#acquiring-a-meter)

## Release Plan

1. Create a new `RootMetricsService` that initializes the OpenTelemetry SDK and creates plugin-scoped metrics services.
1. Create the plugin-scoped `MetricsService` that provides a metrics service for plugins.
1. Create alpha-related documentation to add to existing core service [docs](https://backstage.io/docs/backend-system/core-services/index).
1. Release the metrics service under `@alpha`.
1. Mark all existing metrics implementations as deprecated.
1. Refactor catalog and scaffolder plugins to use the new (alpha) `MetricsService`.
1. Offer a migration path for existing adopters to migrate to the new metrics service.
1. Release the metrics service
1. Update all documentation to reference the new metrics service.
1. Create follow-up action items to integrate the new metrics service into the core system.
1. Fully deprecate all existing metrics implementations like the existing Prometheus one-off implementations.

## Dependencies

1. The root metrics service MUST BE initialized as EARLY as possible to prevent dependents from receiving no-op meters
1. There are one-off implementations of metrics in the wild that may conflict with the proposed service. However, this is unlikely to be a problem as the SDK should continue to pick things up.

## Alternatives

Plugin authors continue to implement their own metrics as they see fit.
