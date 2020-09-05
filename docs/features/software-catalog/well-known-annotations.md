---
id: well-known-annotations
title: Well-known Annotations on Catalog Entities
sidebar_label: Well-known Annotations
---

This section lists a number of well known
[annotations](descriptor-format.md#annotations-optional), that have defined
semantics. They can be attached to catalog entities and consumed by plugins as
needed.

## Annotations

This is a (non-exhaustive) list of annotations that are known to be in active
use.

### backstage.io/managed-by-location

```yaml
# Example:
metadata:
  annotations:
    backstage.io/managed-by-location: github:http://github.com/spotify/backstage/catalog-info.yaml
```

The value of this annotation is a so called location reference string, that
points to the source from which the entity was originally fetched. This
annotation is added automatically by the catalog as it fetches the data from a
registered location, and is not meant to normally be written by humans. The
annotation may point to any type of generic location that the catalog supports,
so it cannot be relied on to always be specifically of type `github`, nor that
it even represents a single file. Note also that a single location can be the
source of many entities, so it represents a many-to-one relationship.

The format of the value is `<type>:<target>`. Note that the target may also
contain colons, so it is not advisable to naively split the value on `:` and
expecting a two-item array out of it. The format of the target part is
type-dependent and could conceivably even be an empty string, but the separator
colon is always present.

### backstage.io/techdocs-ref

```yaml
# Example:
metadata:
  annotations:
    backstage.io/techdocs-ref: github:https://github.com/spotify/backstage.git
```

The value of this annotation is a location reference string (see above). If this
annotation is specified, it is expected to point to a repository that the
TechDocs system can read and generate docs from.

### backstage.io/jenkins-github-folder

```yaml
# Example:
metadata:
  annotations:
    backstage.io/jenkins-github-folder: folder-name/job-name
```

The value of this annotation is the path to a job on Jenkins, that builds this
entity.

Specifying this annotation may enable Jenkins related features in Backstage for
that entity.

### github.com/project-slug

```yaml
# Example:
metadata:
  annotations:
    github.com/project-slug: spotify/backstage
```

The value of this annotation is the so-called slug that identifies a project on
[GitHub](https://github.com) that is related to this entity. It is on the format
`<organization>/<project>`, and is the same as can be seen in the URL location
bar of the browser when viewing that project.

Specifying this annotation will enable GitHub related features in Backstage for
that entity.

### sentry.io/project-slug

```yaml
# Example:
metadata:
  annotations:
    sentry.io/project-slug: pump-station
```

The value of this annotation is the so-called slug (or alternatively, the ID) of
a [Sentry](https://sentry.io) project within your organization. The organization
slug is currently not configurable on a per-entity basis, but is assumed to be
the same for all entities in the catalog.

Specifying this annotation may enable Sentry related features in Backstage for
that entity.

## Deprecated Annotations

The following annotations are deprecated, and only listed here to aid in
migrating away from them.

### backstage.io/github-actions-id

This annotation was used for a while to enable the GitHub Actions feature. This
is now instead using the [github.com/project-slug](#github-com-project-slug)
annotation, with the same value format.

## Links

- [Descriptor Format: annotations](descriptor-format.md#annotations-optional)
