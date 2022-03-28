# cloud-carbon-footprint-backend

Welcome to the cloud-carbon-footprint-backend backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/cloud-carbon-footprint-backend](http://localhost:3000/cloud-carbon-footprint-backend).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.

## Configuration
CCF requires separate configuration for each cloud provider. It also requires specific permissions and billing exports to be configured.

The [CCF docs](https://www.cloudcarbonfootprint.org/docs/introduction) are the source of truth for CCF configuration. This readme aims to guide users how to inject relevant configuration into Backstage using its [static configuration mechanism](https://backstage.io/docs/conf/).

### GCP
Follow the first three steps given [here](https://www.cloudcarbonfootprint.org/docs/gcp).

Ensure the Compute Engine API and Cloud Resource API are enabled, and that google application default credentials are configured where the Backstage backend is running.

Then, put relevant values into the Backstage config (see the schema [here](./config.d.ts)). They will be injected into to CCF config. Example:
```yaml
# app-config.yaml
cloudCarbonFootprint:
  gcpBillingProjectId: my-project
  gcpBigQueryTable: billing_export_dataset.gcp_billing_export_v1_01B22A_05AA4C_87BDAC
```
