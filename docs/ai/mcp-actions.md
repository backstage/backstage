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

## Action Attributes

When registering an action, set the `attributes` field to describe the action's behavior. This allows clients to make informed decisions, for example: warning users before invoking a destructive action, or allowing a read-only action to run without confirmation.

The defaults are conservative. When unset, an action is assumed to be destructive, non-idempotent, and not read-only. **Always set these explicitly so clients can correctly represent the action's capabilities.**
See the [Action Attributes Reference](../backend-system/core-services/actions-registry.md#action-attributes-reference) for the full attribute definitions and defaults.

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

### OAuth authentication

The MCP Actions Backend supports [Client ID Metadata Documents (CIMD)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) based on the MCP specification.

CIMD has the following requirements:

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

The [November 2025 MCP specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) outlined a new authorization method to replace Dynamic Client Registration called [Client ID Metadata Documents (CIMD)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents).

Using Client ID Metadata Documents means you do not need to manually configure a token in your MCP client settings. Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the `auth` plugin).

This can be enabled in the `auth-backend` plugin by using the `auth.clientIdMetadataDocuments.enabled` flag in config:

```yaml title="app-config.yaml"
auth:
  clientIdMetadataDocuments:
    enabled: true
    # Optional: override which client_id URLs are allowed.
    # Defaults to Claude, VS Code, and the built-in Backstage CLI.
    # Note: setting this replaces the defaults entirely. The built-in
    # CLI pattern is derived from your auth backend's base URL and
    # must be re-added manually if you override this list.
    # allowedClientIdPatterns:
    #   - 'https://claude.ai/*'
    #   - 'https://vscode.dev/*'
    #   - 'https://my-custom-client.example.com/*'
    # Optional: override which redirect URIs are allowed.
    # Defaults to loopback addresses (localhost, 127.0.0.1, [::1]).
    # allowedRedirectUriPatterns:
    #   - 'http://localhost:*'
    #   - 'http://127.0.0.1:*'
    #   - 'http://[::1]:*'
```

#### Dynamic Client Registration

:::caution
Dynamic Client Registration is deprecated. Migrate to [Client ID Metadata Documents](#client-id-metadata-documents). Only use DCR for clients that do not yet support CIMD.
:::

Using Dynamic Client Registration means you do not need to manually configure a token in your MCP client settings. Instead, a client can request a token on your behalf. When adding the MCP server to an MCP client like Cursor or Claude, a popup requiring your approval will open in your Backstage instance (powered by the `auth` plugin).

This can be enabled in the `auth-backend` plugin by using the `auth.experimentalDynamicClientRegistration.enabled` flag in config:

```yaml title="app-config.yaml"
auth:
  experimentalDynamicClientRegistration:
    enabled: true
    # Optional: restrict which redirect URIs are allowed.
    # Defaults to Cursor and loopback addresses (localhost, 127.0.0.1, [::1]).
    # allowedRedirectUriPatterns:
    #   - 'cursor://*'
    #   - 'http://localhost:*'
    #   - 'http://127.0.0.1:*'
    #   - 'http://[::1]:*'
```

## Configuring MCP Clients

The MCP server uses the **Streamable HTTP** protocol.

### Endpoints

The default endpoint is `http://localhost:7007/api/mcp-actions/v1`.

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

## Tracing

The MCP Actions Backend emits a trace span for each `tools/call` invocation via the [Tracing Service](../backend-system/core-services/tracing.md), following the [OpenTelemetry server-side MCP semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/#server). Each span uses the name `tools/call <toolname>`, server kind, and includes the standard MCP attributes (`mcp.method.name`, `gen_ai.tool.name`, `gen_ai.operation.name`). Known Backstage errors (such as `InputError` or `NotFoundError`) are caught and returned as `isError: true` tool responses — the span is marked with `error.type=tool_error` in that case. Unhandled exceptions are recorded automatically by the Tracing Service and the span status is set to `ERROR`.

In addition to those attributes, the Tracing Service automatically attaches the authenticated principal's type as `backstage.principal.type` (one of `user`, `service`, or `none`). Each `tools/call` span is also attributed to the plugin that owns the invoked action via `backstage.plugin.id` (e.g. `catalog`, `scaffolder`) — overriding the default `mcp-actions` value so tracing backends can filter activity by the source plugin rather than by the MCP transport.

### Baggage propagation

The MCP Actions routers propagate OpenTelemetry context from the incoming HTTP request headers so that trace parent and baggage survive through the MCP transport layer. The following low-cardinality identifier entries from the OpenTelemetry [`gen_ai.*` attribute registry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/), when set by the MCP client in baggage, are automatically forwarded as attributes on the `tools/call` span:

- `gen_ai.agent.id`
- `gen_ai.agent.name`
- `gen_ai.conversation.id`
- `gen_ai.provider.name`
- `gen_ai.request.model`

This enables tracing backends to correlate MCP tool invocations back to the originating agent, conversation, or model without additional configuration. Other `gen_ai.*` baggage entries are intentionally not forwarded — baggage may be set by arbitrary upstream callers, and a broad prefix filter would let clients smuggle high-cardinality or payload-shaped keys (e.g. `gen_ai.tool.call.result`, `gen_ai.prompt`) onto the span and bypass the [tool payload capture flag](#capturing-tool-arguments-and-results).

### Capturing the authenticated end user

The Tracing Service can additionally include the authenticated principal's identity as `enduser.id` (the user entity ref for a user principal, the service subject for a service principal). This is gated behind a backend-wide configuration flag and is **disabled by default**:

```yaml title="app-config.yaml"
backend:
  tracing:
    capture:
      endUser: true # defaults to false
```

This flag is honored by every plugin that creates spans through the [Tracing Service](../backend-system/core-services/tracing.md), not just MCP Actions.

### Capturing tool arguments and results

When `mcpActions.tracing.capture.toolPayload` is enabled, the tool's input arguments and output result are recorded on the span as `gen_ai.tool.call.arguments` and `gen_ai.tool.call.result`.

```yaml title="app-config.yaml"
mcpActions:
  tracing:
    capture:
      toolPayload: true # defaults to false
```

:::warning
These attributes are marked Opt-In by the OpenTelemetry GenAI semantic conventions because they may contain sensitive information — entity payloads, scaffolder inputs, free-form text, and so on. Only enable this flag if your tracing backend's data handling is appropriate for the kinds of payloads your MCP tools accept and produce.
:::

See the [OpenTelemetry tutorial](../tutorials/setup-opentelemetry.md) to learn how to make these spans available.
