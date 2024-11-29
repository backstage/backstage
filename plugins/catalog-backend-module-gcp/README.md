# Catalog Backend Module for GCP

This is an extension module to the plugin-catalog-backend plugin, containing catalog processors and providers to ingest GCP resources as `Resource` kind entities.

## installation

Register the plugin in `catalog.ts``

```typescript
import { GkeEntityProvider } from '@backstage/plugin-catalog-backend-module-gcp';

...

builder.addEntityProvider(
  GkeEntityProvider.fromConfig({
    logger: env.logger,
    scheduler: env.scheduler,
    config: env.config
  })
);
```

Update `app-config.yaml` as follows:

```yaml
catalog:
  providers:
    gcp:
      gke:
        parents:
          # consult https://cloud.google.com/kubernetes-engine/docs/ for valid values
          # list all clusters in the project
          - 'projects/some-project/locations/-'
          # list all clusters in the region, in the project
          - 'projects/some-other-project/locations/some-region'
        # optional; authentication provider to be used, default 'google'
        authProvider: 'googleServiceAccount'
        # optional, owner of the resource, default 'unknown'
        owner: 'SRE'
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```
