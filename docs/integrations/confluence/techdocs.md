---
id: techdocs
title: Tech Docs
sidebar_label: Tech Docs
# prettier-ignore
description:  Configuring Backstage tech docs to integrate and read docs from confluence.
---

Confluence integration allows loading documents and pages from Confluence and displaying them as tech docs in Backstage.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  confluence:
    - host: mycompany.atlassian.net
      apiToken: ${CONFLUENCE_API_TOKEN}
```

:warning: Token generated from atlassian cannot be used here directly. Please provide the encoded token here. [Refer](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/)
