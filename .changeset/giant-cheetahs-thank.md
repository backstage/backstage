---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Add annotation `microsoft.com/email` when using the `defaultUserTransformer`.

This will allow users of the Microsoft auth provider to utilize the predefined
SignIn resolver instead of maintaining their own.

```typescript
// backend/plugins/auth.ts

// [...]

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    // [...]
    providerFactories: {
      microsoft: providers.microsoft.create({
        signIn: {
          resolver:
            providers.microsoft.resolvers.emailMatchingUserEntityAnnotation(),
        },
      }),
    },
  });
}
```
