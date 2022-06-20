---
id: well-known-annotations
title: Well-known Annotations on Catalog Entities
sidebar_label: Well-known Annotations
# prettier-ignore
description: Documentation that lists a number of well known Annotations, that have defined semantics. They can be attached to catalog entities and consumed by plugins as needed.
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
    backstage.io/managed-by-location: url:http://github.com/backstage/backstage/blob/master/catalog-info.yaml
```

The value of this annotation is a so called location reference string, that
points to the source from which the entity was originally fetched. This
annotation is added automatically by the catalog as it fetches the data from a
registered location, and is not meant to normally be written by humans. The
annotation may point to any type of generic location that the catalog supports,
so it cannot be relied on to always be specifically of type `url`, nor that it
even represents a single file. Note also that a single location can be the
source of many entities, so it represents a many-to-one relationship.

The format of the value is `<type>:<target>`. Note that the target may also
contain colons, so it is not advisable to naively split the value on `:` and
expecting a two-item array out of it. The format of the target part is
type-dependent and could conceivably even be an empty string, but the separator
colon is always present.

### backstage.io/managed-by-origin-location

```yaml
# Example:
metadata:
  annotations:
    backstage.io/managed-by-origin-location: url:http://github.com/backstage/backstage/blob/master/catalog-info.yaml
```

The value of this annotation is a location reference string (see above). It
points to the location, whose registration lead to the creation of the entity.
In most cases, the `backstage.io/managed-by-location` and
`backstage.io/managed-by-origin-location` will be equal. They will be different
if the original location delegates to another location. A common case is, that a
location is registered as `bootstrap:bootstrap` which means that it is part of
the `app-config.yaml` of a Backstage installation.

### backstage.io/orphan

This annotation is either absent, or present with the exact _string_ value
`"true"`. It should never be added manually. Instead, the catalog itself injects
the annotation as part of its processing loops, on entities that are found to
have no registered locations or config locations that keep them "active" /
"alive".

For example, suppose that the user first registers a location URL pointing to a
`Location` kind entity, which in turn refers to two `Component` kind entities in
two other files nearby. The end result is that the catalog contains those three
entities. Now suppose that the user edits the original `Location` entity to only
refer to the first of the `Component` kind entities. This will intentionally
_not_ lead to the other `Component` entity to be removed from the catalog (for
safety reasons). Instead, it gains this orphan marker annotation, to make it
clear that user action is required to completely remove it, if desired.

```yaml
# Example:
metadata:
  annotations:
    backstage.io/orphan: 'true'
```

### backstage.io/techdocs-ref

```yaml
# Example:
metadata:
  annotations:
    backstage.io/techdocs-ref: dir:.
```

The value of this annotation informs _where_ TechDocs source content is stored
so that it can be read and docs can be generated from it. Most commonly, it's
written as a path, relative to the location of the `catalog-info.yaml` itself,
where the associated `mkdocs.yml` file can be found.

In unusual situations where the documentation for a catalog entity does not live
alongside the entity's source code, the value of this annotation can point to an
absolute URL, matching the location reference string format outlined above, for
example: `url:https://github.com/backstage/backstage/tree/master`

### backstage.io/view-url, backstage.io/edit-url

```yaml
# Example:
metadata:
  annotations:
    backstage.io/view-url: https://some.website/catalog-info.yaml
    backstage.io/edit-url: https://github.com/my-org/catalog/edit/master/my-service.jsonnet
```

These annotations allow customising links from the catalog pages. The view URL
should point to the canonical metadata YAML that governs this entity. The edit
URL should point to the source file for the metadata. In the example above,
`my-org` generates its catalog data from Jsonnet files in a monorepo, so the
view and edit links need changing.

### backstage.io/source-location

```yaml
# Example:
metadata:
  annotations:
    backstage.io/source-location: url:https://github.com/my-org/my-service/
```

A `Location` reference that points to the source code of the entity (typically a
`Component`). Useful when catalog files do not get ingested from the source code
repository itself. If the URL points to a folder, it is important that it is
suffixed with a `'/'` in order for relative path resolution to work
consistently.

### jenkins.io/job-full-name

```yaml
# Example:
metadata:
  annotations:
    jenkins.io/job-full-name: folder-name/job-name
```

The value of this annotation is the path to a job on Jenkins, that builds this
entity.

The value can be the format of just `[folder-path]` or
`[instanceName]:[folder-path]`, if multiple instances are configured in
`app-config.yaml`

Specifying this annotation may enable Jenkins related features in Backstage for
that entity.

### github.com/project-slug

