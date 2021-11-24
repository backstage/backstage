---
id: discovery
title: GitLab Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in GitLab
---

The GitLab integration has a special discovery processor for discovering catalog
entities from GitLab. The processor will crawl the GitLab instance and register
entities matching the configured path. This can be useful as an alternative to
static locations or manually adding things to the catalog.

To use the discovery processor, you'll need a GitLab integration
[set up](locations.md) with a `token`. Then you can add a location target to the
catalog configuration:

```yaml
catalog:
  locations:
    - type: gitlab-discovery
      target: https://gitlab.com/group/subgroup/blob/main/catalog-info.yaml
```

Note the `gitlab-discovery` type, as this is not a regular `url` processor.

The target is composed of three parts:

- The base URL, `https://gitlab.com` in this case
- The group path, `group/subgroup` in this case. This is optional: If you omit
  this path the processor will scan the entire GitLab instance instead.
- The path within each repository to find the catalog YAML file. This will
  usually be `/blob/main/catalog-info.yaml`, `/blob/master/catalog-info.yaml` or
  a similar variation for catalog files stored in the root directory of each
  repository. If you want to use the repository's default branch use the `*`
  wildcard, e.g.: `/blob/*/catalog-info.yaml`
