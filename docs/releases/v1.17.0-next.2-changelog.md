# Release v1.17.0-next.2

## @backstage/plugin-app-node@0.1.0-next.0

### Minor Changes

- 9fbe95ef6503: Added the `app` plugin node library, initially providing an extension point that can be used to configure a static fallback handler.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## @backstage/plugin-catalog-backend@1.12.0-next.2

### Minor Changes

- b8cccd8ee858: Support configuring applicable kinds for `AnnotateScmSlugEntityProcessor`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-catalog@0.1.4-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-linguist-backend@0.4.0-next.2

### Minor Changes

- d440f1dd0e72: Adds a processor to the linguist backend which can automatically add language tags to entities

### Patch Changes

- Updated dependencies
  - @backstage/plugin-linguist-common@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-proxy-backend@0.3.0-next.2

### Minor Changes

- 7daf65bfcfa1: Defining proxy endpoints directly under the root `proxy` configuration key is deprecated. Endpoints should now be declared under `proxy.endpoints` instead. The `skipInvalidProxies` and `reviveConsumedRequestBodies` can now also be configured through static configuration.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/backend-app-api@0.5.0-next.2

### Patch Changes

- e65c4896f755: Do not throw in backend.stop, if start failed
- cc9256a33bcc: Added new experimental `featureDiscoveryServiceFactory`, available as an `/alpha` export.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
  - @backstage/config-loader@1.4.0-next.1

## @backstage/backend-common@0.19.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/config-loader@1.4.0-next.1

## @backstage/backend-defaults@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/backend-plugin-api@0.6.0-next.2

### Patch Changes

- cc9256a33bcc: Added new experimental `featureDiscoveryServiceRef`, available as an `/alpha` export.
- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/backend-tasks@0.5.5-next.2

### Patch Changes

- dfd1b6b2fc33: Make `readTaskScheduleDefinitionFromConfig` properly handle bad inputs
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/backend-test-utils@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/create-app@0.5.4-next.2

### Patch Changes

- Bumped create-app version.

## @backstage/dev-utils@1.0.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @techdocs/cli@1.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-techdocs-node@1.7.4-next.2

## @backstage/plugin-adr@0.6.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-adr-backend@0.3.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-airbrake@0.3.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/dev-utils@1.0.18-next.2

## @backstage/plugin-airbrake-backend@0.2.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-allure@0.1.37-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-api-docs@0.9.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-catalog@1.12.1-next.2

## @backstage/plugin-app-backend@0.3.48-next.2

### Patch Changes

- d564ad142b17: Migrated the alpha `appBackend` export to use static configuration and extension points rather than accepting options.
- Updated dependencies
  - @backstage/plugin-app-node@0.1.0-next.0
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/config-loader@1.4.0-next.1

## @backstage/plugin-auth-backend@0.18.6-next.2

### Patch Changes

- 16452cd007ae: Updated `frameHandler` to return `undefined` when using the redirect flow instead of returning `postMessageReponse` which was causing errors
- bb70a9c3886a: Add frontend visibility to provider objects in `auth` config.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-auth-node@0.2.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-azure-devops@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-azure-devops-backend@0.3.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-azure-sites@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-azure-sites-backend@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-badges@0.2.45-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-badges-backend@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-bazaar@0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-catalog@1.12.1-next.2
  - @backstage/cli@0.22.10-next.1

## @backstage/plugin-bazaar-backend@0.2.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-bitrise@0.1.48-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-catalog@1.12.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-catalog-backend-module-aws@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-azure@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-gcp@0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-gerrit@0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-github@0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-catalog-backend-module-gitlab@0.2.4-next.2

### Patch Changes

- 2fe1f5973ff7: Filter Gitlab archived projects through APIs
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-catalog-backend-module-ldap@0.5.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-msgraph@0.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-openapi@0.1.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-catalog-backend-module-unprocessed@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-catalog-graph@0.2.33-next.2

### Patch Changes

- 62dc7a2b1ad1: Added maximum depth parameter to the catalogGraphParams in CatalogGraphCard.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-catalog-import@0.9.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-catalog-node@1.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## @backstage/plugin-catalog-react@1.8.1-next.1

### Patch Changes

- aa3feedce10a: Allow specifying screen size when catalog filters are hidden in drawer

