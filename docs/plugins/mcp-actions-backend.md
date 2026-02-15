---
title: MCP Actions Backend
description: Expose Backstage actions as MCP (Model Context Protocol) tools for AI clients.
---

## Summary

The **MCP Actions Backend** plugin exposes Backstage actions as **MCP (Model Context Protocol) tools**,
allowing AI clients to discover and invoke registered actions in your Backstage backend.

This enables AI tooling (for example Cursor or Claude) to interact with Backstage actions in a structured and authenticated way.

---

## Installation

Install the plugin in your Backstage backend package:

```bash
# From your repository root
yarn --cwd packages/backend add @backstage/plugin-mcp-actions-backend
```

Then register the plugin in your backend entry file:

```ts
// packages/backend/src/index.ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-mcp-actions-backend'));
```

---

## Configuration

### Configuring the Actions Registry

The MCP Actions Backend exposes actions that are registered with the **Actions Registry**.

You can control which plugins can expose actions by configuring `pluginSources` in your app configuration:

```yaml
backend:
  actions:
    pluginSources:
      - catalog
      - my-custom-plugin
```

Actions from these plugins will be discovered and exposed as MCP tools.

### Registering an Action

Each action must be registered using the Actions Registry service in the respective plugin:

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

---

## Error Handling

When errors are thrown from MCP actions:

- Errors from `@backstage/errors` will be handled and surfaced with meaningful messages.
- Unknown errors will fall back to `@modelcontextprotocol/sdk` default error handling, which can result in a generic **500 Server Error**.

**Recommendation:** Use errors from `@backstage/errors` when applicable.

For the list of supported errors, see the Backstage errors API documentation.

Example:

```ts
import { NotFoundError, NotAllowedError } from '@backstage/errors';

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

---

## Authentication

By default, the Backstage backend requires authentication for all requests.

### External Access with Static Tokens

> ⚠️ This is meant to be a temporary workaround until device authentication is completed.

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

Set the `MCP_TOKEN` environment variable with this token, and configure your MCP client to use it in the `Authorization` header.

---

## Experimental: Dynamic Client Registration

> ⚠️ **Caution:** This is highly experimental. Proceed with caution.

You can configure the auth-backend and install the auth frontend plugin to enable **Dynamic Client Registration** with MCP clients.

This means you do not need to manually configure a token in your MCP client settings.
Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client
like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the auth plugin).

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

> ⚠️ The SSE protocol is deprecated and will be removed in a future release.

### Endpoints

- Streamable HTTP: `http://localhost:7007/api/mcp-actions/v1`
- SSE (deprecated): `http://localhost:7007/api/mcp-actions/v1/sse`

### Example MCP Client Configuration

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

---

## Development

This plugin backend can be started in standalone mode directly from the package:

```bash
yarn start
```

This is most convenient when developing the plugin backend itself.

If you want to run the entire Backstage project (including the frontend), run from the repository root:

```bash
yarn start
```
