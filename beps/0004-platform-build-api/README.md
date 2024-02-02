---
title: Platform API - Builds
status: provisional
authors:
  - '@ghost'
owners:
project-areas:
  - aaa
  - bbb
creation-date: yyyy-mm-dd
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Platform API - Builds

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Glossary

### Service Provider

An external service that has a specific Backstage integration. Examples include Github, CircleCI, or Snyk.

### Platform Task

A specific task that is integral to the SDLC or developer operations work. It is usually delegated to an external system or service provider, but may be maintained in house. If your company is larger, different organizations may use different service providers.

Examples include

- builds, using Github Actions, CircleCI or Gitlab.
- PRs/MRs, using Github, Gitlab, or AWS CodeCommit.
- deployments, using Github Actions, AWS CodePipeline, or Kubernetes.
- logs, using AWS CloudWatch, Loki, or ElasticSearch.

### Base set

The smallest set of functionality required.

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

This BEP proposes a new Platform API pattern for centralizing data about important Platform Tasks. The Platform API pattern is intended to provide an opinionated base set of actions and data that a Platform Task requires to be an effective in its communication to users. The long term goal of this work is to provide vendor-neutral interfaces that can be easily and swiftly switched out without any increase in cognitive load for Backstage users. We also define a "Builds" Platform Task implementation (Builds API) as a concrete implementation of this Platform API model.

The work described below is not intended to compete with declarative integration or dynamic frontend plugins. This BEP is intended to improve the developer end user experience, and used in complement with the aforementioned initiatives.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

There are 2 primary motivations for this work.

1. As a plugin/core framework writer, I want to be able to reason about higher level Platform Tasks and not need to integrate specifically with service providers' plugins or APIs. Examples where this might be useful would be a CLI with component specific functionality or a new personalized home page with tailored alerts.
2. As a developer end user, I want to be able to view components from other parts of my company or team without cognitive load in understanding a new interface. If my company uses separate service providers across teams or organizations, I want to have a single interface to interact with.
3. As a Backstage administrator, I want to reduce the complexity of my component and system pages. If my company has multiple organizations that use separate service providers, that leads to a lot of nested logic. I also want to be confident that if an organization changes service providers that there is no loss of developer experience in my Backstage instance.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

1. Provide a framework for defining and building Platform Task integrations.
2. Help define the base set for a Platform Task.
3. Define a base set for the "Builds" Platform Task.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

1. Compete with Declarative Integration or Dynamic Frontend plugins.
2. Provide a complete Builds API.
3. Implementing the Builds API for service providers.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

### Platform API Pattern

As described above, the Platform API pattern is the main proposal for this BEP. The goal with this new pattern is to allow Backstage as a platform to start reasoning about higher level abstractions for Platform Tasks. Backstage already has a strong foundation and track record for providing strong abstractions with its `search`, `auth`, and `permissions` plugins. Though these are not Platform Tasks, they integrate with existing service providers to solve specific problems related to discovery, AuthN and AuthZ.

What is a Platform API? A Platform API is an API and implementation that provides a base set of functionality for a specific Platform Task. This API should be vendor agnostic and provide an opinionated set of methods for pulling data related to the Platform Task. If there are multiple implementations of a Platform Task for specific service providers, it's a good idea to look through their APIs and try to define a base set.

Additionally, Platform APIs should be based off of entities and entity refs. You should not generally be including data specific to service providers in your requests to the Platform API unless absolutely necessary. As a rule, Platform APIs should be strongly paginated and care about fresh data and data volume. Many of the objects they will be handling are intended to be used immediately and there may be many of those objects when they're used.

### Builds API

The Builds API is an implementation of the Platform API pattern for "Builds".

Now, what is a "Build"? We define a "Build" as an automated CI pipeline that is triggered by a code change. A "Build" should have

1. a start and end timestamp,
2. current status (running, starting, succeeded or failed),
3. a link to more information and an identifier for who triggered the "Build".

You should be able to re-trigger failed "Builds".

Why "Builds"? Many Platform Tasks have a lot of variance and ambiguity in their abstractions. "Builds" have multiple open source definitions like the Azure Dev Ops plugin, Jenkins plugin, Github Actions plugin and CircleCI plugin. There is clearly shared functionality between the lot both by what they define as a "Build" and what you can do with a "Build".

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Builds API

```yaml
component:
  paths:
    /build/by-entity/{entityRef}/search:
      get:
        description: Get the last n builds. Order defaults to soonest first. Heavily paginated.
        parameters:
          - in: query
            name: triggeredBy
          # or cursor if supported
          - in: query
            name: limit
          - in: query
            name: pageNumber
    /build/by-entity/{entityRef}/retrigger:
      post:
        requestBody:
          application/json:
            # Allow passing additional properties in the request body to the provider. Allows for searching beyond just a build ID.
            type: object
            properties:
              buildId:
                type: string
            additionalProperties: {}
```

### Authentication

> TODO

The main question currently to be solved is what authentication should look like for this pattern. The current set of "Builds" plugins use a combination of both server-side and client-side authentication. For example, Github Actions has no backend plugins and uses the frontend Github authentication and Jenkins has a backend plugin that requires an API key. There are a few directions that this work can take,

1. Move towards Permissions Framework + server side authentication. This would allow the Platform API to perform aggregations or access data for users asynchronously. The primary downside would be that by giving a single principal access to all builds and then enforcing permissions afterwards, users may be able to see things they aren't permissioned to in the source system.
2. Keep the existing set up, using both backend and frontend credentials. This keeps users credentials front and center and delegates security concerns to the service provider systems. The main downside of this approach is that if the service providers plugin uses frontend authentication, the Platform API can't access that data asynchronously easily.

### Forking the default implementation

This work makes a few key assumptions.

1. Users want a unified interface across their different service providers.
2. Advanced users may want to fork the default interface.

We have seen in the past that adopters are cautious to fork the default implementation for their own use case. This is an important concern and a common place of concern for things like the component about card, catalog table page, and others. Our goal with this pattern and implementation is that adopters should not feel the need to fork the default implementation, due in part to strong declarative integration integrations as well as to a well-opinionated implementation.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

- [ ] Platform API pattern described above transformed into an ADR.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

No dependencies at the moment.

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
