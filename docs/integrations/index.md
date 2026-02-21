---
id: index
title: Integrations
sidebar_label: Overview
description: Configuring Backstage to read or publish data with external providers using integrations
---

Integrations allow Backstage to read or publish data using external providers
such as GitHub, GitLab, Bitbucket, LDAP, or cloud providers.

## Configuration

Integrations are configured at the root level of `app-config.yaml` since
integrations are used by many Backstage core features and other plugins.

Each key under `integrations` is a separate configuration for a single external
provider. Providers each have different configuration; here's an example of
configuration to use GitHub:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

See documentation for each type of integration for full details on
configuration.

## Backstage OpenAPI Module

If you want to integrate the OpenAPI specifications from your Backstage instance itself into the catalog, you can use the `catalog-backend-module-backstage-openapi`. This module helps discover and ingest OpenAPI definitions from Backstage plugins.

For more details, see the [module documentation](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-backstage-openapi).
