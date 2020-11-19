---
id: extending-the-model
title: Extending the model
description: Documentation on Extending the model
---

The Backstage catalog [entity data model](descriptor-format.md) is based on the
[Kubernetes objects format](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/),
and borrows a lot of its semantics as well. This page describes those semantics
at a higher level and how to extend them to fit your organization.

Backstage comes with a number of catalog concepts out of the box:

- There are a number of builtin versioned _kinds_, such as `Component`, `User`
  etc. These encapsulate the high level concept of an entity, and define the
  schema for its entity definition data.
- An entity has both a _metadata_ object and a _spec_ object at the root.
- Each kind may or may not have a _type_. For example, there are several well
  known types of component, such as `service` and `website`. These clarify the
  more detailed nature of the entity, and may affect what features are exposed
  in the interface.
- Entities may have a number of _[annotations](well-known-annotations.md)_ on
  them. These can be added either by humans into the descriptor files, or added
  by automated processes when the entity is ingested into the catalog.
- Entities may have a number of _labels_ on them.
- Entities may have a number of _relations_, expressing how they relate to each
  other in different ways.

We'll list different possibilities for extending this below.

## Adding a New Kind

> TODO: Fill in

## Adding a New Type of an Existing Kind

Backstage natively supports tracking of the following component
[`type`](descriptor-format.md)'s:

- Services
- Websites
- Libraries
- Documentation
- Other

![](../../assets/software-catalog/bsc-extend.png)

Since these types are likely not the only kind of software you will want to
track in Backstage, it is possible to add your own software types that fit your
organization's data model. Inside Spotify our model has grown significantly over
the years, and now includes ML models, Apps, data pipelines and many more.

It might be tempting to put software that doesn't fit into any of the existing
types into Other. There are a few reasons why we advise against this; firstly,
we have found that it is preferred to match the conceptual model that your
engineers have when describing your software. Secondly, Backstage helps your
engineers manage their software by integrating the infrastructure tooling
through plugins. Different plugins are used for managing different types of
components.

For example, the
[Lighthouse plugin](https://github.com/backstage/backstage/tree/master/plugins/lighthouse)
only makes sense for Websites. The more specific you can be in how you model
your software, the easier it is to provide plugins that are contextual.

> TODO: Fill in

## Changing the Validation Rules for Core Entity Fields

> TODO: Fill in

## Adding New Fields to the Metadata Object

> TODO: Fill in

## Adding New Fields to the Spec Object of an Existing Kind

> TODO: Fill in

## Adding a New Annotation

> TODO: Fill in

## Adding a New Label

> TODO: Fill in

## Adding a New Relation Type

> TODO: Fill in
