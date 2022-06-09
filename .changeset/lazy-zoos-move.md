---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Add a new provider `GitlabDiscoveryEntityProvider` as replacement for `GitlabDiscoveryProcessor`

In order to migrate from the `GitlabDiscoveryProcessor` you need to apply
the following changes:

**Before:**

```yaml
# app-config.yaml

catalog:
  locations:
    - type: gitlab-discovery
      target: https://company.gitlab.com/prefix/*/catalog-info.yaml
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { GitlabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

const builder = await CatalogBuilder.create(env);
/** ... other processors ... */
builder.addProcessor(
  GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
);
```

**After:**

```yaml
# app-config.yaml

catalog:
  providers:
    gitlab:
      yourProviderId: # identifies your dataset / provider independent of config changes
        host: gitlab-host # Identifies one of the hosts set up in the integrations
        branch: main # Optional. Uses `master` as default
        group: example-group # Group and subgroup (if needed) to look for repositories
        entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
builder.addEntityProvider(
  ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```
