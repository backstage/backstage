---
id: metric-naming-conventions
title: Metric Naming Conventions
description: Overview of metric naming conventions in Backstage
---

# Metric Naming Conventions

This document defines the standardized naming conventions for all metrics in the Backstage ecosystem based on [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/reference/specification/metrics/semantic_conventions/). Following these conventions ensures consistency, discoverability, and compatibility with monitoring tools.

:::tip
We strive to stay aligned with the OpenTelemetry best practices. When in doubt, refer to the OpenTelemetry documentation. If you notice any inconsistencies, please open an issue or submit a PR.
:::

## Overview

All Backstage metrics follow a hierarchical naming pattern that provides clear context about where the metric originates and what it measures. We recommend following this pattern for all metrics.

```md
backstage.{scope}.{scope_name}.{metric_name}
```

**Building blocks:**

- `backstage` - Root namespace for all Backstage metrics
- `{scope}` - System scope (`plugin` or `framework`)
- `{scope_name}` - Name of the plugin or framework service
- `{metric_name}` - Hierarchical metric name provided by the implementer

## Scopes

### Plugin Scope

**Pattern:** `backstage.plugin.{pluginId}.{metric_name}`

Plugin-scoped metrics represent functionality specific to individual plugins. Each plugin operates as an independent microservice with its own metrics namespace.

**Examples:**

```md
backstage.plugin.catalog.entities.operations.total
backstage.plugin.scaffolder.tasks.total
backstage.plugin.techdocs.builds.duration
```

### Framework Scope

**Pattern:** `backstage.framework.{service}.{metric_name}`

Framework-scoped metrics represent core services that support multiple plugins or provide cross-cutting functionality.

**Examples:**

```md
backstage.framework.database.connections.active
backstage.framework.database.operations.duration
backstage.framework.scheduler.tasks.total
backstage.framework.httpRouter.middleware.duration
```

## Metric Name Structure

The `{metric_name}` component should be hierarchical using dot notation to create logical groupings.

### Recommended Hierarchies

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

## Metric Type Conventions

Use attributes to distinguish between different statuses, operations, or outcomes rather than creating separate metrics.

### Counters (`.total` suffix)

Use `.total` suffix for counters that measure cumulative values:

```md
# Good - consolidated with attributes

backstage.plugin.catalog.entities.operations.total
backstage.plugin.scaffolder.tasks.total
backstage.framework.database.operations.total

# Avoid - separate metrics for status/operation

backstage.plugin.catalog.entities.created.total # Use attributes instead
backstage.plugin.catalog.entities.updated.total # Use attributes instead
backstage.plugin.scaffolder.tasks.completed.total # Use attributes instead
backstage.plugin.scaffolder.tasks.failed.total # Use attributes instead
```

### UpDownCounters (dynamic counts)

Use descriptive names that indicate the value can increase or decrease:

```md
backstage.framework.database.connections.active
backstage.plugin.scaffolder.tasks.running
backstage.framework.scheduler.tasks.pending
```

### Histograms (`.duration`, `.size` suffixes)

Use descriptive suffixes for histograms based on what they measure:

```md
# Duration measurements

backstage.plugin.catalog.operations.duration
backstage.framework.database.operations.duration
backstage.plugin.scaffolder.tasks.duration

# Size measurements

backstage.framework.httpRouter.request.size
backstage.framework.database.result.size
backstage.plugin.techdocs.document.size
```

### Gauges (current state)

Gauges typically don't need special suffixes, but use descriptive names:

```md
backstage.framework.database.connections.count
backstage.plugin.catalog.entities.count
backstage.plugin.scaffolder.tasks.queued
```

## Attribute Naming

Attributes (labels/tags) provide dimensional context to metrics. Use attributes to distinguish between different operations, statuses, and outcomes instead of creating separate metrics.

### Standard Attributes

**Always use these attributes when applicable:**

```md
# Operation and status context

operation: "create" | "read" | "update" | "delete" | "refresh" | "validation"
status: "success" | "error" | "timeout"

# Entity context (for catalog metrics)

entity.kind: "Component" | "API" | "Resource" | "System" | "Domain" | "..."
entity.type: specific entity type
entity.namespace: entity namespace

# Error context (when status="error")

error.type: error class name or type
error.code: specific error code
```

### Attribute Naming Rules

1. **Use `snake_case`** for attribute names
2. **Be consistent** across related metrics
3. **Keep cardinality reasonable** (avoid unique identifiers)
4. **Use semantic names** that clearly indicate the attribute's purpose
5. **Use attributes instead of separate metrics** for different statuses/operations

```md
# Good attributes

entity.kind: 'Component'
operation: 'refresh'
status: 'success'
db.table.name: 'entities'

# Avoid high cardinality

user.id: 'user123456' # Too many unique values
request.id: 'req-abc-123' # Unique per request
entity.name: 'my-service-api' # Too many unique values (use entity.kind instead)

# Avoid unclear names

type: 'thing' # Too generic
t: 'Component' # Too abbreviated
```

## Plugin-Specific Examples

