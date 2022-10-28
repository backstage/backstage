---
'@backstage/plugin-jenkins-backend': patch
---

The jenkins plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit `packages/backend/src/plugins/jenkins.ts` and add the identity option.

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalog = new CatalogClient({ discoveryApi: env.discovery });
  return await createRouter({
    logger: env.logger,
    jenkinsInfoProvider: DefaultJenkinsInfoProvider.fromConfig({
      catalog,
      config: env.config,
    }),
    identity: env.identity,
  });
}
```
