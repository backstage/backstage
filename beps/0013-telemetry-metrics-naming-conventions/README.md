---
title: OpenTelemetry Metrics Naming Conventions for Backstage
status: implementable
authors:
  - '@kurtaking'
owners:
  - '@kurtaking'
project-areas:
  - framework
  - telemetry
creation-date: 2025-06-26
---

# BEP: OpenTelemetry Metrics Naming Conventions for Backstage

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

This proposal establishes standardized naming conventions for OpenTelemetry metrics across the Backstage ecosystem. It defines a hierarchical naming pattern that ensures consistency, discoverability, and compliance with OpenTelemetry semantic conventions while providing clear guidance for plugin and module authors.

## Motivation

Currently, Backstage has:

- Mixed metric naming patterns: Legacy Prometheus metrics (`catalog_entities_count`) alongside newer OpenTelemetry metrics (`catalog.processing.queue.delay`)
- No standard pattern for plugin-specific metrics
- Difficulty correlating metrics across plugins and providers
- Some existing metrics don't follow OpenTelemetry semantic conventions

We need to decided on a pattern that we can use for the telemetry service to obfuscate the underlying implementation details.

### Goals

- Establish consistent naming patterns across all Backstage metrics
- Ensure OpenTelemetry compliance with semantic conventions
- Provide clear guidance for plugin and service authors

### Non-Goals

- Breaking existing metrics immediately (backward compatibility maintained)
- Forcing all plugins to emit the same metrics
- Defining specific metric values or thresholds

## Proposal

Provide guidance for naming metrics for Backstage.

## Design Details

### Core Naming Pattern

All Backstage metrics MUST follow this hierarchical pattern:

`backstage.{scope}.{category}.{metric_name}`

**Where:**

- `backstage` is the root namespace for all Backstage metrics
- `{scope}` is the system scope (`pluginId`, `core` for core services)
- `{category}` is the logical grouping within the `{scope}`
- `{metric_name}` is the name of the metric

### Scope

The `scope` represents where it belongs in the Backstage ecosystem.

- `pluginId` - A plugin-specific metric (e.g. `backstage.plugin.catalog.entities.count`)
- `core` - A core service metric (e.g. `backstage.core.database.connections.active`)

#### Plugin Metrics

Pattern: `backstage.{pluginId}.{category}.{metric_name}`

```yaml
# Examples
backstage.catalog.entities.processed.total
backstage.scaffolder.tasks.completed.total
backstage.techdocs.builds.active
backstage.auth.sessions.active.total
```

#### Core Metrics

Pattern: `backstage.core.{category}.{metric_name}`

```yaml
# Examples
backstage.core.database.connections.active
backstage.core.scheduler.tasks.queued.total
backstage.core.http.requests.total
```

## Release Plan

- Provide documentation for the naming conventions
- Release as part of the larger telemetry service proposal

## Dependencies

- [0012-telemetry-service](../0012-telemetry-service/README.md)

## Alternatives

Adopters implement their own metrics and naming conventions.
