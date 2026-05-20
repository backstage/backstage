---
title: Definitive Plugin Listing
status: implemented
authors:
  - '@aramissennyeydd'
owners:
  - '@aramissennyeydd'
project-areas:
  - core
creation-date: 2024-02-16
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Definitive Plugin Listing

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/23496)

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

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

The goal of this BEP is to define a new API that can be used to get a list of the currently installed features for an instance or a deployment of multiple different kinds of instances (called a split backend deployment). Plugins can then use this API to dynamically adjust their behavior, either tailoring it for a specific set of plugins or being able to exhaustively search across all installed plugins and/or modules.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

Split backends are a consistently difficult space to operate in and design for. There has been a growing desire for the framework to provide a way to get a list of the installed plugins. This was nearly impossible in the old backend, where plugins were hosted on denormalized routes and had non-standard startup sequences. In the new backend, this has become significantly more doable. Moving this forward unblocks a number of cases that require knowledge of your entire Backstage installation, namely a single OpenAPI spec for your instance, checking installed permissions, and DevTools information.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

1. As a plugin builder, I can get a list of currently installed plugins across my deployment.
1. As a plugin builder, I can get a list of currently installed plugins (with their modules) for a single instance in my deployment.
1. As an integrator/administrator, I can continue to use my static `HostDiscovery` config.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

1. The list of plugins will not change unless there is a config change, they will not be dynamically loaded.
1. The list of plugins will not be used in routing or discovery.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

Two new core services were introduced to surface the installed plugin list. `RootInstanceMetadataService` reports the plugins (and their modules) installed on a single running instance. `RootSystemMetadataService` reports the plugins installed across an entire deployment, derived from the local instance combined with the existing static `HostDiscovery` config. The default implementation does not perform any heavy lifting — it reads from the same data the rest of the backend already uses — and users can override either service to fit their setup.

A separate `@backstage/plugin-gateway-backend` plugin builds on these services to provide centralized frontend-to-backend routing in split deployments, without adding any new HTTP APIs to the core.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### `RootInstanceMetadataService`

A new core service, available as `coreServices.rootInstanceMetadata` and exported from `@backstage/backend-plugin-api`. It exposes the plugins (and modules) wired into the running instance.

```ts
interface RootInstanceMetadataServicePluginInfo {
  readonly pluginId: string;
  readonly modules: ReadonlyArray<{
    moduleId: string;
  }>;
}

interface RootInstanceMetadataService {
  getInstalledPlugins: () => Promise<
    ReadonlyArray<RootInstanceMetadataServicePluginInfo>
  >;
}
```

The list is populated by `BackendInitializer` at startup from the plugins and modules passed to `backend.add(...)`. It only reflects the plugins installed at `backend.start()` time — newly added plugins require a restart to appear.

The information about the plugin itself (such as its `pluginId`, scopes, or dependencies) continues to live on `PluginMetadataService`. The new `RootInstanceMetadataService` is intentionally scoped to instance-level information that the plugin itself does not own. Future additions on this service could include instance URLs, health, or gateway status.

### `RootSystemMetadataService`

A new alpha core service, exported from `@backstage/backend-plugin-api/alpha`. It exposes the plugins available across the entire Backstage deployment — local plugins plus plugins reachable through the existing `discovery.endpoints` static config.

```ts
interface RootSystemMetadataServicePluginInfo {
  readonly pluginId: string;
}

interface RootSystemMetadataService {
  getInstalledPlugins: () => Promise<
    ReadonlyArray<RootSystemMetadataServicePluginInfo>
  >;
}
```

The default implementation (`DefaultRootSystemMetadataService`) aggregates the plugin IDs from `discovery.endpoints` with the plugins reported by `RootInstanceMetadataService`. This means a) deployments without `HostDiscovery` config naturally reduce to the local instance's plugin list, and b) deployments with `HostDiscovery` config can enumerate plugins across the system without any extra configuration.

The service is marked `@alpha` to leave room for the shape to evolve as more deployment-level information (URLs, health, gateway status) is added.

### Gateway plugin

Cross-instance HTTP traffic is handled by a new `@backstage/plugin-gateway-backend` plugin rather than by adding new HTTP APIs to the core services. The gateway depends on `coreServices.rootInstanceMetadata` and `coreServices.discovery`, and proxies any inbound `/api/:pluginId` request to the discovery-resolved backend for that plugin, short-circuiting when the target plugin is hosted locally. This keeps the metadata services purely informational and concentrates the routing concern in a single, optional plugin.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

- `RootInstanceMetadataService` shipped as a stable `@public` core service on `@backstage/backend-plugin-api`.
- `RootSystemMetadataService` shipped as `@alpha` on `@backstage/backend-plugin-api/alpha`, with a default factory in `@backstage/backend-defaults`.
- `@backstage/plugin-gateway-backend` shipped as a new optional backend plugin that consumes the instance metadata service.
- The earlier internal `InstanceMetadataService` (returning `BackendFeatureMeta[]`) is retained as `@internal` for backward compatibility and now delegates to `RootInstanceMetadataService`.

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

### Dedicated HTTP APIs on the core services

Earlier drafts of this BEP proposed exposing the metadata services through dedicated HTTP endpoints under `/.backstage/instanceMetadata/...` and `/.backstage/systemInfo/...`, plus a new `rootUrl` value on `discovery.endpoints` so each instance could publish its own base URL. We ruled this out because the only concrete consumer was cross-instance routing, and the gateway plugin handles that without leaking metadata onto a stable public HTTP surface. Keeping the services in-process leaves us free to evolve the shape under `@alpha` before committing to a wire format.

### Extending `PluginMetadataService`

We could have hung `getInstalledFeatures` (or similar) off the existing `PluginMetadataService`. We chose a separate service so that `PluginMetadataService` continues to describe "this plugin", and the new service describes "this instance / this system". The two concerns rot differently over time and conflating them now would make either one harder to evolve later.

### `BackendFeatureMeta` discriminated union

The original shape was a discriminated union over `{ type: 'plugin' | 'module', ... }`. We pivoted to a plugin-centric shape with nested modules because it matches how callers actually use the data — they almost always want to ask "for plugin X, which modules are installed?" rather than walk a flat list. The discriminated-union form is still available on the legacy `@internal` `InstanceMetadataService` for the few existing call sites.
