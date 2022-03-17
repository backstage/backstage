# @backstage/plugin-catalog-backend-module-aws

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
