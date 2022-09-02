---
'@backstage/plugin-todo-backend': patch
---

The todo plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit `packages/backend/src/plugins/todo.ts` and add the identity option.

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  ...
  return await createRouter({
    todoService,
    identity: env.identity,
  });
```
