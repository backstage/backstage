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

# BEP: Definitive Plugin Listing

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

The goal of this BEP is to define a new API that can be used to get a list of the currently installed features for an instance or a deployment of multiple different kinds of instances (called a split backend deployment). Plugins can then use this API to dynamically adjust their behavior, either tailoring it for a specific set of plugins or being able to exhaustively search across all installed plugins and/or modules.

## Motivation

Split backends are a consistently difficult space to operate in and design for. There has been a growing desire for the framework to provide a way to get a list of the installed plugins. This was nearly impossible in the old backend, where plugins were hosted on denormalized routes and had non-standard startup sequences. In the new backend, this has become significantly more doable. Moving this forward unblocks a number of cases that require knowledge of your entire Backstage installation, namely a single OpenAPI spec for your instance, checking installed permissions, and DevTools information.

### Goals

1. As a plugin builder, I can get a list of currently installed plugins across my deployment.
1. As a plugin builder, I can get a list of currently installed plugins (with their modules) for a single instance in my deployment.
1. As an integrator/administrator, I can continue to use my static `HostDiscovery` config.

### Non-Goals

1. The list of plugins will not change unless there is a config change, they will not be dynamically loaded.
1. The list of plugins will not be used in routing or discovery.

## Proposal

Two new core services were introduced to surface the installed plugin list. `RootInstanceMetadataService` reports the plugins (and their modules) installed on a single running instance. `RootSystemMetadataService` reports the plugins installed across an entire deployment, derived from the local instance combined with the existing static `HostDiscovery` config. The default implementation does not perform any heavy lifting — it reads from the same data the rest of the backend already uses — and users can override either service to fit their setup.

## Design Details

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

The information about the plugin itself (such as its `pluginId`, scopes, or dependencies) continues to live on `PluginMetadataService`. The new `RootInstanceMetadataService` is intentionally scoped to instance-level information that the plugin itself does not own. Future additions on this service could include instance URLs or health.

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

The service is marked `@alpha` to leave room for the shape to evolve as more deployment-level information (URLs or health) is added.

## Release Plan

- `RootInstanceMetadataService` shipped as a stable `@public` core service on `@backstage/backend-plugin-api`.
- `RootSystemMetadataService` shipped as `@alpha` on `@backstage/backend-plugin-api/alpha`, with a default factory in `@backstage/backend-defaults`.
- The earlier internal `InstanceMetadataService` (returning `BackendFeatureMeta[]`) is retained as `@internal` for backward compatibility and now delegates to `RootInstanceMetadataService`.

## Dependencies

None

## Alternatives

### Dedicated HTTP APIs on the core services

Earlier drafts of this BEP proposed exposing the metadata services through dedicated HTTP endpoints under `/.backstage/instanceMetadata/...` and `/.backstage/systemInfo/...`, plus a new `rootUrl` value on `discovery.endpoints` so each instance could publish its own base URL. We ruled this out because the current use cases only need in-process access to plugin listings. Keeping the services in-process avoids committing to a stable public HTTP surface or wire format before the deployment-level shape has settled.

### Extending `PluginMetadataService`

We could have hung `getInstalledFeatures` (or similar) off the existing `PluginMetadataService`. We chose a separate service so that `PluginMetadataService` continues to describe "this plugin", and the new service describes "this instance / this system". The two concerns rot differently over time and conflating them now would make either one harder to evolve later.

### `BackendFeatureMeta` discriminated union

The original shape was a discriminated union over `{ type: 'plugin' | 'module', ... }`. We pivoted to a plugin-centric shape with nested modules because it matches how callers actually use the data — they almost always want to ask "for plugin X, which modules are installed?" rather than walk a flat list. The discriminated-union form is still available on the legacy `@internal` `InstanceMetadataService` for the few existing call sites.
