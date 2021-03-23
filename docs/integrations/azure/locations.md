---
id: locations
title: Azure DevOps Locations
sidebar_label: Locations
description: Documentation on Azure DevOps location integration
---

The Azure integration supports loading catalog entities from Azure DevOps.
Components can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  azure:
    - host: dev.azure.com
      token:
        $env: AZURE_TOKEN
```

> Note: An Azure DevOps provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate).

The configuration is a structure with two elements:

- `host`: The DevOps host; only `dev.azure.com` is supported.
- `token` (optional): An personal access token as expected by Azure DevOps.
