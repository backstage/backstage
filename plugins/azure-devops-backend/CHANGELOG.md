# @backstage/plugin-azure-devops-backend

## 0.5.2-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-catalog-node@1.6.2-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.21-next.0

## 0.5.2-next.1

### Patch Changes

- 25bda45: Fixed bug with `extractPartsFromAsset` that resulted in a leading `.` being removed from the path in an otherwise valid path (ex. `.assets/image.png`). The leading `.` will now only be moved for paths beginning with `./`.
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.21-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.1

## 0.5.2-next.0

### Patch Changes

- 353244d: Added a note about Service Principles
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-catalog-node@1.6.2-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.1

### Patch Changes

- d076ee4: Updated dependency `azure-devops-node-api` to `^12.0.0`.
- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-catalog-node@1.6.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.20

## 0.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-catalog-node@1.6.1-next.2

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.19
  - @backstage/plugin-catalog-node@1.6.1-next.1

## 0.5.1-next.0

### Patch Changes

- d076ee4: Updated dependency `azure-devops-node-api` to `^12.0.0`.
- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-catalog-node@1.6.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.0

### Minor Changes

- 844969c: **BREAKING** New `fromConfig` static method must be used now when creating an instance of the `AzureDevOpsApi`

  Added support for using the `AzureDevOpsCredentialsProvider`

### Patch Changes

- c70e4f5: Added multi-org support
- 646db72: Updated encoding of Org to use `encodeURIComponent` when building URL used to get credentials from credential provider
- 043b724: Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-catalog-node@1.6.0
  - @backstage/plugin-azure-devops-common@0.3.2
  - @backstage/integration@1.8.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.19

## 0.5.0-next.3

### Patch Changes

- c70e4f5: Added multi-org support
- 646db72: Updated encoding of Org to use `encodeURIComponent` when building URL used to get credentials from credential provider
- Updated dependencies
  - @backstage/plugin-azure-devops-common@0.3.2-next.1
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.6.0-next.3

## 0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.6.0-next.2
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-azure-devops-common@0.3.2-next.0
  - @backstage/plugin-catalog-common@1.0.18

## 0.5.0-next.1

### Minor Changes

- 844969cd97: **BREAKING** New `fromConfig` static method must be used now when creating an instance of the `AzureDevOpsApi`

  Added support for using the `AzureDevOpsCredentialsProvider`

### Patch Changes

- 043b724c56: Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily
- Updated dependencies
  - @backstage/plugin-azure-devops-common@0.3.2-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2

## 0.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/plugin-azure-devops-common@0.3.1

## 0.4.0

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/plugin-azure-devops-common@0.3.1
  - @backstage/backend-plugin-api@0.6.3

## 0.4.0-next.3

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/plugin-azure-devops-common@0.3.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.3.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.27

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.3.27-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.26

### Patch Changes

- ae261e79d256: Added alpha support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.26-next.1

### Patch Changes

- ae261e79d256: Added alpha support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/config@1.0.8

## 0.3.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/config@1.0.8
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## 0.3.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.22

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/config@1.0.7
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.3.22-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.21

### Patch Changes

- c51efce2a0: Update docs to always use `yarn add --cwd` for app & backend
- cc926a59bd: Fixed a bug where the azure devops host in URLs on the readme card was being URL encoded, breaking hosts with ports.
- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.21-next.1

### Patch Changes

- cc926a59bd: Fixed a bug where the azure devops host in URLs on the readme card was being URL encoded, breaking hosts with ports.
- 85b04f659a: Internal refactor to not use deprecated `substr`
- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.18

### Patch Changes

- eaccf6d628: Updated installation documentation
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.18-next.2

### Patch Changes

- eaccf6d628: Updated installation documentation
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.18-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.17

### Patch Changes

- 62f284e394: - Adjusted the asset parser to accept case sensitive
  - Fixed fetching data that was using the deprecated function
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/config@1.0.4
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.17-next.1

