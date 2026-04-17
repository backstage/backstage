---
id: mcp-actions
title: MCP Actions Backend
description: The MCP Actions Backend exposes actions registered with the Actions Registry as MCP tools.
---

The MCP Actions Backend exposes [Actions](../backend-system/core-services/actions.md) registered with the [Actions Registry](../backend-system/core-services/actions-registry.md) as MCP tools.

## Installation

This plugin is installed via the `@backstage/plugin-mcp-actions-backend` package. To add it to your backend package, run the following command:

```bash title="From your root directory"
yarn --cwd packages/backend add @backstage/plugin-mcp-actions-backend
```

Then, add the plugin to your backend:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-mcp-actions-backend'));
// ...
backend.start();
```

## Actions Configuration

Populate the `pluginSources` configuration with the list of plugins you want exposed as MCP tools like so:

```yaml
backend:
  actions:
    pluginSources:
      - 'catalog'
      - 'my-custom-plugin'
```

For details on filtering actions, see the [filtering actions documentation](../backend-system/core-services/actions.md#filtering-actions).

## Single MCP Server Name & Description

You can configure the name and description of your Backstage MCP server with the following config:

```yaml title="app-config.yaml"
mcpActions:
  name: 'My Company Backstage' # defaults to "backstage"
  description: 'Tools for managing your software catalog, creating new services from templates, and exploring your developer portal' # optional
```

:::tip
Keep the following in mind when picking the name and description. The description should answer "what can I do with these tools?" from the perspective of an AI agent deciding whether to use this server — not "what is this server?". That means describing Backstage capabilities (catalog, scaffolder, etc.), not the MCP protocol or server identity.
:::

## Namespaced Tool Names

By default, MCP tool names include the plugin ID prefix to avoid collisions across plugins. For example, an action registered as `greet-user` by `my-custom-plugin` is exposed as `my-custom-plugin.greet-user`.

You can disable this if you need the short names for backward compatibility:

```yaml title="app-config.yaml"
mcpActions:
  namespacedToolNames: false
```

## Multiple MCP Servers

By default, the plugin serves a single MCP server at `/api/mcp-actions/v1` that exposes all available actions. You can split actions into multiple focused servers by configuring `mcpActions.servers`, where each key becomes a separate MCP server endpoint.

```yaml title="app-config.yaml"
mcpActions:
  servers:
    catalog:
      name: 'Backstage Catalog'
      description: 'Tools for interacting with the software catalog'
      filter:
        include:
          - id: 'catalog:*'
    scaffolder:
      name: 'Backstage Scaffolder'
      description: 'Tools for creating new software from templates'
      filter:
        include:
          - id: 'scaffolder:*'
```

This creates two MCP server endpoints:

- `http://localhost:7007/api/mcp-actions/v1/catalog`
- `http://localhost:7007/api/mcp-actions/v1/scaffolder`

Each server uses include filter rules with glob patterns on action IDs to control which actions are exposed. For example, `id: 'catalog:*'` matches all actions registered by the catalog plugin.

When `mcpActions.servers` is not configured, the plugin behaves exactly as before with a single server at `/api/mcp-actions/v1`.

### Filter Rules

Include and exclude filter rules support glob patterns on action IDs and attribute matching. Exclude rules take precedence over include rules. When include rules are specified, actions must match at least one include rule to be exposed.

```yaml title="app-config.yaml"
mcpActions:
  servers:
    catalog:
      name: 'Backstage Catalog'
      filter:
        include:
          - id: 'catalog:*'
        exclude:
          - attributes:
              destructive: true
```

## Authentication Configuration

By default, the Backstage backend requires authentication for all requests.

### External Access with Static Tokens

:::warning
This is meant to be a temporary workaround until device authentication is completed.
:::

Configure external access with static tokens in your app configuration:

