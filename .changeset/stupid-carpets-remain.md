---
'@backstage/plugin-catalog-backend-module-bitbucket-server': minor
---

Add new plugin catalog-backend-module-bitbucket-server which adds the `BitbucketServerEntityProvider`.

The entity provider is meant as a replacement for the `BitbucketDiscoveryProcessor` to be used with Bitbucket Server (Bitbucket Cloud already has a replacement).

**Before:**

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  BitbucketDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
);
```

```yaml
# app-config.yaml
catalog:
  locations:
    - type: bitbucket-discovery
      target: 'https://bitbucket.mycompany.com/projects/*/repos/*/catalog-info.yaml
```

**After:**

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  BitbucketServerEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

```yaml
# app-config.yaml
catalog:
  providers:
    bitbucketServer:
      yourProviderId: # identifies your ingested dataset
        catalogPath: /catalog-info.yaml # default value
        filters: # optional
          projectKey: '.*' # optional; RegExp
          repoSlug: '.*' # optional; RegExp
```
