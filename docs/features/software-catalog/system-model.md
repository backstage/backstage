---
id: system-model
title: System Model
---

We believe that a strong shared understanding and terminology around systems,
software and resources leads to a better Backstage experience.

_This description originates from
[this RFC](https://github.com/spotify/backstage/issues/390). Note that some of
the concpets are not yet supported in Backstage._

## Concepts

We model our technology using these five concepts (further explained below):

- **Domains** are a high-level grouping of systems
- **Systems** encapsulate the implementation of APIs
- **APIs** are the boundaries between different components and systems
- **Components** are pieces of software
- **Resources** are physical or virtual infrastructure needed to operate a
  system

![Software Ecosystem Model_ Public Github version](https://user-images.githubusercontent.com/24575/77633084-39bcde80-6f4f-11ea-8251-f8df561a3652.png)

### Domain

While systems are the basic level of encapsulation for resources, components and
APIs, it is often useful to group a collection of systems that share
terminology, domain models, business purpose, or documentation, i.e. they form a
bounded context.

For example, it would make sense if the different systems in the “Payments”
domain would come with some documentation on how to accept payments for a new
product or use-case, share the same entity types in their APIs, and integrate
well with each other.

### System

With increasing complexity in software, we believe that systems form an
important abstraction level to help us reason about software ecosystems. Systems
are a useful concept in that they allow us to ignore the implementation details
of a certain functionality for consumers, while allowing the owning team to make
changes as they see fit (leading to low coupling).

A system, in this sense, is a collection of resources and components that
exposes one or several APIs. Components and resources in a system are typically
owned by the same team and are expected to co-evolve. As such, systems usually
consist of at most a handful of components.

For example, a playlist management system might encapsulate a backend service to
update playlists, a backend service to query them, and a database to store them.
It could expose an RPC API, a daily snapshots dataset, and an event stream of
playlist updates.

### Component

A component is a piece of software, for example a mobile feature, web site,
backend service or data pipeline (list not exhaustive). A component can be
tracked in source control, or use some existing open source or commercial
software.

A component can implement APIs for other components to consume. It might depend
on the resources of the system it belongs to, and APIs from other components or
other systems. All other aspects of the component, e.g. any code dependencies,
must be encapsulated.

### API

We believe APIs form an important (maybe the most important) abstraction that
allows large software ecosystems to scale. Thus, APIs are a first class citizen
in the Backstage model and the primary way to discover existing functionality in
the ecosystem.

APIs are implemented by components and form boundaries between components and
systems. They might be defined using an RPC IDL (eg Protobuf, GraphQL, ...), a
data schema (eg Avro, TFRecord, ...), or as code interfaces. In any case, APIs
exposed by components need to be in a known machine-readable format so we can
build further tooling and analysis on top.

Some APIs might be exposed by the system, making them available for any other
Spotify component to consume. Those public APIs must be documented and humanly
discoverable in Backstage.

### Resource

Resources are the infrastructure a system needs to operate, like BigTable
databases, Pub/Sub topics, S3 buckets or CDNs. Modelling them together with
components and systems will better allow us to visualize resource footprint, and
create tooling around them.

## Current status

Backstage currently supports Components and APIs.

## Links

- [Original RFC](https://github.com/spotify/backstage/issues/390)
- [YAML file format](../../architecture-decisions/adr002-default-catalog-file-format.md)
