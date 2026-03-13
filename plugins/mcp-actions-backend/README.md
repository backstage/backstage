# MCP Actions Backend

This plugin exposes Backstage actions as MCP (Model Context Protocol) tools, allowing AI clients to discover and invoke registered actions in your Backstage backend.

## Installation

This plugin is installed via the `@backstage/plugin-mcp-actions-backend` package. To install it to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-mcp-actions-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-mcp-actions-backend'));
```

## Configuration

### Configuring Actions Registry

The MCP Actions Backend exposes actions that are registered with the Actions Registry. You can register actions from specific plugins by configuring the `pluginSources` in your app configuration:

```yaml
backend:
  actions:
    pluginSources:
      - 'catalog'
      - 'my-custom-plugin'
```

Actions from these plugins will be discovered and exposed as MCP tools. Each action must be registered using the Actions Registry Service in the respective plugin:

```ts
// In your plugin
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-custom-plugin',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
      },
      async init({ actionsRegistry }) {
        actionsRegistry.register({
          name: 'greet-user',
          title: 'Greet User',
          description: 'Generate a personalized greeting',
          schema: {
            input: z =>
              z.object({
                name: z.string().describe('The name of the person to greet'),
              }),
            output: z =>
              z.object({
                greeting: z.string().describe('The generated greeting'),
              }),
          },
          action: async ({ input }) => ({
            output: { greeting: `Hello ${input.name}!` },
          }),
        });
      },
    });
  },
});
```

### Namespaced Tool Names

By default, MCP tool names include the plugin ID prefix to avoid collisions across plugins. For example, an action registered as `greet-user` by `my-custom-plugin` is exposed as `my-custom-plugin.greet-user`.

You can disable this if you need the short names for backward compatibility:

```yaml
mcpActions:
  namespacedToolNames: false
```

### Multiple MCP Servers

By default, the plugin serves a single MCP server at `/api/mcp-actions/v1` that exposes all available actions. You can split actions into multiple focused servers by configuring `mcpActions.servers`, where each key becomes a separate MCP server endpoint.

```yaml
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

#### Filter Rules

Include and exclude filter rules support glob patterns on action IDs and attribute matching. Exclude rules take precedence over include rules. When include rules are specified, actions must match at least one include rule to be exposed.

```yaml
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

### Error Handling

When errors are thrown from MCP actions, the backend will handle and surface error message for any error from `@backstage/errors`. Unknown errors will be handled by `@modelcontextprotocol/sdk`'s default error handling, which may result in a generic `500 Server Error` being returned. As a result, we recommend using errors from `@backstage/errors` when applicable.

See [Backstage Errors](https://backstage.io/docs/reference/errors/) for a full list of supported errors.

When writing MCP tools, use the appropriate error from `@backstage/errors` when applicable:

```ts
action: async ({ input }) => {
  // ... get current user and some resource

  if (!resource) {
    throw new NotFoundError(`Resource ${input.id} not found`);
  }

  // Check if the user has permissions to access/use the resource
  if (!hasPermission(user, resource)) {
    throw new NotAllowedError(
      `user does not have sufficient permissions for ${resource}`,
    );
  }
};
```

### Authentication Configuration

By default, the Backstage backend requires authentication for all requests.

#### External Access with Static Tokens

> This is meant to be a temporary workaround until work on [device authentication](https://github.com/backstage/backstage/pull/27680) is completed.
> This will make authentication for MCP clients and CLI's in Backstage easier than having to configure static tokens.

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

Set the `MCP_TOKEN` environment variable with this token, and configure your MCP client to use it in the [Authorization header](#configuring-mcp-clients)

#### Experimental: Dynamic Client Registration

> [!CAUTION]
> This is highly experimental, proceed with caution.

You can configure the `auth-backend` and install the `auth` frontend plugin in order to enable [Dynamic Client Registration](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization#dynamic-client-registration) with MCP Clients.

This means that there is no token required in your MCP settings, and a token will be given to a client that requests a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup that requires your approval will be opened in your Backstage instance, which is powered by the `auth` plugin.

You will need to add the `@backstage/plugin-auth` package to your `app` `package.json`, and enable the following config in `app-config.yaml`:

```yaml
auth:
  experimentalDynamicClientRegistration:
    # enable the feature
    enabled: true

    # this is optional and will default to *, but you can limit the callback URLs which are valid for added security
    allowedRedirectUriPatterns:
      - cursor://*
```

> [!NOTE]
> The `@backstage/plugin-auth` package is currently only available in the new frontend system.

## Configuring MCP Clients

The MCP server supports both Server-Sent Events (SSE) and Streamable HTTP protocols.

The SSE protocol is deprecated, and should be avoided as it will be removed in a future release.

### Single Server (default)

- `Streamable HTTP`: `http://localhost:7007/api/mcp-actions/v1`
- `SSE`: `http://localhost:7007/api/mcp-actions/v1/sse`

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

## Development

This plugin backend can be started in a standalone mode from directly in this package with `yarn start`. It is a limited setup that is most convenient when developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
