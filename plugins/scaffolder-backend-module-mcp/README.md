# Scaffolder Backend Module — MCP

A Backstage scaffolder backend module that lets templates call tools on
[Model Context Protocol](https://modelcontextprotocol.io/) servers.

It is the **inverse** of [`plugin-mcp-actions-backend`](../mcp-actions-backend/README.md),
which exposes Backstage's own actions to external MCP clients. This module makes
Backstage itself an MCP **client**, so any tool from any MCP server can be
invoked as a step in a scaffolder template.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-mcp
```

Register the module on the backend:

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-mcp'));
```

## Configuration

Declare one or more MCP servers under `scaffolder.mcpServers`. The first call
to a server lazily spawns its process; subsequent calls reuse the connection.
Only the **stdio** transport is supported today.

```yaml
scaffolder:
  mcpServers:
    fs:
      command: npx
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace']
    fetch:
      command: uvx
      args: ['mcp-server-fetch']
      timeoutMs: 30000
```

| Field       | Type                    | Default | Notes                                                                                                    |
| ----------- | ----------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `transport` | `'stdio'`               | `stdio` | Only `stdio` is implemented in this release.                                                             |
| `command`   | `string` (required)     | —       | Executable to spawn.                                                                                     |
| `args`      | `string[]`              | `[]`    | Arguments passed to the command.                                                                         |
| `env`       | `Record<string,string>` | `{}`    | Additional env vars; merged on top of the backend's `process.env`. Marked `secret` in the config schema. |
| `cwd`       | `string`                | —       | Working directory for the spawned process.                                                               |
| `timeoutMs` | `number`                | `60000` | Per-tool-call timeout in milliseconds.                                                                   |

## Usage in a template

```yaml
steps:
  - id: read-config
    name: Read repo config via MCP filesystem server
    action: mcp:call
    input:
      server: fs
      tool: read_file
      arguments:
        path: /workspace/template.yaml

  - id: fetch-spec
    name: Fetch OpenAPI spec via MCP fetch server
    action: mcp:call
    input:
      server: fetch
      tool: fetch
      arguments:
        url: https://example.com/openapi.yaml
```

The action returns the raw MCP tool response under `steps.<id>.output.result`,
typically an object of the shape `{ content: [{ type: 'text', text: '...' }] }`.

## Lifecycle

The module registers a shutdown hook via `coreServices.lifecycle` that closes
all open MCP client connections during graceful shutdown.

## Limitations

- **stdio only.** HTTP and SSE transports are not wired up yet.
- **Single generic action.** A future revision may dynamically register one
  scaffolder action per discovered MCP tool (e.g. `mcp.fs:read_file`), so
  templates can declare the tool name in the step `action:` field.
- **No per-call auth.** Credentials are baked into the server config; per-call
  pass-through (e.g. forwarding a user's token to an HTTP MCP server) will land
  with the HTTP transport.
