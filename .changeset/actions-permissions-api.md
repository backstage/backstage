---
'@backstage/backend-plugin-api': minor
---

Added optional `permission` field to `ActionsRegistryActionOptions`, allowing actions to declare a `BasicPermission` that controls visibility and access.

```typescript
import { createPermission } from '@backstage/plugin-permission-common';

const myPermission = createPermission({
  name: 'myPlugin.myAction.use',
  attributes: {},
});

actionsRegistry.register({
  name: 'my-action',
  title: 'My Action',
  description: 'An action that requires permission',
  permission: myPermission,
  schema: {
    input: z => z.object({ name: z.string() }),
    output: z => z.object({ ok: z.boolean() }),
  },
  action: async ({ input }) => {
    return { output: { ok: true } };
  },
});
```

Actions without a `permission` field continue to work as before.
