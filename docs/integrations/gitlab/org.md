---
id: org
title: GitLab Organizational Data
sidebar_label: Org Data
description: Importing users and groups from GitLab into Backstage
---

The Backstage catalog can be set up to ingest organizational data -- users and
groups -- directly from GitLab. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group)
entities that mirrors your org setup.

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

This will query all users and groups from your GitLab instance. Depending on the
amount of data, this can take significant time and resources.

The token used must have the `read_api` scope, and the Users and Groups fetched
will be those visible to the account which provisioned the token.

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
        group: org/teams # Optional. Must not end with slash. Accepts only groups under the provided path (which will be stripped)
        groupPattern: '[\s\S]*' # Optional. Filters found groups based on provided pattern. Defaults to `[\s\S]*`, which means to not filter anything
```

When the `group` parameter is provided, the corresponding path prefix will be
stripped out from each matching group when computing the unique entity name.
e.g. If `group` is `org/teams`, the name for `org/teams/avengers/gotg` will be
`avengers-gotg`.
