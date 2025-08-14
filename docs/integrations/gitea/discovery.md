---
id: discovery
title: Gitea Discovery
sidebar_label: Discovery
description: Automatically discovering catalog entities from Gitea repositories
---

The Gitea integration has a special entity provider for discovering catalog entities
from Gitea repositories. The provider uses the "List Projects" API in Gitea to get
a list of repositories and will automatically ingest all `catalog-info.yaml` files
stored in the root of the matching projects.

## Installation

As this provider is not one of the default providers, you will first need to install
the Gitea provider plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gitea
```

Then update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gitea'));
/* highlight-add-end */
```

## Configuration

To use the discovery provider, you'll need a Gitea integration
[set up](locations.md). Then you can add any number of providers.

```yaml
# app-config.yaml
catalog:
  providers:
    gitea:
      yourProviderId: # identifies your dataset / provider independent of config changes
        organization: 'your-company' # string
        host: gitea-your-company.com
        branch: 'main' # Optional, defaults to 'main'
        catalogPath: 'catalog-info.yaml' # Optional, defaults to catalog-info.yaml
        schedule:
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

The provider configuration consists of the following parts:

- **`organization`**: Name of your organization account/workspace. If you want to add multiple organizations, you need to add one provider config each.
- **`host`**: the host of the Gitea integration to use.
- **`branch`** _(optional)_: the branch where we will look for catalog entities (defaults to 'main').
- **`catalogPath`**: path relative to the root of the repository where the Backstage manifests are stored.