## @backstage/plugin-cicd-statistics@0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-cicd-statistics@0.1.23-next.1

## @backstage/plugin-circleci@0.3.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-cloudbuild@0.3.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-code-climate@0.1.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-code-coverage@0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-code-coverage-backend@0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-cost-insights@0.12.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-devtools-backend@0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
  - @backstage/config-loader@1.4.0-next.1

## @backstage/plugin-dynatrace@7.0.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-entity-feedback@0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-entity-feedback-backend@0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-entity-validation@0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-events-backend@0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-aws-sqs@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-azure@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-gerrit@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-github@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-module-gitlab@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-backend-test-utils@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.9-next.2

## @backstage/plugin-events-node@0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## @backstage/plugin-explore@0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-explore-react@0.0.30

## @backstage/plugin-explore-backend@0.0.10-next.2

### Patch Changes

- eda2a699f40d: Moved the config example from the "Tools as Code" section to the "Tools as Config" section of the README
- Updated dependencies
  - @backstage/plugin-search-backend-module-explore@0.1.4-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-firehydrant@0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-fossa@0.2.53-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-github-actions@0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-github-deployments@0.1.52-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-github-issues@0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-github-pull-requests-board@0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-gocd@0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-graphql-backend@0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-graphql-voyager@0.1.6-next.2

### Patch Changes

- bb1e1c2b26cc: Fix typo in install instructions.

## @backstage/plugin-home@0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-home-react@0.1.2-next.0

## @backstage/plugin-ilert@0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-jenkins@0.8.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-jenkins-backend@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-kafka@0.3.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-kafka-backend@0.2.41-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-kubernetes@0.9.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-kubernetes-backend@0.11.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-lighthouse@0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-lighthouse-backend@0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-linguist@0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-linguist-common@0.1.1-next.1
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-linguist-common@0.1.1-next.1

### Patch Changes

- d440f1dd0e72: Exported new LanguageType type alias

## @backstage/plugin-newrelic-dashboard@0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-nomad@0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-nomad-backend@0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-octopus-deploy@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-org@0.6.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-org-react@0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-pagerduty@0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-home-react@0.1.2-next.0

## @backstage/plugin-periskop@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-periskop-backend@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-permission-backend@0.5.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-permission-node@0.7.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-playlist@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-playlist-backend@0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-puppetdb@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-rollbar@0.4.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-rollbar-backend@0.1.45-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-scaffolder@1.14.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-scaffolder-react@1.5.2-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-scaffolder-backend@1.15.2-next.2

### Patch Changes

- 33c76caef72a: Added examples for the fs:delete and fs:rename actions
- 0b1d775be05b: Adds examples to a few scaffolder actions.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-scaffolder-node@0.1.6-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-scaffolder-backend-module-gitlab@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## @backstage/plugin-scaffolder-backend-module-rails@0.4.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## @backstage/plugin-scaffolder-node@0.1.6-next.2

### Patch Changes

- 0b1d775be05b: Export `TemplateExample` from the `createTemplateAction` type.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-scaffolder-react@1.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-search@1.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-search-backend@1.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-search-backend-module-catalog@0.1.4-next.2

### Patch Changes

- 29f77f923c71: Ensure that all services are dependency injected into the module instead of taken from options
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## @backstage/plugin-search-backend-module-elasticsearch@1.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## @backstage/plugin-search-backend-module-explore@0.1.4-next.2

### Patch Changes

- 29f77f923c71: Ensure that all services are dependency injected into the module instead of taken from options
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## @backstage/plugin-search-backend-module-pg@0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2

## @backstage/plugin-search-backend-module-techdocs@0.1.4-next.2

### Patch Changes

- 29f77f923c71: Ensure that all services are dependency injected into the module instead of taken from options
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2
  - @backstage/plugin-techdocs-node@1.7.4-next.2

## @backstage/plugin-search-backend-node@1.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-sentry@0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-sonarqube@0.7.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-sonarqube-backend@0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-splunk-on-call@0.4.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-stack-overflow-backend@0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-tech-insights@0.3.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-tech-insights-backend@0.5.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-tech-insights-node@0.4.6-next.2

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.32-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-tech-insights-node@0.4.6-next.2

