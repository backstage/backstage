---
id: discovery
title: Bitbucket Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in Bitbucket
---

The Bitbucket integration has a special discovery processor for discovering
catalog entities located in Bitbucket. The processor will crawl your Bitbucket
account and register entities matching the configured path. This can be useful
as an alternative to static locations or manually adding things to the catalog.

> Note: The Bitbucket Discovery Processor currently only supports a self-hosted
> Bitbucket Server, and not the hosted Bitbucket Cloud product.

To use the discovery processor, you'll need a Bitbucket integration
[set up](locations.md) with a `BITBUCKET_TOKEN` and a `BITBUCKET_API_BASE_URL`.
Then you can add a location target to the catalog configuration:

```yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: https://bitbucket.mycompany.com/projects/my-project/repos/service-*/catalog-info.yaml
```

Note the `bitbucket-discovery` type, as this is not a regular `url` processor.

The target is composed of four parts:

- The base instance URL, `https://bitbucket.mycompany.com` in this case
- The project key to scan, which accepts \* wildcard tokens. This can simply be
  `*` to scan repositories from all projects. This example only scans for
  repositories in the `my-project` project.
- The repository blob to scan, which accepts \* wildcard tokens. This can simply
  be `*` to scan all repositories in the project. This example only looks for
  repositories prefixed with `service-`.
- The path within each repository to find the catalog YAML file. This will
  usually be `/catalog-info.yaml` or a similar variation for catalog files
  stored in the root directory of each repository.
