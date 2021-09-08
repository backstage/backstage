---
'@backstage/plugin-catalog-backend': patch
---

Use `ScmIntegrationRegistry#resolveUrl` in the placeholder processors instead of a custom implementation.

If you manually instantiate the `PlaceholderProcessor` (you most probably don't), add the new required constructor parameter:

```diff
+ import { ScmIntegrations } from '@backstage/integration';
  // ...
+ const integrations = ScmIntegrations.fromConfig(config);
  // ...
  new PlaceholderProcessor({
    resolvers: placeholderResolvers,
    reader,
+   integrations,
  });
```

All custom `PlaceholderResolver` can use the new `resolveUrl` parameter to resolve relative URLs.
