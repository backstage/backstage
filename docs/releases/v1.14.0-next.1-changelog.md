# Release v1.14.0-next.1

## @backstage/core-app-api@1.8.0-next.1

### Minor Changes

- c89437db899: The analytics' `navigate` event will now include the route parameters as attributes of the navigate event

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/repo-tools@0.3.0-next.0

### Minor Changes

- 27956d78671: Generated OpenAPI files now have a `.generated.ts` file name and a warning header at the top, to highlight that they should not be edited by hand.

## @backstage/plugin-kubernetes@0.9.0-next.1

### Minor Changes

- 280ec10c18e: Added Pod logs components for Kubernetes plugin

  **BREAKING**: `kubernetesProxyApi` for custom plugins built with components from the Kubernetes plugin apis, `kubernetesProxyApi` should be added to the plugin's API list.

      ...
      export const kubernetesPlugin = createPlugin({
        id: 'kubernetes',
        apis: [
      ...
          createApiFactory({
              api: kubernetesProxyApiRef,
              deps: {
              kubernetesApi: kubernetesApiRef,
              },
              factory: ({ kubernetesApi }) =>
              new KubernetesProxyClient({
                  kubernetesApi,
              }),
          }),

  **BREAKING**: `KubernetesDrawer` is now called `KubernetesStructuredMetadataTableDrawer` so that we can do more than just show `StructuredMetadataTable`

  `import { KubernetesDrawer } from "@backstage/plugin-kubernetes"`

  should now be:

  `import { KubernetesStructuredMetadataTableDrawer } from "@backstage/plugin-kubernetes"`

### Patch Changes

- a160e02c3d7: Omit managed fields in the Kubernetes resource YAML display.
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-kubernetes-backend@0.11.0-next.1

### Minor Changes

- f4114f02d49: Allow fetching pod metrics limited by a `labelSelector`.

  This is used by the Kubernetes tab on a components' page and leads to much smaller responses being received from Kubernetes, especially with larger Kubernetes clusters.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## @backstage/plugin-octopus-deploy@0.2.0-next.1

### Minor Changes

- 87211bc2873: Added support for Octopus Deploy spaces. The octopus.com/project-id annotation can now (optionally) be prefixed by a space identifier, for example. Spaces-1/Projects-102.
  Also note that some of this plugins exported API's have changed to accommodate this change, changing from separate arguments to a single object.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/app-defaults@1.3.1-next.1

### Patch Changes

- 575d9178eff: Added a System Icon for resource entities.
  This can be obtained using:

  ```ts
  useApp().getSystemIcon('kind:resource');
  ```

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## @backstage/backend-app-api@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/config@1.0.7

## @backstage/backend-common@0.18.5-next.1

### Patch Changes

- 0297f7a54af: Remove the direct dependency on deprecated "request" library
- Updated dependencies
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## @backstage/backend-defaults@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1

## @backstage/backend-openapi-utils@0.0.2-next.0

### Patch Changes

- 27956d78671: Adjusted README accordingly after the generated output now has a `.generated.ts` extension

## @backstage/backend-plugin-api@0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## @backstage/backend-tasks@0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/backend-test-utils@0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/core-components@0.13.1-next.0

### Patch Changes

- 26cff1a5dfb: Start capturing sidebar click events in analytics by default.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/create-app@0.5.1-next.1

### Patch Changes

- 4027aa9e753: Pin some octokit dependencies to avoid failing typescript build under `tsc:full`

## @backstage/dev-utils@1.0.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/app-defaults@1.3.1-next.1
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/test-utils@1.3.1-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1

## @backstage/integration-react@1.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @techdocs/cli@1.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-techdocs-node@1.7.1-next.1
  - @backstage/config@1.0.7

## @backstage/test-utils@1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.12

## @backstage/plugin-adr@0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1

## @backstage/plugin-adr-backend@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-airbrake@0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/dev-utils@1.0.15-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/test-utils@1.3.1-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-airbrake-backend@0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-allure@0.1.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-analytics-module-ga@0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-analytics-module-ga4@0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-apache-airflow@0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-api-docs@0.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog@1.11.0-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-apollo-explorer@0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-app-backend@0.3.45-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/config@1.0.7

## @backstage/plugin-auth-backend@0.18.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-auth-node@0.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-azure-devops@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-azure-devops-backend@0.3.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-azure-sites@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-azure-sites-backend@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-badges@0.2.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-badges-backend@0.1.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-bazaar@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/cli@0.22.7-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog@1.11.0-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-bazaar-backend@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-bitrise@0.1.45-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-catalog@1.11.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1

## @backstage/plugin-catalog-backend@1.9.1-next.1

### Patch Changes

- 27956d78671: Adjusted the OpenAPI schema file name according to the new structure
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-aws@0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-azure@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-gerrit@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-github@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-catalog-backend-module-ldap@0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-msgraph@0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-openapi@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-graph@0.2.30-next.1

### Patch Changes

- d446f8fb0a8: Expose all `EntityRelationsGraphProps` to Catalog Graph Page
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-catalog-import@0.9.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-catalog-node@1.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## @backstage/plugin-catalog-react@1.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## @backstage/plugin-cicd-statistics@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-cicd-statistics@0.1.20-next.1

## @backstage/plugin-circleci@0.3.18-next.1

### Patch Changes

- 1c4958d905f: Hide empty time field data for queued builds which haven't started yet
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-cloudbuild@0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-code-climate@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-code-coverage@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-code-coverage-backend@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-codescene@0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-config-schema@0.1.41-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-cost-insights@0.12.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-dynatrace@5.0.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-entity-feedback@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-entity-feedback-backend@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-entity-validation@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-events-backend@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-aws-sqs@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-azure@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-gerrit@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-github@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-module-gitlab@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-backend-test-utils@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.6-next.1

## @backstage/plugin-events-node@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## @backstage/plugin-explore@0.4.3-next.1

### Patch Changes

- 1996920782b: Make sure that the first support button row does not break across lines
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/plugin-explore-react@0.0.28

## @backstage/plugin-explore-backend@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.1-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-firehydrant@0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-fossa@0.2.50-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-gcalendar@0.3.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-gcp-projects@0.3.37-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-git-release-manager@0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-github-actions@0.5.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-github-deployments@0.1.49-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1

## @backstage/plugin-github-issues@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-github-pull-requests-board@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-gitops-profiles@0.3.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-gocd@0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-graphiql@0.2.50-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-graphql-backend@0.1.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-catalog-graphql@0.3.20

## @backstage/plugin-graphql-voyager@0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-home@0.5.2-next.1

### Patch Changes

- 0e19e7b0f3a: Bump to using the later v5 versions of `@rjsf/*`
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-ilert@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-jenkins@0.7.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-jenkins-backend@0.1.35-next.1

### Patch Changes

- 670a2dd6f4e: Fix handling of slashes in branch names
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-kafka@0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-kafka-backend@0.2.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-lighthouse@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-lighthouse-backend@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-linguist@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-linguist-backend@0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-microsoft-calendar@0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-newrelic@0.3.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-newrelic-dashboard@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-org@0.6.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-org-react@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-pagerduty@0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-periskop@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-periskop-backend@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-permission-backend@0.5.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-permission-node@0.7.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-playlist@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/plugin-permission-react@0.4.12

## @backstage/plugin-playlist-backend@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-proxy-backend@0.2.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-puppetdb@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-rollbar@0.4.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-rollbar-backend@0.1.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder@1.13.1-next.1

### Patch Changes

- d560d457c98: Fix case GitLab workspace is a nested subgroup
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-scaffolder-react@1.3.1-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.12

## @backstage/plugin-scaffolder-backend@1.13.2-next.1

### Patch Changes

- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-scaffolder-backend@1.13.2-next.1
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-scaffolder-backend@1.13.2-next.1
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-gitlab@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-rails@0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-scaffolder-backend@1.13.2-next.1
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-scaffolder-node@0.1.3-next.1

### Patch Changes

- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## @backstage/plugin-scaffolder-react@1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-search@1.3.0-next.1

### Patch Changes

- 0e3d8d69318: Fixed 404 Error when fetching search results due to URL encoding changes
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend@1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-module-catalog@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-module-elasticsearch@1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-module-explore@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-module-pg@0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-module-techdocs@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/plugin-techdocs-node@1.7.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-backend-node@1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-search-react@1.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-sentry@0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-shortcuts@0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-sonarqube@0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-sonarqube-backend@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-splunk-on-call@0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-stack-overflow@0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-home@0.5.2-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-stack-overflow-backend@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-stackstorm@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-tech-insights@0.3.10-next.1

### Patch Changes

- 22963209d23: Added the possibility to customize the check description in the scorecard component.

  - The `CheckResultRenderer` type now exposes an optional `description` method that allows to overwrite the description with a different string or a React component for a provided check result.

  Until now only the `BooleanCheck` element could be overridden, but from now on it's also possible to override the description for a check.
  As an example, the description could change depending on the check result. Refer to the [README](https://github.com/backstage/backstage/blob/v1.14.0-next.1/plugins/tech-insights/README.md#adding-custom-rendering-components) file for more details

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-tech-insights-backend@0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-tech-insights-node@0.4.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-tech-insights-node@0.4.3-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-tech-insights-node@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-tech-radar@0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @backstage/plugin-techdocs@1.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/plugin-techdocs-react@1.1.6-next.0
  - @backstage/config@1.0.7

## @backstage/plugin-techdocs-addons-test-utils@1.0.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/test-utils@1.3.1-next.1
  - @backstage/plugin-catalog@1.11.0-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/plugin-techdocs@1.6.2-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/plugin-techdocs-react@1.1.6-next.0

## @backstage/plugin-techdocs-backend@1.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.1-next.1
  - @backstage/plugin-techdocs-node@1.7.1-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-techdocs-module-addons-contrib@1.0.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/plugin-techdocs-react@1.1.6-next.0

## @backstage/plugin-techdocs-node@1.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7
  - @backstage/integration-aws-node@0.1.2

## @backstage/plugin-techdocs-react@1.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## @backstage/plugin-todo@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-todo-backend@0.1.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-user-settings@0.7.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-user-settings-backend@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1

## @backstage/plugin-vault@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @backstage/plugin-vault-backend@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/config@1.0.7

## @backstage/plugin-xcmetrics@0.2.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## example-app@0.2.83-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-tech-insights@0.3.10-next.1
  - @backstage/plugin-scaffolder@1.13.1-next.1
  - @backstage/plugin-search@1.3.0-next.1
  - @backstage/plugin-explore@0.4.3-next.1
  - @backstage/app-defaults@1.3.1-next.1
  - @backstage/plugin-kubernetes@0.9.0-next.1
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/plugin-catalog-graph@0.2.30-next.1
  - @backstage/plugin-home@0.5.2-next.1
  - @backstage/plugin-octopus-deploy@0.2.0-next.1
  - @backstage/plugin-circleci@0.3.18-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/cli@0.22.7-next.0
  - @backstage/plugin-airbrake@0.3.18-next.1
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-apache-airflow@0.2.11-next.0
  - @backstage/plugin-api-docs@0.9.3-next.1
  - @backstage/plugin-azure-devops@0.2.9-next.1
  - @backstage/plugin-azure-sites@0.1.7-next.1
  - @backstage/plugin-badges@0.2.42-next.1
  - @backstage/plugin-catalog-import@0.9.8-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-cloudbuild@0.3.18-next.1
  - @backstage/plugin-code-coverage@0.2.11-next.1
  - @backstage/plugin-cost-insights@0.12.7-next.1
  - @backstage/plugin-dynatrace@5.0.0-next.1
  - @backstage/plugin-entity-feedback@0.2.1-next.1
  - @backstage/plugin-gcalendar@0.3.14-next.0
  - @backstage/plugin-gcp-projects@0.3.37-next.0
  - @backstage/plugin-github-actions@0.5.18-next.1
  - @backstage/plugin-gocd@0.1.24-next.1
  - @backstage/plugin-graphiql@0.2.50-next.0
  - @backstage/plugin-jenkins@0.7.17-next.1
  - @backstage/plugin-kafka@0.3.18-next.1
  - @backstage/plugin-lighthouse@0.4.3-next.1
  - @backstage/plugin-linguist@0.1.3-next.1
  - @backstage/plugin-microsoft-calendar@0.1.3-next.0
  - @backstage/plugin-newrelic@0.3.36-next.0
  - @backstage/plugin-org@0.6.8-next.1
  - @backstage/plugin-pagerduty@0.5.11-next.1
  - @backstage/plugin-playlist@0.1.9-next.1
  - @backstage/plugin-puppetdb@0.1.1-next.1
  - @backstage/plugin-rollbar@0.4.18-next.1
  - @backstage/plugin-scaffolder-react@1.3.1-next.1
  - @backstage/plugin-search-react@1.6.0-next.1
  - @backstage/plugin-sentry@0.5.3-next.1
  - @backstage/plugin-shortcuts@0.3.10-next.1
  - @backstage/plugin-stack-overflow@0.1.15-next.1
  - @backstage/plugin-stackstorm@0.1.2-next.0
  - @backstage/plugin-tech-radar@0.6.4-next.1
  - @backstage/plugin-techdocs@1.6.2-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.0.13-next.1
  - @backstage/plugin-todo@0.2.20-next.1
  - @backstage/plugin-user-settings@0.7.3-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/plugin-newrelic-dashboard@0.2.11-next.1
  - @backstage/plugin-techdocs-react@1.1.6-next.0
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.12
  - @internal/plugin-catalog-customized@0.0.10-next.1

## example-backend@0.2.83-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-kubernetes-backend@0.11.0-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/plugin-jenkins-backend@0.1.35-next.1
  - @backstage/plugin-scaffolder-backend@1.13.2-next.1
  - example-app@0.2.83-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-adr-backend@0.3.3-next.1
  - @backstage/plugin-app-backend@0.3.45-next.1
  - @backstage/plugin-auth-backend@0.18.3-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-azure-devops-backend@0.3.24-next.1
  - @backstage/plugin-azure-sites-backend@0.1.7-next.1
  - @backstage/plugin-badges-backend@0.1.39-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/plugin-code-coverage-backend@0.2.11-next.1
  - @backstage/plugin-entity-feedback-backend@0.1.3-next.1
  - @backstage/plugin-events-backend@0.2.6-next.1
  - @backstage/plugin-explore-backend@0.0.7-next.1
  - @backstage/plugin-graphql-backend@0.1.35-next.1
  - @backstage/plugin-kafka-backend@0.2.38-next.1
  - @backstage/plugin-lighthouse-backend@0.2.1-next.1
  - @backstage/plugin-linguist-backend@0.2.2-next.1
  - @backstage/plugin-permission-backend@0.5.20-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/plugin-playlist-backend@0.3.1-next.1
  - @backstage/plugin-proxy-backend@0.2.39-next.1
  - @backstage/plugin-rollbar-backend@0.1.42-next.1
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.14-next.1
  - @backstage/plugin-search-backend@1.3.1-next.1
  - @backstage/plugin-search-backend-module-elasticsearch@1.2.1-next.1
  - @backstage/plugin-search-backend-module-pg@0.5.6-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/plugin-tech-insights-backend@0.5.11-next.1
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.29-next.1
  - @backstage/plugin-tech-insights-node@0.4.3-next.1
  - @backstage/plugin-techdocs-backend@1.6.2-next.1
  - @backstage/plugin-todo-backend@0.1.42-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## example-backend-next@0.0.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-backend@0.11.0-next.1
  - @backstage/plugin-catalog-backend@1.9.1-next.1
  - @backstage/plugin-scaffolder-backend@1.13.2-next.1
  - @backstage/backend-defaults@0.1.10-next.1
  - @backstage/plugin-app-backend@0.3.45-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/plugin-permission-backend@0.5.20-next.1
  - @backstage/plugin-permission-node@0.7.8-next.1
  - @backstage/plugin-search-backend@1.3.1-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.1-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.1-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.1-next.1
  - @backstage/plugin-search-backend-node@1.2.1-next.1
  - @backstage/plugin-techdocs-backend@1.6.2-next.1
  - @backstage/plugin-todo-backend@0.1.42-next.1

## e2e-test@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.1-next.1

## techdocs-cli-embedded-app@0.2.82-next.1

### Patch Changes

- Updated dependencies
  - @backstage/app-defaults@1.3.1-next.1
  - @backstage/core-app-api@1.8.0-next.1
  - @backstage/core-components@0.13.1-next.0
  - @backstage/cli@0.22.7-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/test-utils@1.3.1-next.1
  - @backstage/plugin-catalog@1.11.0-next.1
  - @backstage/plugin-techdocs@1.6.2-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/plugin-techdocs-react@1.1.6-next.0
  - @backstage/config@1.0.7

## @internal/plugin-catalog-customized@0.0.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.11.0-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

## @internal/plugin-todo-list@1.0.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1

## @internal/plugin-todo-list-backend@1.0.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
