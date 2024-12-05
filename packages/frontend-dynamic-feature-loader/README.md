# @backstage/frontend-dynamic-feature-loader

Backstage frontend feature loader to load new frontend system plugins exposed as module federation remotes.
The frontend feature loader provided in this package works hand-in-hand with the server of frontend plugin module federation remotes server which is part of backend dynamic feature service in package `@backstage/backend-dynamic-feature-service`.

**NOTE: The [new frontend system](https://backstage.io/docs/frontend-system/) that this package is relaying upon is in alpha, and we do not yet recommend using it for production deployments**

## Usage

- To enable this loader, you should:

  - Enable the backend dynamic features in your backend application, as explained in `packages/backend-dynamic-feature-service/README.md#how-it-works`
  - Add the frontend feature loader to the list of features when creating the frontend application:

    ```typescript
    const app = createApp({
      features: [...someOtherFeatures, dynamicFrontendFeaturesLoader()],
    });
    ```

## How to add a frontend plugin for dynamic loading

Adding a frontend plugin (with new frontend system support, possibly in alpha support), is straightforward and consists in:

- building the frontend plugin with the `frontend-dynamic-container` role, which enables the module federation support, and packages the plugin as a module remote
- copying the frontend package folder, with the `dist` folder generated during the build, to the dynamic plugins root folder of the Backstage installation (defined by the `dynamicPlugins.rootDirectory` configuration value, which is usually set as `dynamic-plugins-root`).

So from a frontend plugin package folder, you would use the following command:

```bash
yarn build --role frontend-dynamic-container && cp -R $(pwd) <target backstage>/dynamic-plugins-root/
```
