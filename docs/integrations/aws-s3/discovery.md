---
id: discovery
title: AWS S3 Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from an AWS S3 Bucket
---

The AWS S3 integration has a special entity provider for discovering catalog
entities located in an S3 Bucket. If you have a bucket that contains multiple
catalog files, and you want to automatically discover them, you can use this
provider. The provider will crawl your S3 bucket and register entities
matching the configured path. This can be useful as an alternative to static
locations or manually adding things to the catalog.

To use the entity provider, you'll need an AWS S3 integration
[set up](locations.md) with `accessKeyId` and `secretAccessKey`, and/or
a `roleArn` or none of these (e.g., profile- or instance-based credentials).

At production deployments, you likely manage these with the permissions attached
to your instance.

At your configuration, you add a provider config per bucket:

```yaml
# app-config.yaml

catalog:
  providers:
    awsS3:
      yourProviderId: # identifies your dataset / provider independent of config changes
        bucketName: sample-bucket
        prefix: prefix/ # optional
        region: us-east-2 # optional, uses the default region otherwise
        schedule: # same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
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
      schedule: # same options as in TaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { minutes: 30 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

As this provider is not one of the default providers, you will first need to install
the AWS catalog plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-aws
```

Once you've done that, you'll also need to add the segment below to `packages/backend/src/plugins/catalog.ts`:

```ts
/* packages/backend/src/plugins/catalog.ts */

import { AwsS3EntityProvider } from '@backstage/plugin-catalog-backend-module-aws';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
builder.addEntityProvider(
  AwsS3EntityProvider.fromConfig(env.config, {
    logger: env.logger,
    scheduler: env.scheduler,
  }),
);
```
