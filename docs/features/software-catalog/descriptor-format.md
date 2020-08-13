---
id: descriptor-format
title: Descriptor Format of Catalog Entities
sidebar_label: YAML File Format
---

This section describes the default data shape and semantics of catalog entities.

This both applies to objects given to and returned from the software catalog
API, as well as to the descriptor files that the software catalog can ingest
natively. In the API request/response cycle, a JSON representation is used,
while the descriptor files are on YAML format to be more easily maintainable by
humans. However, the structure and semantics is the same in both cases.

## Contents

- [Overall Shape Of An Entity](#overall-shape-of-an-entity)
- [Common to All Kinds: The Envelope](#common-to-all-kinds-the-envelope)
- [Common to All Kinds: The Metadata](#common-to-all-kinds-the-metadata)
- [Kind: Domain](#kind-domain)
- [Kind: System](#kind-system)
- [Kind: Component](#kind-component)
- [Kind: Template](#kind-template)
- [Kind: API](#kind-api)
- [Kind: APIImplementation](#kind-apiimplementation)
- [Kind: APIConsumption](#kind-apiconsumption)
- [Kind: APIExposition](#kind-apiexposition)

## Overall Shape Of An Entity

The following is an example of the shape of an entity as returned from the
software catalog API.

```js
{
  "apiVersion": "backstage.io/v1alpha1",
  "kind": "Component",
  "metadata": {
    "annotations": {
      "backstage.io/managed-by-location": "file:/tmp/component-info.yaml",
      "example.com/service-discovery": "artistweb",
      "circleci.com/project-slug": "gh/example-org/artist-website"
    },
    "description": "The place to be, for great artists",
    "etag": "ZjU2MWRkZWUtMmMxZS00YTZiLWFmMWMtOTE1NGNiZDdlYzNk",
    "generation": 1,
    "labels": {
      "system": "public-websites"
    },
    "name": "artist-web",
    "uid": "2152f463-549d-4d8d-a94d-ce2b7676c6e2"
  },
  "spec": {
    "lifecycle": "production",
    "owner": "artist-relations@example.com",
    "type": "website"
  }
}
```

The corresponding descriptor file that generated it may look as follows:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
  labels:
    system: public-websites
  annotations:
    example.com/service-discovery: artistweb
    circleci.com/project-slug: gh/example-org/artist-website
spec:
  type: website
  lifecycle: production
  owner: artist-relations@example.com
```

The root fields `apiVersion`, `kind`, `metadata`, and `spec` are part of the
_envelope_, defining the overall structure of all kinds of entity. Likewise,
some metadata fields like `name`, `labels`, and `annotations` are of special
significance and have reserved purposes and distinct shapes.

See below for details about these fields.

## Common to All Kinds: The Envelope

The root envelope object has the following structure.

### `apiVersion` and `kind` [required]

The `kind` is the high level entity type being described.
[ADR005](../../architecture-decisions/adr005-catalog-core-entities.md) describes
a number of core kinds that plugins can know of and understand, but an
organization using Backstage is free to also add entities of other kinds to the
catalog.

The perhaps most central kind of entity, that the catalog focuses on in the
initial phase, is `Component` ([see below](#kind-component)).

The `apiVersion` is the version of specification format for that particular
entity that the specification is made against. The version is used for being
able to evolve the format, and the tuple of `apiVersion` and `kind` should be
enough for a parser to know how to interpret the contents of the rest of the
data.

Backstage specific entities have an `apiVersion` that is prefixed with
`backstage.io/`, to distinguish them from other types of object that share the
same type of structure. This may be relevant when co-hosting these
specifications with e.g. kubernetes object manifests, or when an organization
adds their own specific kinds of entity to the catalog.

Early versions of the catalog will be using alpha/beta versions, e.g.
`backstage.io/v1alpha1`, to signal that the format may still change. After that,
we will be using `backstage.io/v1` and up.

### `metadata` [required]

A structure that contains metadata about the entity, i.e. things that aren't
directly part of the entity specification itself. See below for more details
about this structure.

### `spec` [varies]

The actual specification data that describes the entity.

The precise structure of the `spec` depends on the `apiVersion` and `kind`
combination, and some kinds may not even have a `spec` at all. See further down
in this document for the specification structure of specific kinds.

## Common to All Kinds: The Metadata

The `metadata` root field has a number of reserved fields with specific meaning,
described below.

In addition to these, you may add any number of other fields directly under
`metadata`, but be aware that general plugins and tools may not be able to
understand their semantics.

### `name` [required]

The name of the entity. This name is both meant for human eyes to recognize the
entity, and for machines and other components to reference the entity (e.g. in
URLs or from other entity specification files).

Names must be unique per kind, within a given namespace (if specified), at any
point in time. Names may be reused at a later time, after an entity is deleted
from the registry.

Names are required to follow a certain format. Entities that do not follow those
rules will not be accepted for registration in the catalog. The ruleset is
configurable to fit your organization's needs, but the default behavior is as
follows.

- Strings of length at least 1, and at most 63
- Must consist of sequences of `[a-z0-9A-Z]` possibly separated by one of
  `[-_.]`

Example: `visits-tracking-service`, `CircleciBuildsDump_avro_gcs`

In addition to this, names are passed through a normalization function and then
compared to the same normalized form of other entity names and made sure to not
collide. This rule of uniqueness exists to avoid situations where e.g. both
`my-component` and `MyComponent` are registered side by side, which leads to
confusion and risk. The normalization function is also configurable, but the
default behavior is as follows.

- Strip out all characters outside of the set `[a-zA-Z0-9]`
- Convert to lowercase

Example: `CircleciBuildsDs_avro_gcs` -> `circlecibuildsdsavrogcs`

### `namespace` [optional]

The ID of a namespace that the entity belongs to. This is a string that follows
the same format restrictions as `name` above.

This field is optional, and currently has no special semantics apart from
bounding the name uniqueness constraint if specified. It is reserved for future
use and may get broader semantic implication later. For now, it is recommended
to not specify a namespace unless you have specific need to do so.

Namespaces may also be part of the catalog, and are `v1` / `Namespace` entities,
i.e. not Backstage specific but the same as in Kubernetes.

### `description` [optional]

A human readable description of the entity, to be shown in Backstage. Should be
kept short and informative, suitable to give an overview of the entity's purpose
at a glance. More detailed explanations and documentation should be placed
elsewhere.

### `labels` [optional]

Labels are optional key/value pairs of that are attached to the entity, and
their use is identical to
[Kubernetes object labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).

Their main purpose is for references to other entities, and for information that
is in one way or another classifying for the current entity. They are often used
as values in queries or filters.

Both the key and the value are strings, subject to the following restrictions.

Keys have an optional prefix followed by a slash, and then the name part which
is required. The prefix, if present, must be a valid lowercase domain name, at
most 253 characters in total. The name part must be sequences of `[a-zA-Z0-9]`
separated by any of `[-_.]`, at most 63 characters in total.

The `backstage.io/` prefix is reserved for use by Backstage core components.
Some keys such as `system` also have predefined semantics.

Values are strings that follow the same restrictions as `name` above.

### `annotations` [optional]

An object with arbitrary non-identifying metadata attached to the entity,
identical in use to
[Kubernetes object annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/).

Their purpose is mainly, but not limited, to reference into external systems.
This could for example be a reference to the git ref the entity was ingested
from, to monitoring and logging systems, to pagerduty schedules, etc. Users may
add these to descriptor YAML files, but in addition to this automated systems
may also add annotations, either during ingestion into the catalog, or at a
later time.

Both the key and the value are strings, subject to the following restrictions.

Keys have an optional prefix followed by a slash, and then the name part which
is required. The prefix must be a valid lowercase domain name if specified, at
most 253 characters in total. The name part must be sequences of `[a-zA-Z0-9]`
separated by any of `[-_.]`, at most 63 characters in total.

The `backstage.io/` prefix is reserved for use by Backstage core components.

Values can be of any length, but are limited to being strings.

## Kind: Domain

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Domain`                |

A Domain groups a collection of systems that share terminology, domain models,
business purpose, or documentation, i.e. form a bounded context. 

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Domain
metadata:
  name: artists
  description: Everything about artists
spec:
  owner: artist-relations@example.com
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Domain`, respectively.

### `spec.owner` [required]

// TODO: decide whether a Domain requires an owner. We think that it is valuable to know who is the 
//       owner of a domain. This might be the expert with the domain knowledge that can assess
//       requirements or design solutions. From our understanding that might relate to a "tribe".

The owner of the domain, e.g. `artist-relations@example.com`. This field is
required.

In Backstage, the owner of a domain is the singular entity (commonly a team)
that bears ultimate responsibility for the domain, and has the authority and
capability to develop and maintain it. This will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this component belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also develop or otherwise touch the
component, but there will always be one ultimate owner.

Apart from being a string, the software catalog leaves the format of this field
open to implementers to choose. Most commonly, it is set to the ID or email of a
group of people in an organizational structure.

## Kind: System

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `System`                |

A system is a collection of resources and components that exposes one or several APIs.
It is viewed as abstraction level that provides potential consumers insights into exposed
features without needing a too detailed view into the details of all Components. This also
gives the owning team the possibility to decide about published artifacts and APIs.  

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: System
metadata:
  name: artist-engagement-portal
  description: Handy tools to keep artists in the loop
spec:
  owner: artist-relations@example.com
  domain: artists
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `System`, respectively.

### `spec.owner` [required]

The owner of the System, e.g. `artist-relations@example.com`. This field is
required.

In Backstage, the owner of a system is the singular entity (commonly a team)
that bears ultimate responsibility for the system, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. Components and
resources in a system are typically owned by the same team and are expected
to co-evolve. The main purpose of this field is for display purposes in
Backstage, so that people looking at catalog items can get an understanding
of to whom this system belongs. It is not to be used by automated processes
to for example assign authorization in runtime systems.

Apart from being a string, the software catalog leaves the format of this field
open to implementers to choose. Most commonly, it is set to the ID or email of a
group of people in an organizational structure.

### `spec.domain` [optional]

The link to the Domain that this System is part of, e.g. `artists`. This field
is optional and references another entity of `kind` `Domain`.

## Kind: Component

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Component`             |

A Component describes a software component. It is typically intimately linked to
the source code that constitutes the component, and should be what a developer
may regard a "unit of software", usually with a distinct deployable or linkable
artifact.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: The place to be, for great artists
spec:
  type: website
  lifecycle: production
  owner: artist-relations@example.com
  belongsToSystem: artists
  implementsApis:
    - artist-api
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Component`, respectively.

### `spec.type` [required]

The type of component as a string, e.g. `website`. This field is required.

The software catalog accepts any type value, but an organisation should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, a website type component may present tooling in the Backstage interface
that is specific to just websites.

The current set of well-known and common values for this field is:

- `service` - a backend service, typically exposing an API
- `website` - a website
- `library` - a software library, such as an NPM module or a Java library

### `spec.lifecycle` [required]

The lifecyle state of the component, e.g. `production`. This field is required.

The software catalog accepts any lifecycle value, but an organisation should
take great care to establish a proper taxonomy for these.

The current set of well-known and common values for this field is:

- `experimental` - an experiment or early, non-production component, signaling
  that users may not prefer to consume it over other more established
  components, or that there are low or no reliability guarantees
- `production` - an established, owned, maintained component
- `deprecated` - a component that is at the end of its lifecycle, and may
  disappear at a later point in time

### `spec.owner` [required]

The owner of the component, e.g. `artist-relations@example.com`. This field is
required.

In Backstage, the owner of a component is the singular entity (commonly a team)
that bears ultimate responsibility for the component, and has the authority and
capability to develop and maintain it. They will be the point of contact if
something goes wrong, or if features are to be requested. The main purpose of
this field is for display purposes in Backstage, so that people looking at
catalog items can get an understanding of to whom this component belongs. It is
not to be used by automated processes to for example assign authorization in
runtime systems. There may be others that also develop or otherwise touch the
component, but there will always be one ultimate owner.

Apart from being a string, the software catalog leaves the format of this field
open to implementers to choose. Most commonly, it is set to the ID or email of a
group of people in an organizational structure.

### `spec.belongsToSystem` [optional]

A link to the System entity that this component is part of.

// TODO: Remove this in favor of kind: APIImplementation 
### `spec.implementsApis` [optional]

Links APIs that are implemented by the component, e.g. `artist-api`. This field
is optional.

The software catalog expects a list of one or more strings that references the
names of other entities of the `kind` `API`.

## Kind: Template

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Template`              |

A Template describes a skeleton for use with the Scaffolder. It is used for
describing what templating library is supported, and also for documenting the
variables that the template requires using
[JSON Forms Schema](https://jsonforms.io/).

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: react-ssr-template
  title: React SSR Template
  description:
    Next.js application skeleton for creating isomorphic web applications.
  tags:
    - Recommended
    - React
spec:
  owner: web@example.com
  templater: cookiecutter
  type: website
  path: '.'
  schema:
    required:
      - component_id
      - description
    properties:
      component_id:
        title: Name
        type: string
        description: Unique name of the component
      description:
        title: Description
        type: string
        description: Description of the component
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Template`, respectively.

### `metadata.title` [required]

The nice display name for the template as a string, e.g. `React SSR Template`.
This field is required as is used to reference the template to the user instead
of the `metadata.name` field.

### `metadata.tags` [optional]

A list of strings that can be associated with the template, e.g.
`['Recommended', 'React']`.

This list will also be used in the frontend to display to the user so you can
potentially search and group templates by these tags.

### `spec.type` [optional]

The type of component as a string, e.g. `website`. This field is optional but
recommended.

The software catalog accepts any type value, but an organisation should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, a website type component may present tooling in the Backstage interface
that is specific to just websites.

The current set of well-known and common values for this field is:

- `service` - a backend service, typically exposing an API
- `website` - a website
- `library` - a software library, such as an NPM module or a Java library

### `spec.templater` [required]

The templating library that is supported by the template skeleton as a string,
e.g `cookiecutter`.

Different skeletons will use different templating syntax, so it's common that
the template will need to be run with a particular piece of software.

This key will be used to identify the correct templater which is registered into
the `TemplatersBuilder`.

The values which are available by default are:

- `cookiecutter` - [cookiecutter](https://github.com/cookiecutter/cookiecutter).

### `spec.path` [optional]

The string location where the templater should be run if it is not on the same
level as the `template.yaml` definition, e.g. `./cookiecutter/skeleton`.

This will set the `cwd` when running the templater to the folder path that you
specify relative to the `template.yaml` definition.

This is also particularly useful when you have multiple template definitions in
the same repository but only a single `template.yaml` registered in backstage.

## Kind: API

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `API`                   |

An API describes an interface that can be exposed by a component. The API can be
defined in different formats, like [OpenAPI](https://swagger.io/specification/),
[AsyncAPI](https://www.asyncapi.com/docs/specifications/latest/),
[gRPC](https://developers.google.com/protocol-buffers), or other formats.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: artist-api
  description: Retrieve artist details
spec:
  type: openapi
  definition: |
    openapi: "3.0.0"
    info:
      version: 1.0.0
      title: Artist API
      license:
        name: MIT
    servers:
      - url: http://artist.spotify.net/v1
    paths:
      /artists:
        get:
          summary: List all artists
    ...
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `API`, respectively.

### `spec.type` [required]

The type of the API definition as a string, e.g. `openapi`. This field is
required.

The software catalog accepts any type value, but an organisation should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, an OpenAPI type API may be displayed using an OpenAPI viewer tooling in
the Backstage interface.

The current set of well-known and common values for this field is:

- `openapi` - An API definition in YAML or JSON format based on the
  [OpenAPI](https://swagger.io/specification/) version 2 or version 3 spec.
- `asyncapi` - An API definition based on the
  [AsyncAPI](https://www.asyncapi.com/docs/specifications/latest/) spec.
- `grpc` - An API definition based on
  [Protocol Buffers](https://developers.google.com/protocol-buffers) to use with
  [gRPC](https://grpc.io/).

### `spec.definition` [required]

The definition of the API, based on the format defined by `spec.type`. This
field is required.

## Kind: APIImplementation

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `APIImplementation`     |

An `implements` relation between a Component and an API. It is used to tell
that a Component implements an API and provides it to others.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: APIImplementation
metadata:
  name: artist-web-api
spec:
  implementingComponent: artists-web
  implementedApi: artists-api
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `APIImplementation`, respectively.

### `spec.implementingComponent` [required]

Links a Component that is implementing the linked API, e.g. `artists-web`. This field
is required. The value references the name of another entity of `kind` `Component`.

### `spec.implementedApi` [required]

Links an API that is implemented by the linked Component, e.g. `artist-api`. This field
is required. The value references the name of another entity of `kind` `API`.

## Kind: APIConsumption

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `APIConsumption`        |

A `consumes` relation between a Component and an API. It is used to tell
that a Component consumes an API.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: APIConsumption
metadata:
  name: artist-ui-api
spec:
  consumingComponent: artists-ui
  consumingApi: artists-api
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `APIConsumption`, respectively.

### `spec.consumingComponent` [required]

Links a Component that is implementing the linked API, e.g. `artists-web`. This field
is required. The value references the name of another entity of `kind` `Component`.

### `spec.consumingApi` [required]

Links an API that is implemented by the linked Component, e.g. `artist-api`. This field
is required. The value references the name of another entity of `kind` `API`.

## Kind: APIExposition

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `APIExposition`         |

An `exposes` relation between a System and an API. It is used to tell that
a System exposes an API. This entity might also tell meta information about
the exposition. This might include url endpoints.

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: APIExposition
metadata:
  name: artist-ui-api
  labels:
    example.com/url: https://ui.example.com
    example.com/stage: production
    example.com/sla-class: high
spec:
  exposingSystem: artist-engagement-portal
  exposedApi: artists-api
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `APIExposition`, respectively.

### `spec.exposingSystem` [required]

Links a System that is exposes the linked API, e.g. `artist-engagement-portal`. This
field is required. The value references the name of another entity of `kind` `System`.

### `spec.exposedApi` [required]

Links an API that is exposed by the linked System, e.g. `artist-api`. This field
is required. The value references the name of another entity of `kind` `API`.
