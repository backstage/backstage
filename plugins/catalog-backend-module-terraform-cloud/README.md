# terraform-cloud-processor

Welcome to the terraform-cloud-processor backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

This plugin will query Terraform Cloud for any modules in the private registry, and add these (with versions surfaced as labels) to the software catalog. It will also add query the module for all terraform resources it uses, and each of these will be added as a Resource, with a dependency on the module.

You will need a [Terraform Cloud API token](https://www.terraform.io/cloud-docs/users-teams-organizations/api-tokens) for auth.


In `app-config.yaml` you will need to add the below key under `integrations`:

```yaml 
terraform:
    token: ${TF_TOKEN}
```

You will also need to add a location. This has the below format: 

```yaml
- type: tf-cloud
  target: 'YOUR TERRAFORM CLOUD ORG NAME'
  ```

  The target above will be used as the owner for all discovered components/resources.

  The processor also needs to be added to `packages/backend/src/plugins/catalog.ts`:

  ```javascript
import { TfCloudReaderProcessor } from '@backstage/plugin-catalog-backend-module-terraform-cloud'


const builder = await CatalogBuilder.create(env);
builder.addProcessor(new TfCloudReaderProcessor(env.config, env.logger));
```

