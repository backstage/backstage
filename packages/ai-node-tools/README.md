# @backstage/ai-node-tools

Tool permission composition for the Backstage managed AI service.

The managed AI service (`@backstage/ai-node`) mediates MCP tool calls as
guarded, journaled, permission-checked dispatches: each declared tool gets
its own permission, named `ai.tool.<server>.<tool>.use` following the model
permission encoding. Tool modules are registered with the service through
its factory options; this package carries the host-side composition —
registering those permissions with the Backstage permission registry.

## Why this package is small

The split point follows dependency direction, the same principle that let
the provider modules move out of the core: the core never consumed the
providers, so they could become wiring-time inputs. The tools machinery —
the registry composition, the guarded-tool mediation facade, the envelope
validation, the MCP credential interpretation — is different: the default
service factory itself consumes it at runtime (module-registry validation,
the admission composition, the per-harness guarded tool operations), and it
sits on core-internal seams such as the provider registry and the shared
HTTP envelope validation. Moving it out would require either moving the
factory-consumed contract types with it or a cyclic core-to-package
dependency.

So the machinery stays in `@backstage/ai-node`, and this package carries
what hosts compose themselves: `createToolPermissions` registers the tools'
permissions with the Backstage permission registry and maps authorize
requests back to tool identities. If a future seam moves tool wiring out of
the core factory, the machinery would move with it; until then this package
is intentionally the host-facing slice.

## Usage

```ts
import { createToolPermissions } from '@backstage/ai-node-tools/alpha';

const tools = createToolPermissions({
  tools: registrations.flatMap(module =>
    module.tools.map(tool => ({
      serverId: module.id,
      toolName: tool.name,
    })),
  ),
  authorizer: permissions,
  registry: permissionsRegistry,
});
```

`createToolPermissions` registers one basic permission per tool (deduplicated
by name) and returns an `authorize(credentials, identities)` helper that maps
tool identities back to authorize requests under the caller's credentials.
The service-side enforcement — the guarded, journaled tool dispatch — lives
in `@backstage/ai-node`.

## Installation

```bash
yarn add @backstage/ai-node-tools
```
