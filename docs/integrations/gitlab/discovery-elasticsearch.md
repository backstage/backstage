---
id: discovery-with-elasticsearch
title: GitLab Discovery with ElasticSearch integration
sidebar_label: Discovery
# prettier-ignore
description: Discovering catalog entities from the GitLab ElasticSearch Integration
---

The GitLab integration has another discovery processor for discovering catalog
entities from GitLab. The processor will use the ElasticSearch integration to
look for blobs (Git objects) matching a given filename and will then emit
adequate locations accordingly. This can be useful as an alternative for static
locations or manually adding things to the catalog. This works around API rate
limiting for GitLab.com-hosted organizations with Premium accounts (Bronze tier
upwards).

To use the discovery processor, you'll need a GitLab integration
[set up](locations.md) with a `token`. Then you can add a location target to the
catalog configuration:

```yaml
catalog:
  locations:
    - type: gitlab-es-discovery
      target: https://gitlab.com/group/subgroup/blob/*/senncloud.yaml
```

Note the `gitlab-es-discovery` type, as this is not a regular `url` processor.

The target is composed of four parts:

- The base URL, `https://gitlab.com` in this case
- The group path, `group/subgroup` in this case. This is optional: If you omit
  this path the processor will scan the entire GitLab instance instead.
- A branch name: this must always be `*` as ElasticSearch does not index
  non-default branches
- A path: filter query to lookup. Note that this supports the
  [ElasticSearch glob syntax for file paths](https://docs.gitlab.com/ee/user/search/advanced_search.html#syntax-search-filters).
