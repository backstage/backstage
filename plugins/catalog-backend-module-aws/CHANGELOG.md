# @backstage/plugin-catalog-backend-module-aws

## 0.1.5-next.0

### Patch Changes

- bffec1c96a: Fix S3 object URL creation at AwsS3EntityProvider by

  - handle absence of region config,
  - handle regions with region-less URIs (us-east-1),
  - apply URI encoding,
  - and simplify the logic overall.

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0
  - @backstage/backend-tasks@0.3.1-next.0

## 0.1.4

### Patch Changes

- 5969c4b65c: Add a new provider `AwsS3EntityProvider` as replacement for `AwsS3DiscoveryProcessor`.

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

- 776a91ea3a: Corrected title and URL to setup documentation in README
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/backend-tasks@0.3.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2

## 0.1.4-next.2

### Patch Changes

- 5969c4b65c: Add a new provider `AwsS3EntityProvider` as replacement for `AwsS3DiscoveryProcessor`.

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

- 776a91ea3a: Corrected title and URL to setup documentation in README
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.3
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.1.2

### Patch Changes

- f115a7f8fd: Added `AwsS3DiscoveryProcessor`, which was moved here from `@backstage/plugin-catalog-backend` where it previously resided.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.1.2-next.0

### Patch Changes

- f115a7f8fd: Added `AwsS3DiscoveryProcessor`, which was moved here from `@backstage/plugin-catalog-backend` where it previously resided.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.1.1

### Patch Changes

- 83a83381b0: Use the new `processingResult` export from the catalog backend
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/plugin-catalog-backend@0.23.0

## 0.1.0

### Minor Changes

- 25e97e7242: Added this new catalog module, initially containing only the
  `AwsOrganizationCloudAccountProcessor`.

  Note that this was moved over from the catalog backend itself, and therefore is
  no longer part of its builtin set of processors. If you were using this
  processor, through making use of the location type `aws-cloud-accounts` and/or
  using the configuration key `catalog.processors.awsOrganization`, you will from
  now on have to add the processor manually to your catalog.

  First, add the `@backstage/plugin-catalog-backend-module-aws` dependency to your
  `packages/backend` package.

  Then, in `packages/backend/src/plugins/catalog.ts`:

  ```diff
  +import { AwsOrganizationCloudAccountProcessor } from '@backstage/plugin-catalog-backend-module-aws';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = await CatalogBuilder.create(env);
  +  builder.addProcessor(
  +    AwsOrganizationCloudAccountProcessor.fromConfig(
  +      env.config,
  +      { logger: env.logger }
  +    )
  +  );
     // ...
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/catalog-model@0.11.0
