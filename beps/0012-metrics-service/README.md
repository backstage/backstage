---
title: Backstage Metrics Service
status: implementable
authors:
  - '@kurtaking'
owners:
  - '@kurtaking'
project-areas:
  - core-framework
creation-date: 2025-06-23
---

## Table of Contents

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Naming Conventions](#naming-conventions)
- [Design Details](#design-details)
  - [References](#references)
  - [Integration with OpenTelemetry Auto-Instrumentation](#integration-with-opentelemetry-auto-instrumentation)
  - [Configuration](#configuration)
  - [Interface](#interface)
    - [Plugin Metrics Service](#plugin-metrics-service)
    - [Example](#example)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Add a core `MetricsService` to Backstage's framework to provide a unified interface for metrics instrumentation. The service offers industry standards (OTEL) while focusing the `MetricsService` on distinct Backstage concerns, following the same pattern as other core services (DatabaseService builds on Knex, LoggerService builds on Winston, HttpRouterService builds on Express, etc.).

## Motivation

While individual plugins may implement their own metrics, there's no standardized approach leading to inconsistent metrics patterns across the ecosystem and incompatibility with OpenTelemetry semantic conventions. For example, a plugin implementing MCP functionality might incorrectly namespace metrics as `backstage_mcp_client_duration` when OpenTelemetry semantic conventions explicitly define `mcp.client.operation.duration` as the standard.

By providing a core metrics service:

- **Plugin Authors** and the **Community** gain a straightforward way to address metrics instrumentation and can focus on business logic instead of needing to reimplement metrics plumbing.
- **Backstage Admins** receive a reliable stream of metrics from the core system for monitoring, alerting, and troubleshooting.

### Goals

- Plugin identification via OpenTelemetry Instrumentation Scope
- Consistent metrics patterns across all plugins
- Aligned with OpenTelemetry industry standards
- Provide a familiar interface as other core services

The catalog and scaffolder plugins will be updated to use the new metrics service in the initial alpha release.

### Non-Goals

- Providing a way to configure the OpenTelemetry SDK. This is out of scope for this BEP.
- Adding metrics to plugins missing existing metrics (outside of catalog and scaffolder)
- Tracing and other telemetry concerns are out of scope for this BEP.
- Refactoring the existing `LoggerService`. Future work to unify observability related concerns would be ideal, but not a goal.

## Proposal

Following similar patterns to other core services, create a new `RootMetricsService` responsible for root-level concerns and the creation of plugin-specific `MetricsService` instances.

## Naming Conventions

All Backstage metrics follow this hierarchical pattern:

`backstage.{scope}.{scope_name}.{metric_name}`

**Where:**

- `backstage` is the root namespace for all Backstage metrics
- `{scope}` is the system scope (either **plugin** or **core**)
- `{scope_name}` is the name of the plugin or core service (e.g., `catalog`, `scaffolder`, `database`, `scheduler`)
- `{metric_name}` is the hierarchical metric name as provided by the plugin author (e.g., `entity.count`, `tasks.completed.total`)

### Scope

The `scope` represents where it belongs in the Backstage ecosystem.

- `plugin` - A plugin-specific metric (e.g. `backstage.plugin.catalog.entity.count`)
- `core` - A metric provided by the core system (e.g. `backstage.core.database.connections.active`)

### Plugin-Scoped Metrics

Pattern: `backstage.plugin.{pluginId}.{metric_name}`

```yaml
# Examples
backstage.plugin.catalog.entities.processed.total
backstage.plugin.scaffolder.tasks.completed.total
backstage.plugin.techdocs.builds.active
backstage.plugin.auth.sessions.active.total # todo: technically a core service and a backend plugin
```

### Core-Scoped Metrics

Pattern: `backstage.core.{service}.{metric_name}`

```yaml
# Examples
backstage.core.database.connections.active
backstage.core.scheduler.tasks.queued.total
backstage.core.httpRouter.requests.total
```

## Design Details

### References

- [General naming considerations](https://opentelemetry.io/docs/specs/semconv/general/naming/#general-naming-considerations)
- [Acquiring a meter](https://opentelemetry.io/docs/languages/js/instrumentation/#acquiring-a-meter)

### Integration with OpenTelemetry Auto-Instrumentation

The `MetricsService` **complements** rather than duplicates auto-instrumentation by focusing on **application-level metrics** that only Backstage can provide. For example, the catalog plugin may want to track the number of entities processed by the `refresh` operation and the kind of entity being processed.

```ts
// Auto-instrumentation provides (automatically):
// - http.server.requests.total{method="GET", route="/catalog/entities", status_code="200"}
// - http.server.request.duration{method="GET", route="/catalog/entities"}

// MetricsService provides (manually):
const entityMetrics = metricsService.createCounter('entities.processed.total');
entityMetrics.add(entities.length, {
  operation: 'refresh',
  'entity.kind': 'Component',
});

// Metric is now available as `entities.processed.total`
```

### Configuration

A challenging factor of only introducing a `MetricsService` is the need to collect other OTEL-related configuration such as resources, tracing providers, views, and more prior to starting the SDK. This means that in order to introduce a `MetricsService`, we must support all OTEL Node SDK configuration along with it. Along with this, the official recommendation from the OTEL team is to not initialize and start the SDK on behalf of the user.

With this, **we will not include any configuration** as part of this BEP. Users will be responsible for initializing the SDK based on the current guidance

### Interface

Provide a wrapper around OpenTelemetry's API while leveraging the types from the `@opentelemetry/api` package. This introduces concepts already familiar to both the Backstage community and those familiar with OpenTelemetry.

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

#### Plugin Metrics Service

Each plugin receives a metrics service that automatically configures the Instrumentation Scope to identify the plugin. The scope name follows the pattern `backstage-plugin-{pluginId}`.

```ts
export const metricsServiceFactory = createServiceFactory({
  service: coreServices.metrics,
  deps: {
    pluginMetadata: coreServices.pluginMetadata,
  },
  factory: ({ pluginMetadata }) => {
    const pluginId = pluginMetadata.getId();
    const scopeName = `backstage-plugin-${pluginId}`;

    return new DefaultMetricsService(scopeName, version, ...);
  },
});
```

#### Example

```ts
const entitiesProcessed = metricsService.createCounter(
  'entities.processed.total',
  {
    description: 'Total entities processed during refresh',
    unit: '{entity}',
  },
);

entitiesProcessed.add(100);

// ...
// metric is now available as `backstage.plugin.catalog.entities.processed.total`
```

## Release Plan

1. Create the new metrics-related services.
1. Create alpha-related documentation to add to existing core service [docs](https://backstage.io/docs/backend-system/core-services/index).
1. Release the metrics service under `@alpha`.
1. Mark all existing metrics implementations as deprecated.
1. Refactor catalog and scaffolder plugins to use the new (alpha) `MetricsService`.
1. Offer a migration path for existing adopters to migrate to the new metrics service.
1. Release the metrics service under `@public`
1. Update remaining documentation to reference the new metrics service.
1. Create follow-up action items to integrate the new metrics service into the core system.
1. Fully deprecate all existing metrics implementations like the existing Prometheus one-off implementations.

## Deprecation Plan

1. Deprecation warning are added to all existing metrics
2. New metrics will run in parallel with the deprecated ones for a period of time
3. All existing metrics are removed from the codebase in the next major version

## Dependencies

1. The `otel` SDK MUST BE initialized as EARLY as possible to prevent dependents from receiving no-op meters - we will not change the current guidance on this
1. There are one-off implementations of metrics in the wild that may conflict with the proposed service. However, this is unlikely to be a problem as the SDK should continue to pick things up.

## Alternatives

- Plugin authors continue to implement their own metrics as they see fit.
- A combined TelemetryService that provides both metrics and tracing.

### Rejected: Forced Namespace Prefixes

Prepend `backstage.plugin.{pluginId}.` to all metric names. This was the original proposal but conflicts with OpenTelemetry semantic conventions.

**Problems:**

- Makes it impossible to use standard semantic conventions like `mcp.*`, `gen_ai.*`, `http.*`
- Breaks compatibility with industry-standard observability tooling
- Prevents cross-service metric aggregation
- Goes against OpenTelemetry best practices and official guidance

**Example of conflict:**

```ts
// Plugin wants to emit: mcp.client.operation.duration
// Framework forces: backstage.plugin.mcp-actions.mcp.client.operation.duration
// This violates the semantic convention and breaks tooling
```