## @backstage/plugin-tech-insights-node@0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-techdocs@1.6.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.12.1-next.2
  - @backstage/plugin-techdocs@1.6.6-next.2
  - @backstage/integration-react@1.1.16-next.1

## @backstage/plugin-techdocs-backend@1.6.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.4-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-techdocs-node@1.7.4-next.2

## @backstage/plugin-techdocs-node@1.7.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## @backstage/plugin-todo@0.2.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-todo-backend@0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2

## @backstage/plugin-user-settings@0.7.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-user-settings-backend@0.1.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## @backstage/plugin-vault@0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## @backstage/plugin-vault-backend@0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2

## example-app@0.2.86-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-graph@0.2.33-next.2
  - @backstage/plugin-linguist-common@0.1.1-next.1
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-linguist@0.1.6-next.2
  - @backstage/plugin-adr@0.6.4-next.2
  - @backstage/plugin-airbrake@0.3.21-next.2
  - @backstage/plugin-api-docs@0.9.7-next.2
  - @backstage/plugin-azure-devops@0.3.3-next.1
  - @backstage/plugin-azure-sites@0.1.10-next.1
  - @backstage/plugin-badges@0.2.45-next.1
  - @internal/plugin-catalog-customized@0.0.13-next.2
  - @backstage/plugin-catalog-import@0.9.11-next.2
  - @backstage/plugin-circleci@0.3.21-next.1
  - @backstage/plugin-cloudbuild@0.3.21-next.1
  - @backstage/plugin-code-coverage@0.2.14-next.2
  - @backstage/plugin-cost-insights@0.12.10-next.1
  - @backstage/plugin-dynatrace@7.0.1-next.2
  - @backstage/plugin-entity-feedback@0.2.4-next.2
  - @backstage/plugin-explore@0.4.7-next.1
  - @backstage/plugin-github-actions@0.6.2-next.2
  - @backstage/plugin-gocd@0.1.27-next.1
  - @backstage/plugin-home@0.5.5-next.1
  - @backstage/plugin-jenkins@0.8.3-next.2
  - @backstage/plugin-kafka@0.3.21-next.2
  - @backstage/plugin-kubernetes@0.9.4-next.1
  - @backstage/plugin-lighthouse@0.4.6-next.1
  - @backstage/plugin-newrelic-dashboard@0.2.14-next.2
  - @backstage/plugin-nomad@0.1.2-next.2
  - @backstage/plugin-octopus-deploy@0.2.3-next.2
  - @backstage/plugin-org@0.6.11-next.2
  - @backstage/plugin-pagerduty@0.6.2-next.1
  - @backstage/plugin-playlist@0.1.13-next.2
  - @backstage/plugin-puppetdb@0.1.4-next.1
  - @backstage/plugin-rollbar@0.4.21-next.1
  - @backstage/plugin-scaffolder@1.14.2-next.2
  - @backstage/plugin-scaffolder-react@1.5.2-next.1
  - @backstage/plugin-search@1.3.4-next.1
  - @backstage/plugin-sentry@0.5.6-next.1
  - @backstage/plugin-tech-insights@0.3.13-next.2
  - @backstage/plugin-techdocs@1.6.6-next.2
  - @backstage/plugin-todo@0.2.23-next.1
  - @backstage/plugin-user-settings@0.7.6-next.1
  - @backstage/cli@0.22.10-next.1
  - @backstage/integration-react@1.1.16-next.1
  - @backstage/plugin-apache-airflow@0.2.14-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.2-next.0
  - @backstage/plugin-devtools@0.1.3-next.1
  - @backstage/plugin-gcalendar@0.3.17-next.1
  - @backstage/plugin-gcp-projects@0.3.40-next.0
  - @backstage/plugin-graphiql@0.2.53-next.0
  - @backstage/plugin-microsoft-calendar@0.1.6-next.1
  - @backstage/plugin-newrelic@0.3.39-next.0
  - @backstage/plugin-shortcuts@0.3.13-next.1
  - @backstage/plugin-stack-overflow@0.1.19-next.1
  - @backstage/plugin-stackstorm@0.1.5-next.0
  - @backstage/plugin-tech-radar@0.6.7-next.0
  - @backstage/plugin-techdocs-module-addons-contrib@1.0.16-next.1