### Patch Changes

- 62f284e394: - Adjusted the asset parser to accept case sensitive
  - Fixed fetching data that was using the deprecated function

## 0.3.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/config@1.0.3
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## 0.3.15

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- cb1cfc018b: `createRouter` now requires an additional reader: `UrlReader` argument

  ```diff
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return createRouter({
      logger: env.logger,
      config: env.config,
  +   reader: env.reader,
    });
  }
  ```

  Remember to check if you have already provided these settings previously.

  #### [Azure DevOps]

  ```yaml
  # app-config.yaml
  azureDevOps:
    host: dev.azure.com
    token: my-token
    organization: my-company
  ```

  #### [Azure Integrations]

  ```yaml
  # app-config.yaml
  integrations:
    azure:
      - host: dev.azure.com
        token: ${AZURE_TOKEN}
  ```

- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-azure-devops-common@0.3.0
  - @backstage/config@1.0.2

## 0.3.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3

## 0.3.15-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2

## 0.3.15-next.0

### Patch Changes

- 3f739be9d9: Minor API signatures cleanup
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- cb1cfc018b: `createRouter` now requires an additional reader: `UrlReader` argument

  ```diff
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return createRouter({
      logger: env.logger,
      config: env.config,
  +   reader: env.reader,
    });
  }
  ```

  Remember to check if you have already provided these settings previously.

  #### [Azure DevOps]

  ```yaml
  # app-config.yaml
  azureDevOps:
    host: dev.azure.com
    token: my-token
    organization: my-company
  ```

  #### [Azure Integrations]

  ```yaml
  # app-config.yaml
  integrations:
    azure:
      - host: dev.azure.com
        token: ${AZURE_TOKEN}
  ```

- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-azure-devops-common@0.3.0-next.0

## 0.3.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0

## 0.3.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0

## 0.3.13

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 13a232ec22: Added comments to example to help avoid confusion as to where lines need to be added
- e67c4b7d5a: Adding getProjects endpoint to list out all projects associated with the Azure DevOps organization.

  It can be accessed by using this endpoint `{backendUrl}/api/azure-devops/projects`

- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-azure-devops-common@0.2.4

## 0.3.13-next.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- e67c4b7d5a: Adding getProjects endpoint to list out all projects associated with the Azure DevOps organization.

  It can be accessed by using this endpoint `{backendUrl}/api/azure-devops/projects`

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-azure-devops-common@0.2.4-next.0

## 0.3.13-next.0

### Patch Changes

- 13a232ec22: Added comments to example to help avoid confusion as to where lines need to be added
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.3.12

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.3.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.3.12-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1

## 0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.3.11

### Patch Changes

- ac14fcaf38: Added entity view for Azure Git Tags, based on existing Pull Requests view
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/plugin-azure-devops-common@0.2.3

## 0.3.11-next.1

### Patch Changes

- ac14fcaf38: Added entity view for Azure Git Tags, based on existing Pull Requests view
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-azure-devops-common@0.2.3-next.0

## 0.3.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.3.10

### Patch Changes

- 236245d9f8: Stop loading all teams when plugin is initialized
- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.3.10-next.1

### Patch Changes

- 236245d9f8: Stop loading all teams when plugin is initialized

## 0.3.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.3.9

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.3.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.3.5

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/plugin-azure-devops-common@0.2.2

## 0.3.4

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/config@0.1.14
  - @backstage/plugin-azure-devops-common@0.2.1

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.3.0

### Minor Changes

- a2ed2c2d69: - feat: Created PullRequestsDashboardProvider for resolving team and team member relations
  - feat: Created useUserTeamIds hook.
  - feat: Updated useFilterProcessor to provide teamIds for `AssignedToCurrentUsersTeams` and `CreatedByCurrentUsersTeams` filters.

### Patch Changes

- 9f9596f9ef: Only warn if teams fail to load at startup.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-azure-devops-common@0.2.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.2.5

