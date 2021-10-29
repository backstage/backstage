---
id: api-documentation
title: API Documentation
sidebar_label: API Documentation
# prettier-ignore
description: Steps needed to setup to display the API Documentation utilizing the out of the box Backstage plugin.
---

## Overview

The API Documentation is made available for API type entities and is displayed under the Defintion tab for each entity.  This allows for Open API documentation to be shown to users to provide the full definition of the available API.  

## Format

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `API`, respectively.

### `spec.type` [required]

The type of the API definition as a string, e.g. `openapi`. This field is
required.

The software catalog accepts any type value, but an organization should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, an OpenAPI type API may be displayed using an OpenAPI viewer tooling in
the Backstage interface.

The current set of well-known and common values for this field is:

- `openapi` - An API definition in YAML or JSON format based on the
  [OpenAPI](https://swagger.io/specification/) version 2 or version 3 spec.
- `asyncapi` - An API definition based on the
  [AsyncAPI](https://www.asyncapi.com/docs/specifications/latest/) spec.
- `graphql` - An API definition based on
  [GraphQL schemas](https://spec.graphql.org/) for consuming
  [GraphQL](https://graphql.org/) based APIs.
- `grpc` - An API definition based on
  [Protocol Buffers](https://developers.google.com/protocol-buffers) to use with
  [gRPC](https://grpc.io/).

### `spec.lifecycle` [required]

The lifecycle state of the API, e.g. `production`. This field is required.

The software catalog accepts any lifecycle value, but an organization should
take great care to establish a proper taxonomy for these.

The current set of well-known and common values for this field is:

- `experimental` - an experiment or early, non-production API, signaling that
  users may not prefer to consume it over other more established APIs, or that
  there are low or no reliability guarantees
- `production` - an established, owned, maintained API
- `deprecated` - an API that is at the end of its lifecycle, and may disappear
  at a later point in time

### `spec.owner` [required]

An [entity reference](references.md#string-references) to the owner of the
component, e.g. `artist-relations-team`. This field is required.

In Backstage, the owner of an API is the singular entity (commonly a team) that
bears ultimate responsibility for the API, and has the authority and capability
to develop and maintain it. They will be the point of contact if something goes
wrong, or if features are to be requested. The main purpose of this field is for
display purposes in Backstage, so that people looking at catalog items can get
an understanding of to whom this API belongs. It is not to be used by automated
processes to for example assign authorization in runtime systems. There may be
others that also develop or otherwise touch the API, but there will always be
one ultimate owner.

| [`kind`](#apiversion-and-kind-required)                | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                              |
| ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------- |
| [`Group`](#kind-group) (default), [`User`](#kind-user) | Same as this entity, typically `default`   | [`ownerOf`, and reverse `ownedBy`](well-known-relations.md#ownedby-and-ownerof) |

### `spec.system` [optional]

An [entity reference](references.md#string-references) to the system that the
API belongs to, e.g. `artist-engagement-portal`. This field is optional.

| [`kind`](#apiversion-and-kind-required) | Default [`namespace`](#namespace-optional) | Generated [relation](well-known-relations.md) type                            |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |
| [`System`](#kind-system) (default)      | Same as this entity, typically `default`   | [`partOf`, and reverse `hasPart`](well-known-relations.md#partof-and-haspart) |

### `spec.definition` [required]

The definition of the API, based on the format defined by `spec.type`. This
field is required.

## Definition
The descriptor format supports substitutions using `$text`, `$json`, and
`$yaml`.  These can be used for the definition segment to use the API definition file.

Placeholders like `$json: https://example.com/entity.json` are substituted by
the content of the referenced file. Files can be referenced from any configured
integration similar to locations by passing an absolute URL. It's also possible
to reference relative files like `./referenced.yaml` from the same location.
Relative references are handled relative to the folder of the
`catalog-info.yaml` that contains the placeholder. There are three different
types of placeholders:

- `$text`: Interprets the contents of the referenced file as plain text and
  embeds it as a string.
- `$json`: Interprets the contents of the referenced file as JSON and embeds the
  parsed structure.
- `$yaml`: Interprets the contents of the referenced file as YAML and embeds the
  parsed structure.

For example, this can be used to load the definition of an API entity from a web
server and embed it as a string in the field `spec.definition`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: petstore
  description: The Petstore API
spec:
  type: openapi
  lifecycle: production
  owner: petstore@example.com
  definition:
    $text: https://petstore.swagger.io/v2/swagger.json
```