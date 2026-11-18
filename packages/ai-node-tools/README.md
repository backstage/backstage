# @backstage/ai-node-tools

Tool permission composition for the Backstage managed AI service.

The managed AI service (`@backstage/ai-node`) mediates MCP tool calls as
guarded, journaled, permission-checked dispatches: each declared tool gets
its own permission, named `ai.tool.<server>.<tool>.use` following the model
permission encoding. Tool modules are registered with the service through
its factory options; this package carries the host-side composition —
registering those permissions with the Backstage permission registry.

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
