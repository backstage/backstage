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

## Configuring MCP Clients

The MCP server supports both Server-Sent Events (SSE) and Streamable HTTP protocols.

The SSE protocol is deprecated, and should be avoided as it will be removed in a future release.

- `Streamable HTTP`: `http://localhost:7007/api/mcp-actions/v1`
- `SSE`: `http://localhost:7007/api/mcp-actions/v1/sse`

There's a few different ways to configure MCP tools, but here's a snippet of the most common.

```json
{
  "mcpServers": {
    "backstage-actions": {
      // you can also replace this with the public / internal URL of the deployed backend.
      "url": "http://localhost:7007/api/mcp-actions/v1",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

## Development

This plugin backend can be started in a standalone mode from directly in this package with `yarn start`. It is a limited setup that is most convenient when developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