```yaml title="app-config.yaml"
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
[Service-to-Service Auth documentation](../auth/service-to-service-auth.md).

### Experimental Authentication methods

The MCP Actions Backend supports two experimental authentication methods based on the MCP specification:

- [Client ID Metadata Documents (CIMD)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents)
- [Dynamic Client Registration (DCR)](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#dynamic-client-registration)

They have the following requirements:

- You must be using the [New Frontend System](../frontend-system/architecture/00-index.md).
- The `@backstage/plugin-auth-backend` plugin must be configured.
- The new `@backstage/plugin-auth` frontend plugin must be configured.

Follow these steps to install and configure the new `@backstage/plugin-auth` frontend plugin:

1. Install the `@backstage/plugin-auth` frontend plugin:

   ```bash
   yarn --cwd packages/app add @backstage/plugin-auth
   ```

2. If you use [feature discovery](../frontend-system/architecture/10-app.md#feature-discovery) the plugin will be added automatically, if you prefer explicit registration, register the plugin as a feature like this:

   ```tsx title="packages/app/src/App.tsx"
   import authPlugin from '@backstage/plugin-auth';

   const app = createApp({
     features: [
       // ...other features
       authPlugin,
     ],
   });
   ```

#### Client ID Metadata Documents

:::warning
This feature is highly experimental; proceed with caution. Client support is also currently limited but quickly being implemented.
:::

The [November 2025 MCP specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) outlined a new authorization method to replace Dynamic Client Registration called [Client ID Metadata Documents (CIMD)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents).

Using Client ID Metadata Documents means you do not need to manually configure a token in your MCP client settings. Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the `auth` plugin).

This can be enabled in the `auth-backend` plugin by using the `auth.experimentalClientIdMetadataDocuments.enabled` flag in config:

```yaml title="app-config.yaml"
auth:
  experimentalClientIdMetadataDocuments:
    enabled: true
    # Optional: restrict which `client_id` URLs are allowed (defaults to ['*'])
    allowedClientIdPatterns:
      - 'https://example.com/*'
      - 'https://*.trusted-domain.com/*'
    # Optional: restrict which redirect URIs are allowed (defaults to ['*'])
    allowedRedirectUriPatterns:
      - 'http://localhost:*'
      - 'https://*.example.com/*'
```

#### Dynamic Client Registration

:::warning
This feature is highly experimental; proceed with caution. This method will likely be deprecated and replaced by [Client ID Metadata Documents](#client-id-metadata-documents) in the future. Only use in cases where clients do not yet support Client ID Metadata Documents.
:::

Using Dynamic Client Registration means you do not need to manually configure a token in your MCP client settings. Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the `auth` plugin).

This can be enabled in the `auth-backend` plugin by using the `auth.experimentalDynamicClientRegistration.enabled` flag in config:

```yaml title="app-config.yaml"
auth:
  experimentalDynamicClientRegistration:
    enabled: true

    # Optional: limit valid callback URLs for added security
    allowedRedirectUriPatterns:
      - cursor://*
```

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

The `${MCP_TOKEN}` environment variable would be an [external access static token](#external-access-with-static-tokens).

### Multiple Servers

When `mcpActions.servers` is configured, each server key becomes part of the URL. For example, with servers named `catalog` and `scaffolder`:

- `http://localhost:7007/api/mcp-actions/v1/catalog`
- `http://localhost:7007/api/mcp-actions/v1/scaffolder`

```json
{
  "mcpServers": {
    "backstage-catalog": {
      "url": "http://localhost:7007/api/mcp-actions/v1/catalog",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    },
    "backstage-scaffolder": {
      "url": "http://localhost:7007/api/mcp-actions/v1/scaffolder",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

## Metrics

The MCP Actions Backend emits metrics for the following operations:

- `mcp.server.operation.duration`: The duration taken to process an individual MCP operation
- `mcp.server.session.duration`: The duration of the MCP session from the perspective of the server

See the [OpenTelemetry tutorial](../tutorials/setup-opentelemetry.md) to learn how to make these metrics available.
