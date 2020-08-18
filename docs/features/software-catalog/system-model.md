---
id: system-model
title: System Model
---

We believe that a strong shared understanding and terminology around software
and resources leads to a better Backstage experience.

_This description originates from
[this RFC](https://github.com/spotify/backstage/issues/390). Note that some of
the concepts are not yet supported in Backstage._

## Core Entities

We model software in the Backstage catalogue using these three core entities
(further explained below):

- **Components** are individual pieces of software
- **APIs** are the boundaries between different components
- **Resources** are physical or virtual infrastructure needed to operate a
  component

![](system-model-core-entities.png)

### Component

A component is a piece of software, for example a mobile feature, web site,
backend service or data pipeline (list not exhaustive). A component can be
tracked in source control, or use some existing open source or commercial
software.

A component can implement APIs for other components to consume. In turn it
might depend on APIs implemented by other components, or resources that are
attached to it at runtime.

### API

APIs form an important (maybe the most important) abstraction that allows large
software ecosystems to scale. Thus, APIs are a first class citizen in the
Backstage model and the primary way to discover existing functionality in
the ecosystem.

APIs are implemented by components and form boundaries between components. They
might be defined using an RPC IDL (eg Protobuf, GraphQL, ...), a data schema
(eg Avro, TFRecord, ...), or as code interfaces. In any case, APIs exposed by
components need to be in a known machine-readable format so we can
build further tooling and analysis on top.

APIs have a visibility: they are either public (making them available for any
other component to consume), restricted (only available to a whitelisted set of
consumers), or private (only available within their system). As public APIs are
going to be the primary way interaction between components, Backstage supports
documenting, indexing and searching all APIs so we can browse them as
developers.

### Resource

Resources are the infrastructure a component needs to operate at runtime, like
BigTable databases, Pub/Sub topics, S3 buckets or CDNs. Modelling them together
with components and systems will better allow us to visualize resource
footprint, and create tooling around them.

## Ecosystem Modeling

A large catalogue of components, APIs and resources can be highly granular
and hard to understand as a whole. It might thus be convenient to use the label
and annotation features in the Backstage catalogue to further categorize these
entities in a way that makes sense for your company. For example, we set a
system label on components at Spotify which allows us to further group related
entities.

## Current status

Backstage currently supports Components and APIs.

## Links

- [Original RFC](https://github.com/spotify/backstage/issues/390)
- [YAML file format](../../architecture-decisions/adr002-default-catalog-file-format.md)
