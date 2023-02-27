---
id: org
title: GitLab Organizational Data
sidebar_label: Org Data
description: Importing users and groups from a GitLab organization into Backstage
---

The Backstage catalog can be set up to ingest organizational data - users and
teams - directly from an organization in GitLab. The result
is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your org setup.

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

This will query all users and groups from your gitlab installation. Depending on the size
of the Gitlab Instance, this can take some time and resources.

The token that is used for the Organization Integration, has to be an Admin Personal Access Token (PAT).

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams # Optional. Must not end with slash. Accepts only groups under the provided path (which will be stripped)
        groupPattern: '[\s\S]*' # Optional. Filters found groups based on provided patter. Defaults to `[\s\S]*`, which means to not filter anything
```

When the `group` parameter is provided, the corresponding path prefix will be stripped out from each matching group
when computing the unique entity name. e.g. If `group` is `org/teams`, the name for `org/teams/avengers/gotg` will
be `avengers-gotg`.
