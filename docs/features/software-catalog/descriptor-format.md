# Descriptor Format of Catalog Entities

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
- [Kind: Component](#kind-component)

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
[ADR005](/docs/architecture-decisions/adr005-catalog-core-entities.md) describes
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

##

Describes the following entity kind:

| Field                | Value                   |
| -------------------- | ----------------------- |
| `apiVersion`         | `backstage.io/v1alpha1` |
| `Kind: Templatekind` | `Template`              |

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
