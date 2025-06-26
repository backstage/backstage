---
title: Backstage Telemetry Service
status: implementable
authors:
  - '@kurtaking'
owners:
  - '@kurtaking'
project-areas:
  - backend
  - core
  - framework
creation-date: 2025-06-23
---

# BEP: Backstage Telemetry Service

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Configuration](#configuration)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Add a core telemetry service to Backstage's framework that provides a unified interface for metrics, tracing, and logging instrumentation. The service offers OpenTelemetry-based capabilities with zero configuration defaults while allowing extensibility through app configuration (e.g. `app-config.yaml`) and plugin modules.

## Considerations

1. It's possible a single telemetry service is too encompassing and that more granular services are needed. For example, a `MetricsService` and `TracingService` which would work along side the existing `LoggerService` to solve for telemetry needs.

## Motivation

There is currently no guidance for plugin authors when it comes to telemetry and while individual plugins may implement their own metrics or tracing, there's no unified service that provides a standardized approach for telemetry and observability.

By providing a core telemetry service:

- **Plugin Authors** gain a straightforward, documented way to address telemetry, and can focus on business logic instead of needing to reimplement telemetry plumbing.
- The **community** receives a standard approach to telemetry.
- **Backstage Operators/SRE/Platform Engineers** receive a consistent, reliable stream of metrics from the core system, simplifying monitoring, alerting, and troubleshooting. They can enforce metrics standards, aggregate data, and build dashboards more easily. -**Organizations** with their own observability or compliance requirements can override the core service to integrate with proprietary or custom telemetry solutions, without forking or modifying plugins.

### Goals

Provide a unified service that provides a standardized approach for telemetry where setup docs like [these](https://backstage.io/docs/tutorials/setup-opentelemetry/) are not needed.

- Consistent telemetry patterns across all plugins
- Zero-configuration defaults that work out of the box
- Extensible architecture for custom telemetry backends
- OpenTelemetry integration following industry standards
- Performance monitoring capabilities built into the platform

We will include the following two plugins in the initial release to demonstrate the new telemetry service:

- Replace existing catalog implementation with `TelemetryService`
- Replace existing scaffolder implementation with `TelemetryService`

### Non-Goals

- Adding telemetry instrumentation to existing plugins that don't currently have it
- Only the catalog and scaffolder implementations will be refactored to use the new telemetry service.
- We will not start by providing a full Backstage SDK (aka recreate the OTEL Node SDK).
- We will not refactor the existing LoggerService. Future work to unify telemetry related concerns would be ideal, but not a goal.

## Proposal

Following similar patterns to other core services, we will create a new `RootTelemetryService` responsible for initializing telemetry and app-wide concerns, and the creation of plugin-specific telemetry services.

A core concern is not initializing the telemetry service early enough in the backend lifecycle. Services that initialize before the telemetry service risk receiving no-op meters. To mitigate this, the root service will include a bootstrapping functionality that will be called as early as possible in the backend lifecycle.

## Configuration

All OTEL configuration will be supported via the app's `app-config.yaml` file. The config schema should be based on existing resources such as the [OTEL collector configuration](https://opentelemetry.io/docs/collector/configuration/).

```yaml
# this is not a complete example, but it shows the general idea
telemetry:
  enabled: true

  resource:
    serviceName: backstage-telemetry
    serviceVersion: 0.0.1

  metrics:
    enabled: true
    collection:
      exportIntervalMillis: 15000

    exporters:
      - type: prometheus
        enabled: true
        config:
          port: 9464

  tracing:
    enabled: false

  instrumentations:
    http: false
    knex: false
    express: true
    # ...
```

## Design Details

We will provide a thin wrapper around the OpenTelemetry Node SDK to provide a consistent interface while re-exporting the types from the SDK. This lets us provide a consistent telemetry interface while leveraging types and concepts already familiar to the community. Additionally, we will rely on the auto instrumentation features of the SDK as much as possible.

The decision to leverage the SDK comes from the fact that OpenTelemetry is already the fundamental abstraction for metrics and tracing.

```ts
interface TelemetryService {
  createCounter(name: string, options?: MetricOptions): Counter;
  //

  // provide escape hatch for advanced use cases (???) - todo: I don't like this if we don't have a good reason for it
  getMeter(): Meter;
}

interface RootTelemetryService extends TelemetryService {
  forPlugin(pluginId: string): TelemetryService;

  // provide escape hatches for advanced use cases (???)
  getClient(): NodeSDK; // give access to the SDK
}
```

### Bootstrapping

A core concern is not initializing the telemetry service early enough in the backend lifecycle and services that initialize before the telemetry service risk receiving no-op meters. To mitigate this, the root service will include a bootstrapping mechanism that will be called as early as possible in the backend lifecycle.

Ideally, this is called at the start of the `createBackend` function [[ref](https://github.com/backstage/backstage/blob/ab539cc72bb503618df55815f24c4ba933607460/packages/backend-defaults/src/CreateBackend.ts#L73-L75)], but we need to gain access to the config file at minimum. Ideally the logger as well, but not as crucial.

```ts
export function createBackend(): Backend {
  // ...
  // call the bootstrap function
  Telemetry.bootstrap();
  // ...
  return createSpecializedBackend({ defaultServiceFactories });
}
```

### Plugins & Modules

WIP

<!--
Plugins leverage the plugin-scoped `TelemetryService` to attach and expose the public api for their instrumentation. This is how modules will be able to attach additional instrumentation to the plugin-scoped telemetry service.

Modules need to be able to attach additional instrumentation to the plugin-scoped telemetry service. How do we handle this? How do we prevent conflicts?
-->

## Release Plan

1. Create a new `RootTelemetryService` that initializes telemetry and app-wide concerns.
1. Create the plugin-scoped `TelemetryService` that provides a telemetry service for plugins.
1. Release the telemetry service as alpha.
1. Refactor catalog and scaffolder implementations to use the new (alpha) `TelemetryService`.
1. Replace the existing setup docs by integrating the new `RootTelemetryService` to `createBackend`
1. Release the telemetry service
1. Offer a migration path for existing adopters to migrate to the new telemetry service.
1. Update all documentation to reference the new telemetry service.
1. Create follow-up action items to integrate the new telemetry service into the core system.
1. Fully deprecate all existing telemetry implementations like the existing Prometheus one-off implementations.

## Dependencies

1. The root telemetry service MUST BE initialized as EARLY as possible to prevent dependents from receiving no op meters, while still allowing for app-wide configuration.
1. There are one-off implementations of telemetry in the wild that may conflict with the proposed service. However, this is unlikely to be a problem as the SDK should continue to pick things up.

## Alternatives

1. Plugin authors continue to implement their own telemetry as they see fit.
1. Adopters continue using the [setup-opentelemetry](https://backstage.io/docs/tutorials/setup-opentelemetry/) docs as a guide.

## Outstanding Questions

1. Are there enough Backstage-isms to build an additional layer of abstraction for metrics and tracing on top of the OpenTelemetry SDK? Do we re-export the types from the OpenTelemetry SDK or do we create our own? How do we handle breaking changes?
1. How do we guarantee that the telemetry service is initialized early enough in the backend lifecycle, while still allowing for app-wide configuration?
1. Should we provide an escape hatch for advanced use cases?
1. Should there be a single telemetry service or should we provide more granular services (e.g. adding separate `MetricsService` and `TracingService`)?
1. What core services could leverage the auto instrumentation features of the OpenTelemetry SDK? (e.g. `DatabaseService` could leverage the `knex` auto instrumentation, `HttpService` could leverage the `express` auto instrumentation, etc.)
