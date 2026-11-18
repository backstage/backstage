# @backstage/ai-node-tools

Tool permission composition for the Backstage managed AI service.

The managed AI service (`@backstage/ai-node`) mediates MCP tool calls as
guarded, journaled, permission-checked dispatches: each declared tool gets
its own permission, named `ai.tool.<server>.<tool>.use` following the model
permission encoding. Tool modules are registered with the service through
its factory options; this package carries the host-side composition —
registering those permissions with the Backstage permission registry.

## What this package carries

The guarded, journaled tool mediation runtime lives in `@backstage/ai-node`
and is consumed by its service factory. This package carries the part a
host composes itself: registering the tools' permissions with the Backstage
permission registry and mapping authorize requests back to tool identities.

## Usage

```ts
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { createToolPermissions } from '@backstage/ai-node-tools/alpha';

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'ai-tools',
  register(env) {
    env.registerInit({
      deps: {
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
      },
      async init({ permissions, permissionsRegistry }) {
        createToolPermissions({
          tools: [
            { serverId: 'example-tools', toolName: 'search' },
            { serverId: 'example-tools', toolName: 'fetch' },
          ],
          authorizer: permissions,
          registry: permissionsRegistry,
        });
      },
    });
  },
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
