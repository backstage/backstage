---
id: well-known-annotations
title: Well-known Annotations on Catalog Entities
sidebar_label: Well-known Annotations
description: Documentation on lists a number of well known Annotations, that
have defined semantics. They can be attached to catalog entities and consumed
by plugins as needed
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

### backstage.io/definition-at-location

```yaml
# Example
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: petstore
  annotations:
    backstage.io/definition-at-location: 'url:https://petstore.swagger.io/v2/swagger.json'
spec:
  type: openapi
```

This annotation allows to fetch an API definition from another location, instead
of wrapping the API definition inside the definition field. This allows to
easily consume existing API definition. The definition is fetched during
ingestion by a processor and included in the entity. It is updated on every
refresh. The annotation contains a location reference string that contains the
location processor type and the target.

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

### jenkins.io/github-folder

```yaml
# Example:
metadata:
  annotations:
    jenkins.io/github-folder: folder-name/job-name
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
[GitHub](https://github.com) (either the public one, or a private GitHub
Enterprise installation) that is related to this entity. It is on the format
`<organization>/<project>`, and is the same as can be seen in the URL location
bar of the browser when viewing that project.

Specifying this annotation will enable GitHub related features in Backstage for
that entity.

### github.com/team-slug

```yaml
# Example:
metadata:
  annotations:
    github.com/team-slug: spotify/backstage-core
```

The value of this annotation is the so-called slug that identifies a team on
[GitHub](https://github.com) (either the public one, or a private GitHub
Enterprise installation) that is related to this entity. It is on the format
`<organization>/<team>`, and is the same as can be seen in the URL location bar
of the browser when viewing that team.

This annotation can be used on a [Group entity](descriptor-format.md#kind-group)
to note that it originated from that team on GitHub.

### github.com/user-login

```yaml
# Example:
metadata:
  annotations:
    github.com/user-login: freben
```

The value of this annotation is the so-called login that identifies a user on
[GitHub](https://github.com) (either the public one, or a private GitHub
Enterprise installation) that is related to this entity. It is on the format
`<username>`, and is the same as can be seen in the URL location bar of the
browser when viewing that user.

This annotation can be used on a [User entity](descriptor-format.md#kind-user)
to note that it originated from that user on GitHub.

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

### rollbar.com/project-slug

```yaml
# Example:
metadata:
  annotations:
    rollbar.com/project-slug: spotify/pump-station
```

The value of this annotation is the so-called slug (or alternatively, the ID) of
a [Rollbar](https://rollbar.com) project within your organization. The value can
be the format of `[organization]/[project-slug]` or just `[project-slug]`. When
the organization slug is omitted the `app-config.yaml` will be used as a
fallback (`rollbar.organization` followed by `organization.name`).

Specifying this annotation may enable Rollbar related features in Backstage for
that entity.

### backstage.io/ldap-rdn, backstage.io/ldap-uuid, backstage.io/ldap-dn

```yaml
# Example:
metadata:
  annotations:
    backstage.io/ldap-rdn: my-team
    backstage.io/ldap-uuid: c57e8ba2-6cc4-1039-9ebc-d5f241a7ca21
    backstage.io/ldap-dn: cn=my-team,ou=access,ou=groups,ou=spotify,dc=spotify,dc=net
```

The value of these annotations are the corresponding attributes that were found
when ingestion the entity from LDAP. Not all of them may be present, depending
on what attributes that the server presented at ingestion time.

## Deprecated Annotations

The following annotations are deprecated, and only listed here to aid in
migrating away from them.

### backstage.io/github-actions-id

This annotation was used for a while to enable the GitHub Actions feature. This
is now instead using the [github.com/project-slug](#github-com-project-slug)
annotation, with the same value format.

## Links

- [Descriptor Format: annotations](descriptor-format.md#annotations-optional)