### Catalog Plugin

```md
# Entity operations

backstage.plugin.catalog.entities.operations.total

# Attributes: { operation: "create" | "update" | "delete", entity.kind: "Component", status: "success" | "error" }

# Processing operations

backstage.plugin.catalog.operations.total

# Attributes: { operation: "refresh" | "validation" | "provider_sync", status: "success" | "error" }

backstage.plugin.catalog.operations.duration

# Attributes: { operation: "refresh" | "validation", status: "success" | "error" }

# Current state

backstage.plugin.catalog.entities.count

# Attributes: { entity.kind: "Component", entity.namespace: "default" }

# Common attributes for all catalog metrics

{
"entity.kind": "Component",
"entity.namespace": "default",
"operation": "refresh",
"provider": "github",
"status": "success"
}
```

### Scaffolder Plugin

```md
# Task lifecycle

backstage.plugin.scaffolder.tasks.total

# Attributes: { status: "created" | "completed" | "failed", template: "react-component" }

backstage.plugin.scaffolder.tasks.duration

# Attributes: { template: "react-component", status: "success" | "error" }

# Template operations

backstage.plugin.scaffolder.templates.operations.total

# Attributes: { operation: "render", status: "success" | "error" }

backstage.plugin.scaffolder.templates.operations.duration

# Attributes: { operation: "render", template: "react-component" }

# Action execution

backstage.plugin.scaffolder.actions.total

# Attributes: { action: "github:repo:create", status: "success" | "error" }

backstage.plugin.scaffolder.actions.duration

# Attributes: { action: "github:repo:create", status: "success" | "error" }

backstage.plugin.scaffolder.tasks.queued

# Attributes: { template: "react-component" }

# Common attributes for all scaffolder metrics

{
"template": "react-component",
"action": "github:repo:create",
"status": "success",
"operation": "execute"
}
```

## Framework Service Examples

### Scheduler Service

```md
# Task management (consolidated)

backstage.framework.scheduler.tasks.total

# Attributes: { status: "scheduled" | "completed" | "failed", task.type: "catalog_refresh" }

backstage.framework.scheduler.tasks.duration

# Attributes: { task.type: "catalog_refresh", status: "success" | "error" }

backstage.framework.scheduler.tasks.running
backstage.framework.scheduler.tasks.queued

# Common attributes for all scheduler metrics

{
"task.type": "catalog_refresh",
"task.frequency": "PT1H",
"status": "success"
}
```

## Anti-Patterns to Avoid

### ❌ Bad Naming Examples

```md
# Missing namespace

catalog.entities.count # Should start with backstage.

# Wrong scope

backstage.catalog.entities.count # Should be backstage.plugin.catalog.

# Separate metrics for status/operation (use attributes instead)

backstage.plugin.catalog.entities.created.total # Use operation="create" attribute
backstage.plugin.catalog.entities.updated.total # Use operation="update" attribute
backstage.plugin.scaffolder.tasks.failed.total # Use status="failed" attribute
backstage.plugin.catalog.refresh.errors.total # Use status="error" attribute

# Inconsistent suffixes

backstage.plugin.catalog.entities.cnt # Use .count or .total
backstage.plugin.catalog.processing_time # Use .duration

# Generic/unclear names

backstage.plugin.catalog.stuff.count # Be specific
backstage.plugin.catalog.thing.duration # What thing?

# Missing hierarchy

backstage.plugin.catalog.count # Count of what?

# Inconsistent style

backstage.plugin.catalog.entitiesCount # Use snake_case in hierarchies
backstage.plugin.catalog.entity-count # Use dots, not dashes
```

### ❌ Bad Attribute Examples

```md
# High cardinality

user_id: '12345' # Too many unique values
entity_name: 'my-service' # Use entity.kind instead
request_id: 'req-abc-123' # Don't track individual requests

# Inconsistent naming

entityType: 'Component' # Use entity.kind
httpMethod: 'GET' # Use http.method
errorType: 'ValidationError' # Use error.type

# Unclear values

status: 'ok' # Use "success"
type: '1' # Use descriptive values
result: 'good' # Be specific
```

## Validation Checklist

The following can be used as a validation checklist for metrics. It is not exhaustive, but should be used as a guide to ensure that metrics are named correctly.

### ✅ Naming Structure

- Starts with `backstage.`
- Uses correct scope (`plugin` or `framework`)
- Includes proper scope name (plugin ID or service name)
- Uses hierarchical dot notation for metric name
- Follows appropriate suffix conventions
- Uses consolidated metrics with attributes instead of separate metrics for status/operation

### ✅ Consistency

- Aligns with existing metrics in the same plugin/service
- Uses standard attribute names where applicable
- Uses attributes for different statuses/operations instead of separate metrics
- Follows [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/specs/semconv/general/metrics/) where relevant

### ✅ Clarity

- Metric name clearly indicates what is measured
- Attribute names are descriptive and unambiguous
- Units are specified in the metric options
- Description explains the metric's purpose
- Attributes provide sufficient context to answer operational questions
