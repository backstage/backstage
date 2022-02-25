---
id: discovery
title: Azure DevOps Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in an Azure DevOps organization
---

The Azure DevOps integration has a special discovery processor for discovering
catalog entities within an Azure DevOps. The processor will crawl the Azure
DevOps organization and register entities matching the configured path. This can
be useful as an alternative to static locations or manually adding things to the
catalog.

To use the discovery processor, you'll need a Azure integration
[set up](locations.md) with a `AZURE_TOKEN`. Then you can add a location target
to the catalog configuration:

```yaml
catalog:
  locations:
    # Scan all repositories for a catalog-info.yaml in the root of the default branch
    - type: azure-discovery
      target: https://dev.azure.com/myorg/myproject
    # Or use a custom pattern for a subset of all repositories with default repository
    - type: azure-discovery
      target: https://dev.azure.com/myorg/myproject/_git/service-*
    # Or use a custom file format and location
    - type: azure-discovery
      target: https://dev.azure.com/myorg/myproject/_git/*?path=/src/*/catalog-info.yaml
```

Note the `azure-discovery` type, as this is not a regular `url` processor.

When using a custom pattern, the target is composed of five parts:

- The base instance URL, `https://dev.azure.com` in this case
- The organization name which is required, `myorg` in this case
- The project name which is required, `myproject` in this case
- The repository blob to scan, which accepts \* wildcard tokens and must be
  added after `_git/`. This can simply be `*` to scan all repositories in the
  project.
- The path within each repository to find the catalog YAML file. This will
  usually be `/catalog-info.yaml`, `/src/*/catalog-info.yaml` or a similar
  variation for catalog files stored in the root directory of each repository.

_Note:_ the path parameter follows the same rules as the search on Azure DevOps
web interface. For more details visit the
[official search documentation](https://docs.microsoft.com/en-us/azure/devops/project/search/get-started-search?view=azure-devops)
