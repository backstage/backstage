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

## Documentation

For full documentation on configuring and using this plugin, see the [MCP Actions Backend](https://backstage.io/docs/ai/mcp-actions) page on `backstage.io`. This includes:

- Configuring which actions to expose
- Server name, description, and instructions
- Namespaced tool names
- Multiple MCP servers with filter rules
- Authentication (CIMD, static tokens)
- Configuring MCP clients
- Metrics and tracing
- Troubleshooting

## Development

This plugin backend can be started in a standalone mode from directly in this package with `yarn start`. It is a limited setup that is most convenient when developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
