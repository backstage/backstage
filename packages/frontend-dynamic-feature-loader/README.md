# @backstage/frontend-dynamic-feature-loader

Backstage frontend feature loader to load new frontend system plugins exposed as module federation remotes.
The frontend feature loader provided in this package works hand-in-hand with the server of frontend plugin module federation remotes server which is part of backend dynamic feature service in package `@backstage/backend-dynamic-feature-service`.

**NOTE: The [new frontend system](https://backstage.io/docs/frontend-system/) that this package is relaying upon is in alpha, and we do not yet recommend using it for production deployments**

## Usage

- To enable this loader, you should:

  - Enable the backend dynamic features in your backend application, as explained in the [`backend-dynamic-feature-service` README.md file](../backend-dynamic-feature-service/README.md#how-it-works)
  - Add the frontend feature loader to the list of features when creating the frontend application:

    ```typescript
    const app = createApp({
      features: [...someOtherFeatures, dynamicFrontendFeaturesLoader()],
    });
    ```

## How to add a frontend plugin for dynamic loading

Adding a frontend plugin (with new frontend system support, possibly in alpha support), is straightforward and consists in:

- bundling the frontend plugin with the [`backstage-cli package bundle`](../../docs/tooling/cli/03-commands.md#package-bundle) command, thus producing a self-contained bundle based on Module Federation.
- copying the bundle folder into the Backstage installation dynamic plugins root folder for dynamic loading.

So from a `my-backstage-plugin` frontend plugin package folder, you would use the following command:

```bash
yarn backstage-cli package bundle --output-destination /path/to/dynamic-plugins-root
# Creates a self-contained bundle in the /path/to/dynamic-plugins-root/my-backstage-plugin/ sub-folder
```
