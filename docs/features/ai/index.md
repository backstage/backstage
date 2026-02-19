---
id: mcp-actions-backend
title: MCP Actions Backend
description: Expose Backstage actions as MCP (Model Context Protocol) tools for AI clients.
---

## Overview

The MCP Actions Backend exposes actions registered with the **Actions Registry** as MCP tools.

## Configuration

### Configuring the Actions Registry

For details on registering actions, see the [Actions Registry documentation](../../backend-system/core-services/actions-registry).

## Authentication

By default, the Backstage backend requires authentication for all requests.

### External Access with Static Tokens

:::warning
This is meant to be a temporary workaround until device authentication is completed.
:::

Configure external access with static tokens in your app configuration:

```yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${MCP_TOKEN}
          subject: mcp-clients
        accessRestrictions:
          - plugin: mcp-actions
          - plugin: catalog
```

Generate a secure token:

```bash
node -p 'require("crypto").randomBytes(24).toString("base64")'
```

Set the `MCP_TOKEN` environment variable and configure your MCP client to send:

```http
Authorization: Bearer <token>
```

For more details about external access tokens and service-to-service authentication, see the
[Service-to-Service Auth documentation](../../auth/service-to-service-auth).

### Experimental: Dynamic Client Registration

:::warning
This feature is highly experimental. Proceed with caution.
:::

You can configure the auth-backend and install the auth frontend plugin to enable **Dynamic Client
Registration** with MCP clients.

This means you do not need to manually configure a token in your MCP client settings.

Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client
like Cursor or Claude, a popup requiring your approval will open in your Backstage instance
(powered by the auth plugin).

#### Requirements

- `auth-backend` must be configured.
- Add the `@backstage/plugin-auth` package to your app package.json.
- The New Frontend System must be used.

Install the auth frontend plugin:

```bash
yarn --cwd packages/app add @backstage/plugin-auth
```

Enable the feature in `app-config.yaml`:

```yaml
auth:
  experimentalDynamicClientRegistration:
    enabled: true

    # Optional: limit valid callback URLs for added security
    allowedRedirectUriPatterns:
      - cursor://*
```

> **Note:** `@backstage/plugin-auth` is currently only available in the new frontend system.

---

## Configuring MCP Clients

The MCP server supports both **Server-Sent Events (SSE)** and **Streamable HTTP** protocols.

:::warning
The SSE protocol is deprecated and will be removed in a future release.
:::

### Endpoints

- **Streamable HTTP:** `http://localhost:7007/api/mcp-actions/v1`
- **SSE (deprecated):** `http://localhost:7007/api/mcp-actions/v1/sse`
```json
{
  "mcpServers": {
    "backstage-actions": {
      "url": "http://localhost:7007/api/mcp-actions/v1",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```
