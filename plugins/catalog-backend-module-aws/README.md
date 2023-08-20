# Catalog Backend Module for AWS

This is an extension module to the plugin-catalog-backend plugin, providing an
`AwsOrganizationCloudAccountProcessor` that can be used to ingest cloud accounts
as `Resource` kind entities.

The plugin also supports discovering catalog entities located in an S3 Bucket. See the [Backstage documentation](https://backstage.io/docs/integrations/aws-s3/discovery) for more details.

## For Ingesting AWS accounts

1. Install this plugin:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-aws
```

2. Import the plugin to `catalog.ts` and add the `AwsOrganizationCloudAccountProcessor`

```TypeScript
// packages/backend/src/plugins/catalog.ts
+ import {AwsOrganizationCloudAccountProcessor} from '@backstage/plugin-catalog-backend-module-aws';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    const builder = await CatalogBuilder.create(env);

 +   builder.addProcessor(
 +       await AwsOrganizationCloudAccountProcessor.fromConfig( 
 +           env.config,
 +           {logger: env.logger}
 +      )
    );
...
}
```

3. In the `app-config.yaml` add the following:

```yaml
# app-config.yaml
catalog:
  processors:
    awsOrganization:
      provider:
        roleArn: '<role-arn>' # Should be a role that has a AWSOrganizationsReadOnlyAccess policy attached.
  ...  
  locations:
    - type: aws-cloud-accounts
      target: <The AWS Organization ID>

aws:
  accounts:
    - accountId: "some-account-id" # The account ID where AWS Organizations is set up.
      roleName: "role-name" # The name of the role used in the roleArn attribute previously.
```

4. After starting Backstage, the processor should start importing the AWS accounts to the Catalog (Kind: `Resource`, type: `aws-cloud-accounts`)
