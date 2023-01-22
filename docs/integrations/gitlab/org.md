---
id: org
title: GitLab Org
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

```yaml
catalog:
  providers:
    gitlab:
      yourProviderId:
        host: gitlab.com
        orgEnabled: true
```
