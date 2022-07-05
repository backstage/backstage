---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Align `msgraph` plugin's entity provider config with other providers. **Deprecated** entity processor as well as previous config.

You will see warning at the log output until you migrate to the new setup.
All deprecated parts will be removed eventually after giving some time to migrate.

Please find information on how to migrate your current setup to the new one below.

**Migration Guide:**

There were two different way on how to use the msgraph plugin: processor or provider.

Previous registration for the processor:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addProcessor(
  MicrosoftGraphOrgReaderProcessor.fromConfig(env.config, {
    logger: env.logger,
    // [...]
  }),
);
```

Previous registration when using the provider:

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
    id: 'https://graph.microsoft.com/v1.0',
    target: 'https://graph.microsoft.com/v1.0',
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
    // [...]
  }),
);
```

Previous configuration as used for both:

```yaml
# app-config.yaml
catalog:
  processors:
    microsoftGraphOrg:
      providers:
        - target: https://graph.microsoft.com/v1.0
          # [...]
```

**Replacement:**

Please check https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-msgraph/README.md for the complete documentation of all configuration options (config as well as registration of the provider).

```yaml
# app-config.yaml
catalog:
  providers:
    microsoftGraphOrg:
      # In case you used the deprecated configuration with the entity provider
      # using the value of `target` will keep the same location key for all
      providerId: # some stable ID which will be used as part of the location key for all ingested data
        target: https://graph.microsoft.com/v1.0
        # [...]
```

```typescript
// packages/backend/src/plugins/catalog.ts
builder.addEntityProvider(
  MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
    // [...]
  }),
);
```

In case you've used multiple entity providers before
**and** you had different transformers for each of them
you can provide these directly at the one `fromConfig` call
by passing a Record with the provider ID as key.
