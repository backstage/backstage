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
      features: [...someOtherFeatures, dynamicFrontendFeaturesLoader],
    });
    ```
