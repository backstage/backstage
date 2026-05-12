---
id: monitoring
sidebar_label: 006 - Monitoring
title: Monitoring your deployment
description: Setting up OpenTelemetry and frontend analytics for your Backstage deployment
---

Audience: Admins

## Summary

A production Backstage deployment needs monitoring to track health, diagnose
issues, and understand usage patterns. Backstage provides built-in support
for OpenTelemetry on the backend and an Analytics API on the frontend.

By the end of this page, you will know how to set up both.

## Backend monitoring with OpenTelemetry

Backstage uses [OpenTelemetry](https://opentelemetry.io/) to report metrics
and traces. The setup involves installing a few OpenTelemetry packages,
creating an instrumentation file, and loading it before the backend starts.

Follow the [Setup OpenTelemetry tutorial](../../tutorials/setup-opentelemetry.md)
for step-by-step instructions on installing dependencies, configuring
exporters (Prometheus for metrics, OTLP for traces), and wiring everything
into your backend.

### Key metrics to monitor

Backstage plugins emit metrics that give you insight into system health.
Common examples include:

- `catalog_entities_count` - Total number of entities in the catalog.
- `catalog.processed.entities.count` - Number of entities processed.
- `catalog.processing.duration` - Time spent processing entities.
- `scaffolder.task.count` - Number of scaffolder tasks run.
- `scaffolder.task.duration` - Time taken by scaffolder tasks.

The specific metric names may vary depending on which plugins you have
installed and their versions. These examples help you set up alerts for
things like processing backlogs or unusually slow scaffolder runs.

### Health checks

Backstage provides built-in health check endpoints that you can use for
liveness and readiness probes in Kubernetes or other orchestrators:

- `/.backstage/health/v1/readiness` - Returns healthy when the backend is
  ready to serve traffic.
- `/.backstage/health/v1/liveness` - Returns healthy when the backend
  process is alive.

## Frontend analytics

Backstage provides an Analytics API for tracking user behavior on the
frontend. This is useful for understanding which plugins get the most use
and measuring the return on your Backstage investment.

Several analytics tools are supported through community plugins:

- Google Analytics 4
- New Relic Browser
- Matomo

See the [Analytics documentation](../../frontend-system/building-plugins/08-analytics.md)
for setup instructions.

For frontend error reporting, consider integrating with a service like
Sentry, CloudWatch RUM, or Cloudflare RUM to catch and diagnose client-side
errors.

## Logging

The backend emits structured JSON logs on stdout by default. These logs
include fields like `service`, `plugin`, `level`, and `message` that make
them easy to parse with log aggregation tools (Elasticsearch, Datadog,
Splunk, etc.).

## Next steps

As more users adopt your Backstage instance, you may need to scale the
deployment.

- [Scaling your deployment](./007-scaling.md)
