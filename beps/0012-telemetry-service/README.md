---
title: Backstage Telemetry Service
status: implementable
authors:
  - '@kurtaking'
owners:
  - '@kurtaking'
project-areas:
  - backend
  - framework
creation-date: 2025-06-23
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed
-->

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

While individual plugins may implement their own metrics or tracing, there's no unified service that provides a standardized approach for telemetry and observability. This gap makes it difficult for operators to monitor Backstage deployments effectively and for plugin developers to add observability to their plugins consistently.

### Goals

- Consistent telemetry patterns across all plugins
- Zero-configuration defaults that work out of the box
- Extensible architecture for custom telemetry backends
- OpenTelemetry integration following industry standards
- Performance monitoring capabilities built into the platform

### Non-Goals

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