## example-backend@0.2.86-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.18.6-next.2
  - @backstage/plugin-scaffolder-backend@1.15.2-next.2
  - @backstage/plugin-explore-backend@0.0.10-next.2
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/plugin-proxy-backend@0.3.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-app-backend@0.3.48-next.2
  - @backstage/plugin-linguist-backend@0.4.0-next.2
  - @backstage/plugin-techdocs-backend@1.6.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - example-app@0.2.86-next.2
  - @backstage/plugin-adr-backend@0.3.6-next.2
  - @backstage/plugin-azure-devops-backend@0.3.27-next.2
  - @backstage/plugin-badges-backend@0.2.3-next.2
  - @backstage/plugin-catalog-backend-module-unprocessed@0.2.0-next.2
  - @backstage/plugin-catalog-node@1.4.1-next.2
  - @backstage/plugin-devtools-backend@0.1.3-next.2
  - @backstage/plugin-entity-feedback-backend@0.1.6-next.2
  - @backstage/plugin-events-backend@0.2.9-next.2
  - @backstage/plugin-events-node@0.2.9-next.2
  - @backstage/plugin-kafka-backend@0.2.41-next.2
  - @backstage/plugin-kubernetes-backend@0.11.3-next.2
  - @backstage/plugin-lighthouse-backend@0.2.4-next.2
  - @backstage/plugin-permission-backend@0.5.23-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-search-backend@1.4.0-next.2
  - @backstage/plugin-search-backend-module-elasticsearch@1.3.3-next.2
  - @backstage/plugin-search-backend-module-pg@0.5.9-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2
  - @backstage/plugin-todo-backend@0.2.0-next.2
  - @backstage/plugin-tech-insights-backend@0.5.14-next.2
  - @backstage/plugin-tech-insights-node@0.4.6-next.2
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.1-next.2
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.17-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
  - @backstage/plugin-azure-sites-backend@0.1.10-next.2
  - @backstage/plugin-code-coverage-backend@0.2.14-next.2
  - @backstage/plugin-graphql-backend@0.1.38-next.2
  - @backstage/plugin-jenkins-backend@0.2.3-next.2
  - @backstage/plugin-nomad-backend@0.1.2-next.2
  - @backstage/plugin-playlist-backend@0.3.4-next.2
  - @backstage/plugin-rollbar-backend@0.1.45-next.2
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.32-next.2

## example-backend-next@0.0.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-techdocs@0.1.4-next.2
  - @backstage/plugin-search-backend-module-catalog@0.1.4-next.2
  - @backstage/plugin-search-backend-module-explore@0.1.4-next.2
  - @backstage/plugin-scaffolder-backend@1.15.2-next.2
  - @backstage/plugin-catalog-backend@1.12.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/plugin-proxy-backend@0.3.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-app-backend@0.3.48-next.2
  - @backstage/plugin-linguist-backend@0.4.0-next.2
  - @backstage/plugin-techdocs-backend@1.6.5-next.2
  - @backstage/backend-defaults@0.2.0-next.2
  - @backstage/plugin-adr-backend@0.3.6-next.2
  - @backstage/plugin-azure-devops-backend@0.3.27-next.2
  - @backstage/plugin-badges-backend@0.2.3-next.2
  - @backstage/plugin-catalog-backend-module-unprocessed@0.2.0-next.2
  - @backstage/plugin-devtools-backend@0.1.3-next.2
  - @backstage/plugin-entity-feedback-backend@0.1.6-next.2
  - @backstage/plugin-kubernetes-backend@0.11.3-next.2
  - @backstage/plugin-lighthouse-backend@0.2.4-next.2
  - @backstage/plugin-permission-backend@0.5.23-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-search-backend@1.4.0-next.2
  - @backstage/plugin-search-backend-node@1.2.4-next.2
  - @backstage/plugin-todo-backend@0.2.0-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## e2e-test@0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.4-next.2

## techdocs-cli-embedded-app@0.2.85-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.12.1-next.2
  - @backstage/plugin-techdocs@1.6.6-next.2
  - @backstage/cli@0.22.10-next.1
  - @backstage/integration-react@1.1.16-next.1

## @internal/plugin-catalog-customized@0.0.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-catalog@1.12.1-next.2

## @internal/plugin-todo-list-backend@1.0.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
