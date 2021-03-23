---
id: index
title: Integrations
sidebar_label: Overview
description: Documentation on Backstage Integrations
---

Integrations allow Backstage to read or publish data using external providers

- such as GitHub, GitLab, BitBucket, LDAP, or cloud providers.

## Configuration

Integration are configured at the root level of `app-config.yaml` since
integrations are used by many Backstage core features and other plugins.

Each key under `integrations` is a separate configuration for a single external
provider. Providers each have different configuration; here's an example of
configuration to use both GitHub and BitBucket:

```yaml
integrations:
  github:
    - host: github.com
      token:
        $env: GITHUB_TOKEN
  bitbucket:
    - host: bitbucket.org
      username:
        $env: BITBUCKET_USERNAME
      appPassword:
        $env: BITBUCKET_APP_PASSWORD
```

See documentation for each type of integration for full details on
configuration.
