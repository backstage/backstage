---
title: Definitive Plugin Listing
status: implementable
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

Split backends are a consistently difficult space to operate in and design for. There has been a growing desire for the framework to provide a way to get a list of the installed plugins. This was nearly impossible in the old backend, where plugins were hosted on denormalized routes and had non-standard startup sequences. In the new backend, this has become significantly more doable. Moving this forward would unblock a number of cases that require knowledge of your entire Backstage installation, namely a single OpenAPI spec for your instance, checking installed permissions, and DevTools information.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

1. As a plugin builder, I can now get a list of currently installed features across my deployment.
1. As a plugin builder, I can get a list of currently installed features for a single instance in my deployment.
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

Most of the work below is API definitions for hosting the list of features and better abstractions to make that list available through HTTP. This is not intended to perform much heavy lifting, that can happen in a further design. We will build a default implementation on the existing static `HostDiscovery` config definition for split deployments. Users can override the API as they need.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Glossary

### New Type `BackendFeatureMeta`

```ts
type BackendFeatureMeta =
  | {
      type: 'plugin';
      pluginId: string;
    }
  | {
      type: 'module';
      pluginId: string;
      moduleId: string;
    };
```

### New `InstanceMetadataService`

While we could attach the existing information to the `PluginMetadataService`, we propose a new service that handles instance-level information. The existing `PluginMetadataService` should reveal information about the plugin itself, its `pluginId`, dependencies or similar. The new `InstanceMetadataService` should give you information about the entire Backstage instance that you're interrogating. One could imagine this service also having information about instance URLs, health or gateway status.

```ts
interface InstanceMetadataService {
  getLocallyInstalledFeatures: () => BackendFeatureMeta[];
}
```

Currently, this would need to be bootstrapped directly in `BackendInitializer` or `BackstageBackend`. It may make sense to create a new `FeatureRegistry` class that can expose this instead similar to the `PluginMetadataService`.

### New HTTP API to expose `InstanceMetadataService`

We also propose exposing the new services through an HTTP API, so that these can be queried.

```yaml
paths:
  /.backstage/instanceInfo/features/installed:
    get:
      summary: Get a list of installed features for this instance.
      operationId: GetInstalledFeaturesByInstance
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  oneOf:
                    - type: object
                      properties:
                        type:
                          type: string
                          enum:
                            - plugin
                        pluginId: { type: string }
                    - type: object
                      properties:
                        type:
                          type: string
                          enum:
                            - module
                        pluginId: { type: string }
                        moduleId: { type: string }
```

### New `SystemMetadataService`

This will be a new core service. The idea is that it will show information about your whole Backstage deployment, which can have multiple instances. Initially, this will host aggregate information around instances in the deployment, like their internal and external URLs.

```ts
interface BackstageInstance {
  url: {
    internal: string;
    external: string;
  };
}

interface SystemMetadataService {
  listInstances: () => BackstageInstance[];
}
```

By default, this will
a. be the exact same as `InstanceMetadataService` if we are not using `HostDiscovery` static config, or
b. use the `HostDiscovery` static config to fetch other instance's base URLs. This would require an additional set of config to provide the instance base URL instead of the plugin-specific routing that currently exists.

#### New config value example

```yaml
discovery:
  endpoints:
    - target: https://internal.example.com/internal-catalog
      # New value to hold the Backstage base URL.
      # For targets that point directly to a URL with no plugin templating, there may be no good value here
      #  and it will require users to update their routing to expose this.
      rootUrl: https://internal.example.com/
      plugins: [catalog]
    - target: https://internal.example.com/secure/api/{{pluginId}}
      # New value to hold the Backstage base URL.
      rootUrl: https://internal.example.com/secure/
      plugins: [auth, permission]
    - target:
        internal: https://internal.example.com/backstage/api/search
        external: https://example.com/backstage/api/search
      # New value to hold the Backstage base URL.
      rootUrl:
        internal: https://internal.example.com/backstage
        external: https://example.com/backstage
      plugins: [search]
```

### `SystemMetadataService` HTTP API

```yaml
paths:
  /.backstage/systemInfo/instances:
    get:
      summary: Get a list of instances in this Backstage system.
      operationId: ListInstances
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    url:
                      oneOf:
                        - type: string
                        - type: object
                          properties:
                            internal: { type: string }
                            external: { type: string }
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

- Implement the proposed service + plugin as _experimental_.
- Create a new plugin to host the instance service HTTP API.

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
