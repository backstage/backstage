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

Add a core telemetry service to Backstage's framework that provides a unified interface for metrics, tracing, and logging instrumentation. The service would offer OpenTelemetry-based telemetry capabilities with zero configuration defaults while allowing extensibility through app configuration and plugin modules.

- **Plugin Authors** gain a straightforward, documented way to address telemetry, and can focus on business logic instead of reimplementing telemetry plumbing.
- The **community** receives a standard approach to telemetry.
- **Backstage Operators/SRE/Platform Engineers** receive a consistent, reliable stream of metrics from all plugins and the core system, simplifying monitoring, alerting, and troubleshooting. They can enforce metrics standards, aggregate data, and build dashboards more easily. Organizations with their own observability or compliance requirements can override the core service to integrate with proprietary or custom telemetry solutions, without forking or modifying plugins.

## Motivation

There is currently no guidance for plugin authors when it comes to telemetry and while individual plugins may implement their own metrics or tracing, there's no unified service that provides a standardized approach for telemetry and observability. This gap makes it difficult for operators to monitor Backstage deployments effectively and for plugin developers to add observability to their plugins consistently.

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

- We will not backfill missing telemetry for existing plugins
- We will not refactor existing telemetry implementations OTHER THAN the explicility mentioned catalog and scaffolder implementations.
- We will not start by providing a full Backstage SDK (aka recreate the OTEL Node SDK).
- We will not refactor the existing LoggerService. Future work to unify the two would be ideal, but not a goal.

## Proposal

Following similar patterns to other core services, we will create a new `RootTelemetryService` responsible for initializing telemetry and app-wide concerns, and the creation of plugin-specific telemetry services.

## Design Details

We will provide a thin wrapper around the OpenTelemetry Node SDK to provide a consistent interface while re-exporting the types from the SDK. This lets us provide a consistent telemetry interface while leveraging types and concepts already familiar to the community. Additionally, we will rely on the auto insstrumentation features of the SDK as much as possible.

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

### Configuration

All OTEL configuration will be supported via the app's `app-config.yaml` file.

```yaml
# this is not a complete example, but it shows the general structure
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

## Release Plan

1. Create a new `RootTelemetryService` that initializes telemetry and app-wide concerns.
2. Create the plugin-scoped `TelemetryService` that provides a telemetry service for plugins.
3. Release the telemetry service as alpha.
4. Refactor catalog and scaffolder implementations to use the new (alpha) `TelemetryService`.
5. Replace the existing setup docs by intergrating the new `RootTelemetryService` to `createBackend`
6. ...TBD

## Dependencies

1. The root telemetry service MUST BE initialized as EARLY as possible to prevent dependents from receiving no op meters, while still allowing for app-wide configuration.
2. There are one-off implementations of telemetry in the wild that may conflict with the proposed service. However, this is unlikely to be a problem as the SDK should continue to pick things up.

## Alternatives

1. Plugin authors continue to implement their own telemetry as they see fit.
2. Adopters continue using the [setup-opentelemetry](https://backstage.io/docs/tutorials/setup-opentelemetry/) docs as a guide.
