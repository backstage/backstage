---
id: discovery
title: Gerrit Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from Gerrit repositories
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./discovery--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Gerrit integration has a special entity provider for discovering catalog entities
from Gerrit repositories. The provider uses the "List Projects" API in Gerrit to get
a list of repositories and will automatically ingest all `catalog-info.yaml` files
stored in the root of the matching projects.

## Installation

As this provider is not one of the default providers, you will first need to install
the Gerrit provider plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gerrit
```

Then update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-gerrit/alpha'));
/* highlight-add-end */
```

## Configuration

To use the discovery processor, you'll need a Gerrit integration
[set up](locations.md). Then you can add any number of providers.

```yaml
# app-config.yaml
catalog:
  providers:
    gerrit:
      yourProviderId: # identifies your dataset / provider independent of config changes
        host: gerrit-your-company.com
        branch: master # Optional
        query: 'state=ACTIVE&prefix=webapps'
        schedule:
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
      backend:
        host: gerrit-your-company.com
        branch: master # Optional
        query: 'state=ACTIVE&prefix=backend'
```

The provider configuration is composed of three parts:

- **`host`**: the host of the Gerrit integration to use.
- **`branch`** _(optional)_: the branch where we will look for catalog entities (defaults to "master").
- **`query`**: this string is directly used as the argument to the "List Project" API.
  Typically, you will want to have some filter here to exclude projects that will
  never contain any catalog files.
