---
id: software-catalog-api
title: API
description: The Software Catalog API
---

The software catalog backend has a JSON based REST API, which can be leveraged
by external systems. This page describes its shape and features.

## Overview

The API surface consists of a few distinct groups of functionality. Each has a
dedicated section below.

> **Note:** This page only describes some of the most commonly used parts of the
> API, and is a work in progress.

All of the URL paths in this article are assumed to be on top of some base URL
pointing at your catalog installation. For example, if the path given in a
section below is `/entities`, and the catalog is located at
`http://localhost:7007/api/catalog` during local development, the full URL would
be `http://localhost:7007/api/catalog/entities`. The actual URL may vary from
one organization to the other, especially in production, but is commonly your
`backend.baseUrl` in your app config, plus `/api/catalog` at the end.

Some or all of the endpoints may accept or require an `Authorization` header
with a `Bearer` token, which should then be the Backstage token returned by the
[`identity API`](https://backstage.io/docs/reference/core-plugin-api.identityapiref).

## Entities

These are the endpoints that deal with reading of entities directly. What it
exposes are final entities - i.e. the output of all processing and the stitching
process, not the raw originally ingested entity data. See [The Life of an
Entity](life-of-an-entity.md) for more details about this process and
distinction.

### `GET /entities`

Lists entities. Supports the following query parameters, described in sections
below:

- [`filter`](#filtering), for selecting only a subset of all entities
- [`fields`](#field-selection), for selecting only parts of the full data
  structure of each entity
- [`offset`, `limit`, and `after`](#pagination) for pagination

The return type is JSON, as an array of [`Entity`](descriptor-format.md).

#### Filtering

You can pass in one or more filter sets that get matched against each entity.
Each filter set is a number of conditions that all have to match for the
condition to be true (conditions effectively have an AND between them). At least
one filter set has to be true for the entity to be part of the result set
(filter sets effectively have an OR between them).

Example:

```text
/entities?filter=kind=user,metadata.namespace=default&filter=kind=group,spec.type

  Return entities that match

    Filter set 1:
      Condition 1: kind = user
                   AND
      Condition 2: metadata.namespace = default

    OR

    Filter set 2:
      Condition 1: kind = group
                   AND
      Condition 2: spec.type exists
```

Each condition is either on the form `<key>`, or on the form `<key>=<value>`.
The first form asserts on the existence of a certain key (with any value), and
the second asserts that the key exists and has a certain value. All checks are
always case _insensitive_.

In all cases, the key is a simplified JSON path in a given piece of entity data.
Each part of the path is a key of an object, and the traversal also descends
through arrays. There are two special forms:

- Array items that are simple value types (such as strings) match on a key-value
  pair where the key is the item as a string, and the value is the string `true`
- Relations can be matched on a `relations.<type>=<targetRef>` form

Let's look at a simplified example to illustrate the concept:

```json
{
  "a": {
    "b": ["c", { "d": 1 }],
    "e": 7
  }
}
```

This would match any one of the following conditions:

- `a`
- `a.b`
- `a.b.c`
- `a.b.c=true`
- `a.b.d`
- `a.b.d=1`
- `a.e`
- `a.e=7`

Some more real world usable examples:

- Return all orphaned entities:

  `/entities?filter=metadata.annotations.backstage.io/orphan=true`

- Return all users and groups:

  `/entities?filter=kind=user&filter=kind=group`

- Return all service components:

  `/entities?filter=kind=component,spec.type=service`

- Return all entities with the `java` tag:

  `/entities?filter=metadata.tags.java`

- Return all users who are members of the `ops` group (note that the full
  [reference](references.md) of the group is used):

  `/entities?filter=kind=user,relations.memberof=group:default/ops`

#### Field selection

By default the full entities are returned, but you can pass in a `fields` query
parameter which selects what parts of the entity data to retain. This makes the
response smaller and faster to transfer, and may allow the catalog to perform
more efficient queries.

The query parameter value is a comma separated list of simplified JSON paths
like above. Each path corresponds to the key of either a value, or of a subtree
root that you want to keep in the output. The rest is pruned away. For example,
specifying `?fields=metadata.name,metadata.annotations,spec` retains only the
`name` and `annotations` fields of the `metadata` of each entity (it'll be an
object with at most two keys), keeps the entire `spec` unchanged, and cuts out
all other roots such as `relations`.

Some more real world usable examples:

- Return only enough data to form the full ref of each entity:

  `/entities?fields=kind,metadata.namespace,metadata.name`

#### Pagination

You may pass the `offset` and `limit` query parameters to do classical
pagination through the set of entities. There is also an `after` query parameter
to return the next page of results after the previous one when performing cursor
based pagination.

Each paginated response that has a next page of data, will have a `Link`,
`rel="next"` header pointing to the query path to the next page.

Example: Getting the first page:

```text
GET /entities?limit=2
HTTP/1.1 200 OK
link: </entities?limit=2&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D>; rel="next"

[{"metadata":{...
```

Getting the next page, since we detect the presence of the `Link` header:

```text
GET /entities?limit=2&after=eyJsaW1pdCI6Miwib2Zmc2V0IjoyfQ%3D%3D
HTTP/1.1 200 OK
link: </entities?limit=2&after=eyJsaW1pdCI6Miwib2Zmc2V0Ijo0fQ%3D%3D>; rel="next"

[{"metadata":{...
```

### `GET /entities/by-uid/<uid>`

Gets an entity by its `metadata.uid` field value.

The return type is JSON, as a single [`Entity`](descriptor-format.md), or a 404
error if there was no entity with that UID.

### `DELETE /entities/by-uid/<uid>`

Deletes an entity by its `metadata.uid` field value.

> **Note:** This method of deletion is appropriate for orphaned entities, but
> not for removal of "live" entities that are actively being updated by a
> location. Please read below.

The most common user flow is that you register a location (see below), and then
the catalog keeps itself up to date with that location and the subtree of things
that may spawn from it. This means that the catalog is a live-updating view of
an actual authoritative data source. If there's something keeping the entity
"alive" in the catalog, it will just reappear shortly after deletion with the
method described in this section. To properly remove entities, you typically
want to instead unregister the location that causes the entity to appear.

However if you have an orphaned entity, for example after removing the reference
to its file from a `Location` entity, or if a processor has stopped producing
your entity, then this deletion method is appropriate.

The return type is always an empty 204 response, whether an entity with this UID
existed or not.

### `GET /entities/by-name/<kind>/<namespace>/<name>`

Gets an entity by its `kind`, `metadata.namespace`, and `metadata.name` field
value. These are special in that they form the entity's unique
[reference](references.md) triplet.

The return type is JSON, as a single [`Entity`](descriptor-format.md), or a 404
error if there was no entity with that reference triplet.

## Locations

TODO

## Other

TODO
