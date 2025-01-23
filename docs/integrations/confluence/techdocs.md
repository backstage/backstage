---
id: techdocs
title: Tech Docs
sidebar_label: Tech Docs
# prettier-ignore
description:  Configuring Backstage tech docs to integrate and read docs from confluence.
---

Confluence integration allows importing of documents and pages into Backstage, linking them to components as technical documentation for easy access.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  confluence:
    - host: mycompany.atlassian.net
      email: username@mycompany.com
      apiToken: ${ATLASSIAN_API_TOKEN}
```
