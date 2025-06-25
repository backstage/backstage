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
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Add a core telemetry service to Backstage's backend system that provides a unified interface for metrics, tracing, and logging instrumentation. The service would offer OpenTelemetry-based telemetry capabilities with zero configuration defaults while allowing extensibility through plugin modules.

## Motivation

There is currently no guidance for plugin authors when it comes to telemetry and while individual plugins may implement their own metrics or tracing, there's no unified service that provides a standardized approach for telemetry and observability. This gap makes it difficult for operators to monitor Backstage deployments effectively and for plugin developers to add observability to their plugins consistently.

### Goals

Provide a unified service that provides a standardized approach for telemetry where setup docs like [these](https://backstage.io/docs/tutorials/setup-opentelemetry/) are not needed.

- Consistent telemetry patterns across all plugins
- Zero-configuration defaults that work out of the box
- Extensible architecture for custom telemetry backends
- OpenTelemetry integration following industry standards
- Performance monitoring capabilities built into the platform

### Non-Goals

- We will not backfill missing telemetry for existing plugins.
- We will not recreate the OTEL Node SDK

## Proposal

Following similar patterns to other core services, we will create a new `RootTelemetryService` responsible for initializing telemetry and app-wide concerns, and the creation of plugin-specific telemetry services.

## Design Details

We will provide a thin wrapper around the OpenTelemetry Node SDK to provide a consistent interface while re-exporting the types from the SDK. This lets us provide a consistent telemetry interface while leveraging types and concepts already familiar to the community.

The decision to leverage the SDK comes from the fact that OpenTelemetry is already the fundamental abstraction for metrics and tracing.

## Release Plan

TBD

## Dependencies

- There are one-off implementations of telemetry in the wild that may conflict with the proposed service.

## Alternatives

1. Plugin authors continue to implement their own telemetry as they see fit.
2. Adopters continue using the [setup-opentelemetry](https://backstage.io/docs/tutorials/setup-opentelemetry/) docs as a guide.
