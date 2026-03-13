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
  name: 'My MCP Server' # defaults to "backstage"
  description: 'Tools for interacting with My MCP Server' # optional
```

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

### Experimental: Dynamic Client Registration

:::warning
This feature is highly experimental and only works with the New Frontend System. Proceed with caution.
:::

You can configure the auth-backend and install the auth frontend plugin to enable **Dynamic Client Registration** with MCP clients. This means you do not need to manually configure a token in your MCP client settings. Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the auth plugin).

**Requirements:**

- The `@backstage/plugin-auth-backend` plugin must be configured.
- The new `@backstage/plugin-auth` frontend plugin must be configured.

**Installation:**

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

3. Enable the feature:

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