```yaml
# Example:
metadata:
  annotations:
    github.com/project-slug: backstage/backstage
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
    github.com/team-slug: backstage/maintainers
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

### gocd.org/pipelines

```yaml
# Example:
metadata:
  annotations:
    gocd.org/pipelines: backstage,backstage-pr,backstage-builder
```

The value of this annotation is a comma-separated list of the GoCD pipeline
names to fetch CI/CD information for.

The pipeline name is usually defined in the `gocd.yml` file for the pipeline
definition.

Specifying this annotation will enable GoCD related features in Backstage for
that entity.

### periskop.io/service-name

```yaml
# Example:
metadata:
  annotations:
    periskop.io/service-name: pump-station
```

The value of this annotation is the periskop project name for the given entity.

Specifying this annotation will enable [Periskop](https://periskop.io/) related features in Backstage for
that entity if the periskop plugin is installed.

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
    rollbar.com/project-slug: backstage/pump-station
```

The value of this annotation is the so-called slug (or alternatively, the ID) of
a [Rollbar](https://rollbar.com) project within your organization. The value can
be the format of `[organization]/[project-slug]` or just `[project-slug]`. When
the organization slug is omitted the `app-config.yaml` will be used as a
fallback (`rollbar.organization` followed by `organization.name`).

Specifying this annotation may enable Rollbar related features in Backstage for
that entity.

### circleci.com/project-slug

```yaml
# Example:
metadata:
  annotations:
    circleci.com/project-slug: github/spotify/pump-station
```

The value of this annotation is the so-called slug (or alternatively, the ID) of
a [CircleCI](https://circleci.com/) project within your organization. The value
can be the format of `[source-control-manager]/[organization]/[project-slug]` or
just `[organization]/[project-slug]`. When the `[source-control-manager]` slug
is omitted, `bitbucket` will be used as a fallback.

Specifying this annotation will cause the CI/CD features in Backstage to display
data from CircleCI for that entity.

Providing both the `github.com/project-slug` and `circleci.com/project-slug`
annotations can cause problems as both may be used for CI/CD features.

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
when ingesting the entity from LDAP. Not all of them may be present, depending
on what attributes that the server presented at ingestion time.

### graph.microsoft.com/tenant-id, graph.microsoft.com/group-id, graph.microsoft.com/user-id

```yaml
# Example:
metadata:
  annotations:
    graph.microsoft.com/tenant-id: 6902611b-ffc1-463f-8af3-4d5285dc057b
    graph.microsoft.com/group-id: c57e8ba2-6cc4-1039-9ebc-d5f241a7ca21
    graph.microsoft.com/user-id: 2de244b5-104b-4e8f-a3b8-dce3c31e54b6
```

The value of these annotations are the corresponding attributes that were found
when ingesting the entity from the Microsoft Graph API. Not all of them may be
present, depending on what attributes that the server presented at ingestion
time.

### sonarqube.org/project-key

```yaml
# Example:
metadata:
  annotations:
    sonarqube.org/project-key: pump-station
```

The value of this annotation is the project key of a
[SonarQube](https://sonarqube.org) or [SonarCloud](https://sonarcloud.io)
project within your organization.

Specifying this annotation may enable SonarQube related features in Backstage
for that entity.

### backstage.io/code-coverage

```yaml
# Example:
metadata:
  annotations:
    backstage.io/code-coverage: scm-only
```

The value of this annotation controls the code-coverage backstage plugin. If set
to `scm-only`, the plugin will only take into account files stored in source
control (e.g. ignoring generated code). If set to `enabled`, all files covered
by a coverage report will be taken into account.

### vault.io/secrets-path

```yaml
# Example:
metadata:
  annotations:
    vault.io/secrets-path: test/backstage
```

The value of this annotation contains the path to the secrets of the entity in
Vault. If not present when the Vault plugin is in use, a message will be shown
instead, letting the user know what is missing in the `catalog-info.yaml`.

## Deprecated Annotations

The following annotations are deprecated, and only listed here to aid in
migrating away from them.

### backstage.io/github-actions-id

This annotation was used for a while to enable the GitHub Actions feature. This
is now instead using the [github.com/project-slug](#github-com-project-slug)
annotation, with the same value format.

### backstage.io/definition-at-location

This annotation allowed to load the API definition from another location. Use
[substitution](./descriptor-format.md#substitutions-in-the-descriptor-format)
instead.

### jenkins.io/github-folder

Use the `jenkins.io/job-full-name` instead.

## Links

- [Descriptor Format: annotations](descriptor-format.md#annotations-optional)
