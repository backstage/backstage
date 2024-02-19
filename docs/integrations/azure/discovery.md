---
id: discovery
title: Azure DevOps Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from repositories in an Azure DevOps organization
---

The Azure DevOps integration has a special entity provider for discovering
catalog entities within an Azure DevOps. The provider will crawl your Azure
DevOps organization and register entities matching the configured path. This can
be useful as an alternative to static locations or manually adding things to the
catalog.

This guide explains how to install and configure the Azure DevOps Entity Provider (recommended) or the Azure DevOps Processor.

## Dependencies

### Code Search Feature

Azure discovery is driven by the Code Search feature in Azure DevOps, this may not be enabled by default. For Azure
DevOps Services you can confirm this by looking at the installed extensions in your Organization Settings. For Azure
DevOps Server you'll find this information in your Collection Settings.

If the Code Search extension is not listed then you can install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms.vss-code-search&targetId=f9352dac-ba6e-434e-9241-a848a510ce3f&utm_source=vstsproduct&utm_medium=SearchExtStatus).

### Azure Integration

Setup [Azure integration](locations.md) with `host` and `token`. Host must be `dev.azure.com` for Cloud users, otherwise set this to your on-premise hostname.

## Installation

At your configuration, you add one or more provider configs:

```yaml title="app-config.yaml"
catalog:
  providers:
    azureDevOps:
      yourProviderId: # identifies your dataset / provider independent of config changes
        organization: myorg
        project: myproject
        repository: service-* # this will match all repos starting with service-*
        path: /catalog-info.yaml
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
      yourSecondProviderId: # identifies your dataset / provider independent of config changes
        organization: myorg
        project: '*' # this will match all projects
        repository: '*' # this will match all repos
        path: /catalog-info.yaml
      anotherProviderId: # another identifier
        organization: myorg
        project: myproject
        repository: '*' # this will match all repos
        path: /src/*/catalog-info.yaml # this will search for files deep inside the /src folder
      yetAnotherProviderId: # guess, what? Another one :)
        host: selfhostedazure.yourcompany.com
        organization: myorg
        project: myproject
        branch: development
```

The parameters available are:

- **`host:`** _(optional)_ Leave empty for Cloud hosted, otherwise set to your self-hosted instance host.
- **`organization:`** Your Organization slug (or Collection for on-premise users). Required.
- **`project:`** _(required)_ Your project slug. Wildcards are supported as shown on the examples above. Using '\*' will search all projects. For a project name containing spaces, use both single and double quotes as in `project: '"My Project Name"'`.
- **`repository:`** _(optional)_ The repository name. Wildcards are supported as show on the examples above. If not set, all repositories will be searched.
- **`path:`** _(optional)_ Where to find catalog-info.yaml files. Defaults to /catalog-info.yaml.
- **`branch:`** _(optional)_ The branch name to use.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.

_Note:_

- The path parameter follows the same rules as the search on Azure DevOps web interface. For more details visit the [official search documentation](https://docs.microsoft.com/en-us/azure/devops/project/search/get-started-search?view=azure-devops).
- To use branch parameters, it is necessary that the desired branch be added to the "Searchable branches" list within Azure DevOps Repositories. To do this, follow the instructions below:

1. Access your Azure DevOps and open the repository in which you want to add the branch.
2. Click on "Settings" in the lower-left corner of the screen.
3. Select the "Options" option in the left navigation bar.
4. In the "Searchable branches" section, click on the "Add" button to add a new branch.
5. In the window that appears, enter the name of the branch you want to add and click "Add".
6. The added branch will now appear in the "Searchable branches" list.

As this provider is not one of the default providers, you will first need to install
the Azure catalog plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-azure
```

Once you've done that, you'll also need to add the segment below to `packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { AzureDevOpsEntityProvider } from '@backstage/plugin-catalog-backend-module-azure';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
/* highlight-add-start */
builder.addEntityProvider(
  AzureDevOpsEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
    // optional: alternatively, use schedule
    scheduler: env.scheduler,
  }),
);
/* highlight-add-end */
```

## Alternative Processor

As an alternative to the entity provider `AzureDevOpsEntityProvider`, you can still use the `AzureDevopsDiscoveryProcessor`.

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-next-line */
  builder.addProcessor(
    AzureDevOpsDiscoveryProcessor.fromConfig(env.config, {
      logger: env.logger,
    }),
  );

  // ..
}
```

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
- The project name which is optional, `myproject` in this case. This defaults to \*, which scans all the projects where the token has access to.
- The repository blob to scan, which accepts \* wildcard tokens and must be
  added after `_git/`. This can simply be `*` to scan all repositories in the
  project.
- The path within each repository to find the catalog YAML file. This will
  usually be `/catalog-info.yaml`, `/src/*/catalog-info.yaml` or a similar
  variation for catalog files stored in the root directory of each repository.
