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

## Installation

You will have to add the processors in the catalog initialization code of your
backend. They are not installed by default, therefore you have to add a
dependency to `@backstage/plugin-catalog-backend-module-azure` to your backend
package.

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-azure
```

And then add the processors to your catalog builder:

```diff
// In packages/backend/src/plugins/catalog.ts
+import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(AzureDevOpsDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }));
```

## Configuration

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
[official search documentation](https://docs.microsoft.com/en-us/azure/devops/project/search/get-started-search?view=azure-devops).

Azure discovery is driven by the Code Search feature in Azure DevOps, this may not be enabled by default. For Azure
DevOps Services you can confirm this by looking at the installed extensions in your Organization Settings. For Azure
DevOps Server you'll find this information in your Collection Settings.

If the Code Search extension is not listed then you can install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms.vss-code-search&targetId=f9352dac-ba6e-434e-9241-a848a510ce3f&utm_source=vstsproduct&utm_medium=SearchExtStatus).
