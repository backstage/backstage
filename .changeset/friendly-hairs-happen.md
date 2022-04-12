---
'@backstage/plugin-catalog-backend-module-aws': patch
---

Add a new provider `AwsS3EntityProvider` as replacement for `AwsS3DiscoveryProcessor`.

In order to migrate from the `AwsS3DiscoveryProcessor` you need to apply
the following changes:

**Before:**

```yaml
# app-config.yaml

catalog:
  locations:
    - type: s3-discovery
      target: https://sample-bucket.s3.us-east-2.amazonaws.com/prefix/
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { AwsS3DiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-aws';

const builder = await CatalogBuilder.create(env);
/** ... other processors ... */
builder.addProcessor(new AwsS3DiscoveryProcessor(env.reader));
```

**After:**

```yaml
# app-config.yaml

catalog:
  providers:
    awsS3:
      yourProviderId: # identifies your dataset / provider independent of config changes
        bucketName: sample-bucket
        prefix: prefix/ # optional
        region: us-east-2 # optional, uses the default region otherwise
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { AwsS3EntityProvider } from '@backstage/plugin-catalog-backend-module-aws';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
builder.addEntityProvider(
  ...AwsS3EntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: Duration.fromObject({ minutes: 30 }),
      timeout: Duration.fromObject({ minutes: 3 }),
    }),
  }),
);
```

For simple setups, you can omit the provider ID at the config
which has the same effect as using `default` for it.

```yaml
# app-config.yaml

catalog:
  providers:
    awsS3:
      # uses "default" as provider ID
      bucketName: sample-bucket
      prefix: prefix/ # optional
      region: us-east-2 # optional, uses the default region otherwise
```
