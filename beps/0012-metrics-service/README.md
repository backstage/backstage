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
  - [Naming Conventions](#naming-conventions)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Add a core `MetricsService` to Backstage's framework that provides a unified interface for metrics instrumentation. The service offers OpenTelemetry-based capabilities with support for app configuration (e.g. `app-config.yaml`).

## Motivation

There is currently no guidance for plugin authors when it comes to metrics instrumentation. While individual plugins may implement their own metrics, there's no standardized approach for metrics collection, naming, or configuration.

By providing a core metrics service:

- **Plugin Authors** and the **Community** gain a straightforward way to address metrics instrumentation and can focus on business logic instead of needing to reimplement metrics plumbing.
- **Backstage Admins** receive a reliable stream of metrics from the core system for monitoring, alerting, and troubleshooting.

### Goals

- Consistent metrics patterns across all plugins
- Aligned with OpenTelemetry industry standards
- Provide a familiar interface as other core services

The catalog and scaffolder plugins will be updated to use the new metrics service in the initial release.

### Non-Goals

- Adding metrics to plugins that don't currently have it (outside of catalog and scaffolder)
- Providing a full Backstage telemetry SDK (aka recreate the OTEL Node SDK).
- Tracing and other telemetry concerns are out of scope for this BEP.
- Refactoring the existing `LoggerService`. Future work to unify observability related concerns would be ideal, but not a goal.

## Proposal

Following similar patterns to other core services, create a new `RootMetricsService` responsible for initializing metrics, root-level concerns, and the creation of plugin-specific `MetricsService` instances. The root service delegates to the plugin-scoped `MetricsService` to initialize a meter for each registered plugin based on the `serviceName` and optional `serviceVersion` provided in the app's `app-config.yaml` file. This is based on the recommendation in the OpenTelemetry [documentation](https://opentelemetry.io/docs/languages/js/instrumentation/#acquiring-a-meter).

## Design Details

### Configuration

<!--
todo: I want to provide full configuration via the app-config, but that requires us wrapping the entire SDK and handling the `instrumentation.js`
      instructions. I'm not sure we want to start there.

Metrics configuration will continue to be defined by the adopter in their `instrumentation.js` file as outlined in the [setup-opentelemetry](https://backstage.io/docs/tutorials/setup-opentelemetry/) docs.

The initial alpha release will include a simple configuration for the root metrics service.
-->

```yaml
backend:
  metrics:
    serviceName: backstage
    # todo: this is optional - should we just default it to the current Backstage release and allow override?
    serviceVersion: 0.0.1
```

### Interface

Provide a familiar interface as other core services while re-exporting the types from the `@opentelemetry/api` package. This introduces concepts already familiar to both the Backstage community and those familiar with OpenTelemetry.

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

  // Provide access to the underlying meter for advanced configuration.
  getMeter(): Meter;

  // Additional convenience methods tbd...
}
```

The `RootMetricsService` is responsible for the global meter, namespaced to `backstage` or the `serviceName` and `serviceVersion` provided in the app's `app-config.yaml` file. The root metrics service will depend on as little as possible so that it can be initialized as early as possible.

```ts
export const rootMetricsServiceFactory = createServiceFactory({
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

class DefaultRootMetricsService {
  // ...

  static fromConfig(config: Config): RootMetricsService {
    return new DefaultRootMetricsService(config);
  }

  forPlugin(pluginId: string): MetricsService {
    return new PluginMetricsService({
      pluginId,
      serviceName: this.serviceName,
      serviceVersion: this.serviceVersion,
    });
  }
}
```

Each plugin-scoped `MetricsService` acquires a meter when it is created by calling `metrics.getMeter` from the `@opentelemetry/api` package. The internals of the service ensure the metric name is namespaced to match the naming conventions outlined in the [naming conventions](#naming-conventions) section.

```ts
class PluginMetricsService implements MetricsService {
  // ...
  constructor({
    pluginId,
    serviceName,
    serviceVersion,
  }: PluginMetricsServiceOptions) {
    this.pluginId = pluginId;
    this.serviceName = serviceName;
    this.meter = metrics.getMeter(serviceName, serviceVersion);
  }

  // Ensures consistency across all metrics
  private prefixMetricName(name: string): string {
    return `${this.serviceName}.plugin.${this.pluginId}.${name}`;
  }
}
```

### Naming Conventions

All Backstage metrics MUST follow this hierarchical pattern:

`backstage.{scope}.{scope_name}.{category}.{metric_name}`

**Where:**

- `backstage` is the root namespace for all Backstage metrics
- `{scope}` is the system scope (`pluginId`, `core` for core services)
- `{scope_name}` is the name of the scope (e.g. `my-plugin`, `catalog`, `scaffolder`, etc.)
- `{category}` is the logical grouping within the `{scope}`
- `{metric_name}` is the name of the metric

The metric name will be the name as provided by the plugin author in the form `{category}.{name}`.

```ts
const rootMetrics = DefaultRootMetricsService.fromConfig(config);
const pluginMetricsService = rootMetrics.forPlugin('my-plugin');

const metric = pluginMetricsService.createCounter('my_category.my_metric');

metric.add(1);

// ...
// metric is now available as `backstage.plugin.my-plugin.my_category.my_metric`
```

#### Scope

The `scope` represents where it belongs in the Backstage ecosystem.

- `pluginId` - A plugin-specific metric (e.g. `backstage.plugin.catalog.entities.count`)
- `core` - A core service metric (e.g. `backstage.core.database.connections.active`)

##### Plugin-Scoped Metrics

Pattern: `backstage.plugin.{pluginId}.{category}.{metric_name}`

```yaml
# Examples
backstage.plugin.catalog.entities.processed.total
backstage.plugin.scaffolder.tasks.completed.total
backstage.plugin.techdocs.builds.active
backstage.plugin.auth.sessions.active.total # todo: technically a core service and a backend plugin
```

##### Core Metrics

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

1. Create a new `RootMetricsService` that initializes metrics and app-wide concerns.
1. Create the plugin-scoped `MetricsService` that provides a metrics service for plugins.
1. Create alpha-related documentation to add to existing core service [docs](https://backstage.io/docs/backend-system/core-services/index).
1. Release the metrics service as alpha.
1. Refactor catalog and scaffolder implementations to use the new (alpha) `MetricsService`.
1. Release the metrics service
1. Offer a migration path for existing adopters to migrate to the new metrics service.
1. Update all documentation to reference the new metrics service.
1. Create follow-up action items to integrate the new metrics service into the core system.
1. Fully deprecate all existing metrics implementations like the existing Prometheus one-off implementations.

## Dependencies

1. The root metrics service MUST BE initialized as EARLY as possible to prevent dependents from receiving no-op meters, while still allowing for configuration.
1. There are one-off implementations of metrics in the wild that may conflict with the proposed service. However, this is unlikely to be a problem as the SDK should continue to pick things up.

## Alternatives

Plugin authors continue to implement their own metrics as they see fit.
