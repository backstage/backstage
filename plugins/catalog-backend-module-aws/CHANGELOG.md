# @backstage/plugin-catalog-backend-module-aws

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