### Patch Changes

- daf32e2c9b: Created some initial filters that can be used to create pull request columns:

  - All
  - AssignedToUser
  - AssignedToCurrentUser
  - AssignedToTeam
  - AssignedToTeams
  - AssignedToCurrentUsersTeams
  - CreatedByUser
  - CreatedByCurrentUser
  - CreatedByTeam
  - CreatedByTeams
  - CreatedByCurrentUsersTeams

  Example custom column creation:

  ```tsx
  const COLUMN_CONFIGS: PullRequestColumnConfig[] = [
    {
      title: 'Created by me',
      filters: [{ type: FilterType.CreatedByCurrentUser }],
    },
    {
      title: 'Created by Backstage Core',
      filters: [
        {
          type: FilterType.CreatedByTeam,
          teamName: 'Backstage Core',
        },
      ],
    },
    {
      title: 'Assigned to my teams',
      filters: [{ type: FilterType.AssignedToCurrentUsersTeams }],
    },
    {
      title: 'Other PRs',
      filters: [{ type: FilterType.All }],
      simplified: true,
    },
  ];

  <Route
    path="/azure-pull-requests"
    element={
      <AzurePullRequestsPage
        projectName="{PROJECT_NAME}"
        defaultColumnConfigs={COLUMN_CONFIGS}
      />
    }
  />;
  ```

- Updated dependencies
  - @backstage/backend-common@0.9.14
  - @backstage/plugin-azure-devops-common@0.1.3

## 0.2.4

### Patch Changes

- a77526afcd: Added getting builds by definition name
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-azure-devops-common@0.1.2

## 0.2.3

### Patch Changes

- 82cd709fdb: **Backend**

  - Created new `/dashboard-pull-requests/:projectName` endpoint
  - Created new `/all-teams` endpoint
  - Implemented pull request policy evaluation conversion

  **Frontend**

  - Refactored `PullRequestsPage` and added new properties for `projectName` and `pollingInterval`
  - Fixed spacing issue between repo link and creation date in `PullRequestCard`
  - Added missing condition to `PullRequestCardPolicy` for `RequiredReviewers`
  - Updated `useDashboardPullRequests` hook to implement long polling for pull requests

- Updated dependencies
  - @backstage/plugin-azure-devops-common@0.1.1
  - @backstage/backend-common@0.9.12

## 0.2.2

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.2.1

### Patch Changes

- 2b5ccd2964: Improved Date handling for the Azure DevOps set of plugins by using strings and letting the frontend handle the conversion to DateTime
- Updated dependencies
  - @backstage/backend-common@0.9.10
  - @backstage/plugin-azure-devops-common@0.1.0

## 0.2.0

### Minor Changes

- b85acc8c35: refactor(`@backstage/plugin-azure-devops`): Consume types from `@backstage/plugin-azure-devops-common`.
  Stop re-exporting types from `@backstage/plugin-azure-devops-backend`.
  Added new types to `@backstage/plugin-azure-devops-common`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/plugin-azure-devops-common@0.0.2

## 0.1.4

### Patch Changes

- 2eebc9bac3: Added duration (startTime and finishTime) and identity (uniqueName) to the RepoBuild results. Also did a bit of refactoring to help finish up the backend items in issue #7641
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/backend-common@0.9.8

## 0.1.3

### Patch Changes

- f67dff0d20: Re-exported types from azure-devops-node-api in @backstage/plugin-azure-devops-backend.
- Updated dependencies
  - @backstage/backend-common@0.9.7

## 0.1.2

### Patch Changes

- a23206049f: Updates function for mapping RepoBuilds to handle undefined properties
- b7c0585471: Expands the Azure DevOps backend plugin to provide pull request data to be used by the front end plugin

## 0.1.1

### Patch Changes

- 299b43f052: Marked all configuration values as required in the schema.
- Updated dependencies
  - @backstage/backend-common@0.9.5
