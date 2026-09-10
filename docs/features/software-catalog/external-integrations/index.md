---
id: index
title: External integrations
description: How to integrate external systems with the Backstage Software Catalog
---

Backstage natively supports importing catalog data through
[entity descriptor YAML files](../descriptor-format.md). If your organization
already tracks software and ownership in another system, you can integrate
that system with the catalog rather than duplicating everything in YAML files.

## Background

The catalog backend continuously ingests data from configured sources and
stores it in its database. The frontend plugin communicates with the backend
through a service API, and the backend runs processing loops to keep
everything up to date. [The Life of an Entity](../life-of-an-entity.md) covers
this process in detail and is worth reading first.

There are three ways to bring external data into the catalog. Each is suited
to different situations.

## Entity providers

An _entity provider_ sits at the edge of the catalog as an original source of
entities. It gives you full control over when and how data is fetched, and can
perform detailed updates to its set of entities — replacing them all at once
or issuing targeted additions and removals.

Use an entity provider when you have a remote system that you want to sync
into the catalog on a schedule or in response to events like webhooks. This
is the most common integration pattern.

See [Custom entity providers](entity-providers.md) for a full walkthrough.

## Custom processors

A _processor_ runs inside the catalog's processing loop. It can enrich,
validate, or transform entities after they have been ingested, and can emit
child entities based on what it finds.

Use a processor when you want to read from a custom location type, annotate
entities as they pass through the catalog, or validate entities of a
particular kind.

See [Custom processors](processors.md) for a full walkthrough.

## Incremental entity providers

An _incremental entity provider_ is a specialized form of entity provider for
large data sources that support pagination but may not fit into memory. It
ingests data in pages across multiple "bursts", handling deletions and updates
without holding the full data set at once.

Use an incremental entity provider when the data source is too large for a
single fetch, or when you need fine-grained control over pagination and
back-off behavior.

See [Incremental entity providers](incremental-entity-providers.md) for a
full walkthrough.
