# Release v1.19.0

## @backstage/cli@0.23.0

### Minor Changes

- 8defbd5434: Update typescript-eslint to 6.7.x, adding compatibility with TypeScript 5.2.

  This includes a major update on typescript-eslint, you can see the details in the [release notes](https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/).

- 7077dbf131: **BREAKING** The new backend start command that used to be enabled by setting `EXPERIMENTAL_BACKEND_START` is now the default. To revert to the old behavior set `LEGACY_BACKEND_START`, which is recommended if you haven't migrated to the new backend system.

  This new command is no longer based on Webpack, but instead uses Node.js loaders to transpile on the fly. Rather than hot reloading modules the entire backend is now restarted on change, but the SQLite database state is still maintained across restarts via a parent process.

### Patch Changes

- 9468a67b92: In frontend builds and tests `process.env.HAS_REACT_DOM_CLIENT` will now be defined if `react-dom/client` is present, i.e. if using React 18. This allows for conditional imports of `react-dom/client`.

- 68158034e8: Fix for the new backend `start` command to make it work on Windows.

- 4f16e60e6d: Request slightly smaller pages of data from GitHub

- 21cd3b1b24: Added a template for creating `node-library` packages with `yarn new`.

- d0f26cfa4f: Fixed an issue where the new backend start command would not gracefully shut down the backend process on Windows.

- 1ea20b0be5: Updated dependency `@typescript-eslint/eslint-plugin` to `6.7.5`.

- 2ef6522552: Support for the `.icon.svg` extension has been deprecated and will be removed in the future. The implementation of this extension is too tied to a particular version of MUI and the SVGO, and it makes it harder to evolve the build system. We may introduce the ability to reintroduce this kind of functionality in the future through configuration for use in internal plugins, but for now we're forced to remove it.

  To migrate existing code, rename the `.icon.svg` file to `.tsx` and replace the `<svg>` element with `<SvgIcon>` from MUI and add necessary imports. For example:

  ```tsx
  import React from 'react';
  import SvgIcon from '@material-ui/core/SvgIcon';
  import { IconComponent } from '@backstage/core-plugin-api';

  export const CodeSceneIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
      <g>
        <path d="..." />
      </g>
    </SvgIcon>
  );
  ```

- b9ec93430e: The scaffolder-module template now recommends usage of `createMockDirectory` instead of `mock-fs`.

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.

- 425203f898: Fixed recursive reloading issues of the backend, caused by unwanted watched files.

- 3ef18f8c06: Explicitly set `exports: 'named'` for CJS builds, ensuring that they have e.g. `exports["default"] = catalogPlugin;`

- 7187f2953e: The experimental package discovery will now always use the package name for include and exclude filtering, rather than the full module id. Entries pointing to a subpath export will now instead have an `export` field specifying the subpath that the import is from.

- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config-loader@1.5.1
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.1.5
  - @backstage/config@1.1.1
  - @backstage/eslint-plugin@0.1.3
  - @backstage/release-manifests@0.0.10
  - @backstage/types@1.1.1

## @backstage/core-app-api@1.11.0

### Minor Changes

- c9d9bfeca2: URL encode some well known unsafe characters in `RouteResolver` (and therefore `useRouteRef`)

### Patch Changes

- 29e4d8b76b: Fixed bug in `AppRouter` to determine the correct `signOutTargetUrl` if `app.baseUrl` contains a `basePath`
- acca17e91a: Wrap entire app in `<Suspense>`, enabling support for using translations outside plugins.
- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- f1b349cfba: Fixed a bug in `TranslationApi` implementation where in some cases it wouldn't notify subscribers of language changes.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/version-bridge@1.0.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/core-plugin-api@1.7.0

### Minor Changes

- 322bbcae24: Removed the exprimental plugin configuration API. The `__experimentalReconfigure()` from the plugin options as well as the `__experimentalConfigure()` method on plugin instances have both been removed.

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/e2e-test-utils@0.1.0

### Minor Changes

- f5b41b27a9: Initial release.

## @backstage/frontend-app-api@0.2.0

### Minor Changes

- 4461d87d5a: Removed support for the new `useRouteRef`.
- 9d03dfe5e3: The `createApp` config option has been replaced by a new `configLoader` option. There is now also a `pluginLoader` option that can be used to dynamically load plugins into the app.
- d7c5d80c57: The hidden `'root'` extension has been removed and has instead been made an input of the `'core'` extension. The checks for rejecting configuration of the `'root'` extension to rejects configuration of the `'core'` extension instead.
- d920b8c343: Added support for installing `ExtensionOverrides` via `createApp` options. As part of this change the `plugins` option has been renamed to `features`, and the `pluginLoader` has been renamed to `featureLoader`.

### Patch Changes

- 322bbcae24: Internal update for removal of experimental plugin configuration API.
- f78ac58f88: Filters for discovered packages are now also applied at runtime. This makes it possible to disable packages through the `app.experimental.packages` config at runtime.
- 68ffb9e67d: The app will now reject any extensions that attach to nonexistent inputs.
- 5072824817: Implement `toString()` and `toJSON()` for extension instances.
- 1e60a9c3a5: Fixed an issue preventing the routing system to match subroutes
- 52366db5b3: Make themes configurable through extensions, and switched default themes to use extensions instead.
- 2ecd33618a: Added the `bindRoutes` option to `createApp`.
- e5a2956dd2: Register default api implementations when creating declarative integrated apps.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 06432f900c: Updates for `at` -> `attachTo` refactor.
- 1718ec75b7: Added support for the existing routing system.
- 66d51a4827: Prevents root extension override and duplicated plugin extensions.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/plugin-graphiql@0.2.55
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/frontend-plugin-api@0.2.0

### Minor Changes

- 06432f900c: Extension attachment point is now configured via `attachTo: { id, input }` instead of `at: 'id/input'`.
- 4461d87d5a: Removed support for the new `useRouteRef`.

### Patch Changes

- d3a37f55c0: Add support for `SidebarGroup` on the sidebar item extension.
- 2ecd33618a: Plugins can now be assigned `routes` and `externalRoutes` when created.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- c1e9ca6500: Added `createExtensionOverrides` which can be used to install a collection of extensions in an app that will replace any existing ones.
- 52366db5b3: Added `createThemeExtension` and `coreExtensionData.theme`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/types@1.1.1

## @techdocs/cli@1.6.0

### Minor Changes

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name\` argument

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- 2b6e572051: Restructured tests.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-techdocs-node@1.9.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.0

### Minor Changes

- 6f142d5356: **BREAKING** `gcpIapAuthenticator.initialize()` is no longer `async`

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/types@1.1.1

## @backstage/plugin-auth-backend-module-microsoft-provider@0.1.0

### Minor Changes

- 2d8f7e82c1: Migrated the Microsoft auth provider to new `@backstage/plugin-auth-backend-module-microsoft-provider` module package.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-backend-module-pinniped-provider@0.1.0

### Minor Changes

- ae34255836: Add new Pinniped auth module and authenticator to be used alongside the new Pinniped auth provider.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-node@0.4.0

### Minor Changes

- 6f142d5356: **BREAKING**: The recently introduced `ProxyAuthenticator.initialize()` method is no longer `async` to match the way the OAuth equivalent is implemented.

### Patch Changes

- 6c2b0793bf: Fix for persisted scopes not being properly restored on sign-in.
- 8b8b1d23ae: Fixed cookie persisted scope not returned in OAuth refresh handler response.
- ae34255836: Adding optional audience parameter to OAuthState type declaration
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-catalog@1.14.0

### Minor Changes

- 28f1ab2e1a: The catalog plugin no longer implements the experimental reconfiguration API. The create button title can now instead be configured using the new experimental internationalization API, via the `catalogTranslationRef` exported at `/alpha`. For example:

  ```ts
  import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

  const app = createApp({
    __experimentalTranslations: {
      resources: [
        createTranslationMessages({
          ref: catalogTranslationRef,
          catalog_page_create_button_title: 'Create Software',
        }),
      ],
    },
  });
  ```

- f3561a2935: include owner chip in catalog search result item

### Patch Changes

- 7c4a8e4d5f: Create an experimental `CatalogSearchResultItemExtension` for declarative integration with Backstage; it can be accessed via the `/alpha` import.
- 0296f272b4: The \`spec.lifecycle' field in entities will now always be rendered as a string.
- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- e5a2956dd2: Migrate catalog api to declarative integration system, it is exported from `/alpha` subpath.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-scaffolder-common@1.4.2
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-catalog-backend@1.14.0

### Minor Changes

- 78af9433c8: Instrumenting some missing metrics with `OpenTelemetry`

### Patch Changes

- 7a2e2924c7: Marked the `LocationEntityProcessor` as deprecated, as it is no longer used internally since way back and can even be harmful at this point.
- 0b55f773a7: Removed some unused dependencies
- 348e8c1cdb: Fixes a bug where eagerly deleted entities did not properly trigger re-stitching of entities that they had relations to.
- b97e9790f0: Internal refactors, laying the foundation for later introducing deferred stitching (see #18062).
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-openapi-utils@0.0.5
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-module-catalog@0.1.10
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-catalog-backend-module-aws@0.3.0

### Minor Changes

- 5abc2fd4d6: AwsEksClusterProcessor supports Entity callback function and passes in region when initialize EKS cluster

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-backend-module-github-org@0.1.0

### Minor Changes

- c101e683d5: Added `catalogModuleGithubOrgEntityProvider` to ingest users and teams from multiple Github organizations.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-backend-module-github@0.4.4
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-catalog-graphql@0.4.0

### Minor Changes

- 9def1e95ab: This package has been deprecated, consider using [@frontside/backstage-plugin-graphql-backend](https://www.npmjs.com/package/@frontside/backstage-plugin-graphql-backend) instead.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-graphql-backend@0.2.0

### Minor Changes

- 9def1e95ab: This package has been deprecated, consider using [@frontside/backstage-plugin-graphql-backend](https://www.npmjs.com/package/@frontside/backstage-plugin-graphql-backend) instead.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-graphql@0.4.0
  - @backstage/config@1.1.1

## @backstage/plugin-jenkins@0.9.0

### Minor Changes

- 411896faf9: Added JobRunTable Component.
  Added new Route and extended Api to get buildJobs.
  Actions column has a new icon button, clicking on which takes us to page where we
  can see all the job runs.

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 1a05cf34f6: Extend EntityJenkinsContent to receive columns as prop
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-jenkins-common@0.1.20

## @backstage/plugin-jenkins-backend@0.3.0

### Minor Changes

- 411896faf9: Added JobRunTable Component.
  Added new Route and extended Api to get buildJobs.
  Actions column has a new icon button, clicking on which takes us to page where we
  can see all the job runs.

### Patch Changes

- 930ac236d8: Added support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-jenkins-common@0.1.20
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-kubernetes@0.11.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- b0aca1a798: Updated dependency `xterm-addon-attach` to `^0.9.0`.
  Updated dependency `xterm-addon-fit` to `^0.8.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-react@0.1.0
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-kubernetes-backend@0.13.0

### Minor Changes

- ae943c3bb1: **BREAKING** Allow passing undefined `labelSelector` to `KubernetesFetcher`

  `KubernetesFetch` no longer auto-adds `labelSelector` when empty string was passed.
  This is only applicable if you have custom ObjectProvider implementation, as build-in `KubernetesFanOutHandler` already does this

### Patch Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.
- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-node@0.1.0
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-kubernetes-common@0.7.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-kubernetes-node@0.1.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-kubernetes-react@0.1.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 4262e12921: Handle mixed decimals and bigint when calculating k8s resource usage
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/types@1.1.1

## @backstage/plugin-newrelic-dashboard@0.3.0

### Minor Changes

- d7eba6cab4: Changes in `newrelic-dashboard` plugin:

  - Make DashboardSnapshotList component public
  - Settle discrepancies in the exported API
  - Deprecate DashboardSnapshotComponent

- e605ea4906: Add storybook for newrelic-dashboard plugin.

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 61d55942ae: Fix the styles for NewRelicDashboard, add more responsiveness
- 5194a51a1c: Fixed React Warning: "Each child in a list should have a unique 'key' prop" during the rendering of `EntityNewRelicDashboardCard`
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3

## @backstage/plugin-scaffolder-backend@1.18.0

### Minor Changes

- dea0aafda7: Updated `publish:gitlab` action properties to support additional Gitlab project settings:

  - general project settings provided by gitlab project create API (new `settings` property)
  - branch level settings to create additional branches and make them protected (new `branches` property)
  - project level environment variables settings (new `projectVariables` property)

  Marked existed properties `repoVisibility` and `topics` as deprecated, as they are covered by `settings` property.

- f41099bb31: Display meaningful error to the output if Gitlab namespace not found inside `publish:gitlab`.

### Patch Changes

- 7dd82cc07e: Add examples for `github:issues:label` scaffolder action & improve related tests
- 733ddf7130: Add examples for `publish:Azure` scaffolder action.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-scaffolder-common@1.4.2

## @backstage/plugin-techdocs@1.8.0

### Minor Changes

- 27740caa2d: Added experimental support for declarative integration via the `/alpha` subpath.

### Patch Changes

- 4918f65ab2: Create an experimental `TechDocsSearchResultItemExtension` for declarative integration with Backstage; it can be accessed via the `/alpha` import.
- 3605370af6: Improved `DocsTable` to display pagination controls dynamically, appearing only when needed.
- 0296f272b4: The \`spec.lifecycle' field in entities will now always be rendered as a string.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 9468a67b92: Added support for React 18. The new `createRoot` API from `react-dom/client` will now be used if present.
- df449a7a31: Add kind column by default to TechDocsTable
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-techdocs-backend@1.8.0

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-techdocs-node@1.9.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-module-techdocs@0.1.10
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-techdocs-node@1.9.0

### Minor Changes

- 344cfbcfbc: Allow prepared directory clean up for custom preparers

  When using custom preparer for TechDocs, the `preparedDir` might
  end up taking disk space. This requires all custom preparers to
  implement a new method `shouldCleanPreparedDirectory` which indicates
  whether the prepared directory should be cleaned after generation.

- d06b30b050: Add possibility to use a mkdocs config file with a different name than `mkdocs.<yaml|yml> with the serve command using the `--mkdocs-config-file-name\` argument

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/plugin-search-common@1.2.7

## @backstage/app-defaults@1.4.4

### Patch Changes

- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3

## @backstage/backend-app-api@0.5.6

### Patch Changes

- 74491c9602: Moved `HostDiscovery` from `@backstage/backend-common`.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/config-loader@1.5.1
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/cli-node@0.1.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/backend-common@0.19.8

### Patch Changes

- 74491c9602: The `HostDiscovery` export has been deprecated, import it from `@backstage/backend-app-api` instead.
- b95d66d4ea: Properly close write stream when writing temporary archive for processing zip-based `.readTree()` responses.
- b94f32271e: Added the ability to fetch git tags through the `Git` class. This is useful for scaffolder actions that want to take action based on tag versions in a cloned repository
- 0b55f773a7: Removed some unused dependencies
- 4c39e38f1e: Added `/testUtils` entry point, with a utility for mocking resolve package paths as returned by `resolvePackagePath`.
- 9101c0d1b6: Updated dependency `@kubernetes/client-node` to `0.19.0`.
- a250ad775f: Removed `mock-fs` dev dependency.
- 2a40cd46a8: Adds the optional flag for useRedisSets for the Redis cache to the config.
- 1c3d6fa2b2: The `useHotCleanup` and `useHotMemoize` helpers are now deprecated, since hot module reloads for backend are being phased out.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/backend-dev-utils@0.1.2
  - @backstage/config-loader@1.5.1
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/types@1.1.1

## @backstage/backend-defaults@0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6

## @backstage/backend-dev-utils@0.1.2

### Patch Changes

- afa48341fb: Fix an issue where early IPC responses would be lost.

## @backstage/backend-openapi-utils@0.0.5

### Patch Changes

- 7c83975531: Adds new public utility types for common OpenAPI values, like request and response shapes and parameters available on an endpoint.

  **deprecated** `internal` namespace
  The internal namespace will continue to be exported but now uses OpenAPI format for path parameters. You should use the new utility types.

- Updated dependencies
  - @backstage/errors@1.2.3

## @backstage/backend-plugin-api@0.6.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/backend-tasks@0.5.11

### Patch Changes

- 5db102bfdf: Instrument `backend-tasks` with some counters and histograms for duration.

  `backend_tasks.task.runs.count`: Counter with the total number of times a task has been run.
  `backend_tasks.task.runs.duration`: Histogram with the run durations for each task.

  Both these metrics have come with `result` `taskId` and `scope` labels for finer grained grouping.

- ddd76ac98d: Fix bug where backend tasks that are defined with HumanDuration are immediately triggered on application startup

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/backend-test-utils@0.2.7

### Patch Changes

- a250ad775f: Added `createMockDirectory()` to help out with file system mocking in tests.
- 5ddc03813e: Remove third type parameter used for `MockInstance`, in order to be compatible with older versions of `@types/jest`.
- 74491c9602: Updated to import `HostDiscovery` from `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/catalog-client@1.4.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3

## @backstage/catalog-model@1.4.3

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## @backstage/cli-common@0.1.13

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.

## @backstage/cli-node@0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## @backstage/codemods@0.1.46

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- Updated dependencies
  - @backstage/cli-common@0.1.13

## @backstage/config@1.1.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## @backstage/config-loader@1.5.1

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 30c553c1d2: Updated dependency `typescript-json-schema` to `^0.61.0`.
- 773ea341d2: The `FileConfigSource` will now retry file reading after a short delay if it reads an empty file. This is to avoid flakiness during watch mode where change events can trigger before the file content has been written.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/core-components@0.13.6

### Patch Changes

- 4eab5cf901: The `TabbedLayout` component will now also navigate when clicking the active tab, which allows for navigation back from any sub routes.
- 0b55f773a7: Removed some unused dependencies
- 8a15360bb4: Fixed overflowing messages in `WarningPanel`.
- 997a71850c: Changed SupportButton menuitems to support text wrap
- 0296f272b4: Fixed the type declaration of `DependencyGraphProps`, the `defs` prop now expects `JSX.Element`s.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 16126dbe6a: Change overlay header colors in the mobile menu to use navigation color from the theme
- d19a827ef1: MissingAnnotationEmptyState component can now dynamically generate a YAML example based off the current entity being used.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/create-app@0.5.6

### Patch Changes

- ba6a3b59c1: Removed duplicate `apple-touch-icon` link from `packages/app/public/index.html` that linked to nonexistent icon.

- c8ec0dea4a: Create unique temp directory for each `create-app` execution.

- e43d3eb1b7: Bumped create-app version.

- b665f2ce65: Change base node image from node:18-bullseye-slim to node:18-bookworm-slim due to Docker build error on bullseye.

  You can apply these change to your own `Dockerfile` by replacing `node:18-bullseye-slim` with `node:18-bookworm-slim`

- deed089a3d: Bump `cypress` to fix the end-to-end tests

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.

- 04a3f65e15: Bump Docker base images to `node:18-bookworm-slim` to fix node compatibility issues raised during image build.

  You can apply these change to your own `Dockerfile` by replacing `node:16-bullseye-slim` with `node:18-bookworm-slim`

- 9864f263ba: Bump dev dependencies `lerna@7.3.0` on the template

- 5eacd5d213: The E2E test setup based on Cypress has been replaced with one based on [Playwright](https://playwright.dev/). Migrating existing apps is not required as this is a standalone setup, only do so if you also want to switch from Cypress to Playwright.

  The scripts to run the E2E tests have been removed from `packages/app/package.json`, as they are now instead run from the root. Instead, a new script has been added to the root `package.json`, `yarn test:e2e`, which runs the E2E tests in development mode, unless `CI` is set in the environment.

  The Playwright setup uses utilities from the new `@backstage/e2e-test-utils` package to find and include all packages in the monorepo that have an `e2e-tests` folder.

- 8d2e640af4: Added missing `.eslintignore` file

  To apply this change to an existing app, create a new `.eslintignore` file at the root of your project with the following content:

  ```diff
  + playwright.config.ts
  ```

- Updated dependencies
  - @backstage/cli-common@0.1.13

## @backstage/dev-utils@1.0.22

### Patch Changes

- 080d1beb2a: Moving development `dependencies` to `devDependencies`
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 9468a67b92: Added support for React 18. The new `createRoot` API from `react-dom/client` will now be used if present.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/app-defaults@1.4.4
  - @backstage/theme@0.4.3

## @backstage/errors@1.2.3

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/types@1.1.1

## @backstage/integration@1.7.1

### Patch Changes

- 3963d0b885: Ensure that all relevant config fields are properly marked as secret
- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/config@1.1.1

## @backstage/integration-aws-node@0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1

## @backstage/integration-react@1.1.20

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/core-plugin-api@1.7.0
  - @backstage/config@1.1.1

## @backstage/repo-tools@0.3.5

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.1.5

## @backstage/test-utils@1.4.4

### Patch Changes

- 322bbcae24: Removed the alpha `MockPluginProvider` export since the plugin configuration API has been removed.
- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/theme@0.4.3

### Patch Changes

- 5ad5344756: Added support for string `fontSize` values (e.g. `"2.5rem"`) in themes in addition to numbers. Also added an optional `fontFamily` prop for header typography variants to allow further customization.

## @backstage/version-bridge@1.0.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.

## @backstage/plugin-adr@0.6.8

### Patch Changes

- 499e34656e: Fix icon alignment in `AdrSearchResultListItem`
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 1204e7628e: Create an experimental `AdrSearchResultItemExtension` for declarative integration with Backstage; it can be accessed via the `/alpha` import.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/theme@0.4.3
  - @backstage/plugin-adr-common@0.2.16
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-adr-backend@0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-adr-common@0.2.16
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-adr-common@0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-airbrake@0.3.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/test-utils@1.4.4
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/dev-utils@1.0.22
  - @backstage/theme@0.4.3

## @backstage/plugin-airbrake-backend@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-allure@0.1.41

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-analytics-module-ga@0.1.34

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-analytics-module-ga4@0.1.5

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-analytics-module-newrelic-browser@0.0.3

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/config@1.1.1

## @backstage/plugin-apache-airflow@0.2.16

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6

## @backstage/plugin-api-docs@0.9.12

### Patch Changes

- 0117a6b47e: Adding `requestInterceptor` option to `api-docs` and pass it to SwaggerUI. This will enable to configure a proxy or headers to be sent to all the request made through the `Try it out` button on SwaggerUI.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 18f1756908: added aria-label on api definition button for better a11y.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/plugin-catalog@1.14.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-api-docs-module-protoc-gen-doc@0.1.4

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.

## @backstage/plugin-apollo-explorer@0.1.16

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-app-backend@0.3.54

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/config-loader@1.5.1
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.6

## @backstage/plugin-app-node@0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-backend@0.19.3

### Patch Changes

- 9ff7935152: Fixed bug in oidc refresh handler, if token endpoints response on refresh request does not contain a scope, the requested scope is used.
- 2d8f7e82c1: Migrated the Microsoft auth provider to new `@backstage/plugin-auth-backend-module-microsoft-provider` module package.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-backend-module-github-provider@0.1.3
  - @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.0
  - @backstage/plugin-auth-backend-module-microsoft-provider@0.1.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-auth-backend-module-gitlab-provider@0.1.3
  - @backstage/plugin-auth-backend-module-oauth2-provider@0.1.3
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-backend-module-google-provider@0.1.3

## @backstage/plugin-auth-backend-module-github-provider@0.1.3

### Patch Changes

- 5d32a58b5a: Fixed a bug where the GitHub authenticator did not properly persist granted OAuth scopes.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-backend-module-gitlab-provider@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-backend-module-google-provider@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-auth-backend-module-oauth2-provider@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-azure-devops@0.3.7

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-azure-devops-common@0.3.1

## @backstage/plugin-azure-devops-backend@0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-devops-common@0.3.1

## @backstage/plugin-azure-sites@0.1.14

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-azure-sites-common@0.1.1

## @backstage/plugin-azure-sites-backend@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-sites-common@0.1.1

## @backstage/plugin-badges@0.2.49

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-badges-backend@0.3.3

### Patch Changes

- 817f2acbb1: Make sure the default badge factory is used if nothing is defined
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1

## @backstage/plugin-bazaar@0.2.17

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/plugin-catalog@1.14.0
  - @backstage/cli@0.23.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5

## @backstage/plugin-bazaar-backend@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-bitbucket-cloud-common@0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1

## @backstage/plugin-bitrise@0.1.52

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-catalog-backend-module-azure@0.1.25

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-bitbucket-cloud-common@0.2.13
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.21

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-bitbucket-cloud-common@0.2.13
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.19

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-catalog-backend-module-gcp@0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-catalog-backend-module-gerrit@0.1.22

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-catalog-backend-module-github@0.4.4

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- 0b55f773a7: Removed some unused dependencies
- 4f16e60e6d: Request slightly smaller pages of data from GitHub
- b4b1cbf9fa: Make `defaultUserTransformer` resolve to `UserEntity` instead of `Entity`
- c101e683d5: Removed `catalogModuleGithubOrgEntityProvider`. Import from `@backstage/plugin-catalog-backend-module-github-org` instead.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-catalog-backend-module-gitlab@0.3.3

### Patch Changes

- 4f70fdfc93: fix: use REST API to get root group memberships for GitLab SaaS users listing

  This API is the only one that shows `email` field for enterprise users and
  allows to filter out bot users not using a license using the `is_using_seat`
  field.

  We also added the annotation `gitlab.com/saml-external-uid` taking the value
  of `group_saml_identity.extern_uid` of the `groups/:group-id/members` endpoint
  response. This is useful in case you want to create a `SignInResolver` that
  references the user with the id of your identity provider (e.g. OneLogin).

  ref:

  <https://docs.gitlab.com/ee/user/enterprise_user/#get-users-email-addresses-through-the-api>
  <https://docs.gitlab.com/ee/api/members.html#limitations>

- 890e3b5ad4: Make sure to include the error message when ingestion fails

- 0b55f773a7: Removed some unused dependencies

- 6ae7f12abb: Make sure the archived projects are skipped with the Gitlab API

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.4.10

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-catalog-backend-module-ldap@0.5.21

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-backend-module-msgraph@0.5.13

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-backend-module-openapi@0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.11

### Patch Changes

- 890e3b5ad4: Make sure to include the error message when ingestion fails
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-scaffolder-common@1.4.2

## @backstage/plugin-catalog-backend-module-unprocessed@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-catalog-common@1.0.17

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-catalog-graph@0.2.37

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-import@0.10.1

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 0296f272b4: The `app.title` configuration is now properly required to be a string.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-node@1.4.7

### Patch Changes

- 7a2e2924c7: Added docs to `processingResult`
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-catalog-react@1.8.5

### Patch Changes

- a402e1dfb9: Fixed an issue causing `EntityPage` to show an error for entities containing special characters
- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 0296f272b4: The `spec.type` field in entities will now always be rendered as a string.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/version-bridge@1.0.6
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-catalog-unprocessed-entities@0.1.4

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-cicd-statistics@0.1.27

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.21

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-cicd-statistics@0.1.27
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-circleci@0.3.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-cloudbuild@0.3.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-code-climate@0.1.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-code-coverage@0.2.18

### Patch Changes

- 88b0b32547: Fixed the coverage history statistics to compare newest with oldest record
- 0296f272b4: The warning for missing code coverage will now render the entity as a reference.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- a468544fa9: Updated layout to improve contrasts and consistency with other plugins
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-code-coverage-backend@0.2.20

### Patch Changes

- 4aa27aa200: Added option to set body size limit
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1

## @backstage/plugin-codescene@0.1.18

### Patch Changes

- 9c9a9100b0: Internal refactor to avoid using the deprecated `.icon.svg` extension.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-config-schema@0.1.46

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-cost-insights@0.12.14

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- ba4820883c: Updated dependency `@types/pluralize` to `^0.0.31`.
- 959aa2a09f: The experimental plugin configuration has been removed. The trend line can now instead be hidden by setting `costInsights.hideTrendLine` to `true` in the configuration.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-cost-insights-common@0.1.2

## @backstage/plugin-devtools@0.1.5

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-devtools-common@0.1.5

## @backstage/plugin-devtools-backend@0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/config-loader@1.5.1
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-devtools-common@0.1.5
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-devtools-common@0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-dynatrace@7.0.5

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-entity-feedback@0.2.8

### Patch Changes

- 48c8b93e98: Added tooltip to like dislike buttons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-feedback-backend@0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-validation@0.1.10

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/plugin-catalog-common@1.0.17

## @backstage/plugin-events-backend@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-aws-sqs@0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-azure@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-gerrit@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-github@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-module-gitlab@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-backend-test-utils@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.15

## @backstage/plugin-events-node@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.6

## @backstage/plugin-explore@0.4.11

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 0f10c53a05: Create an experimental `ExploreSearchResultItemExtension` for declarative integration with Backstage; it can be accessed via the `/alpha` import.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-explore-react@0.0.32
  - @backstage/theme@0.4.3
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-explore-backend@0.0.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-search-backend-module-explore@0.1.10
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-explore-react@0.0.32

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-explore-common@0.0.2

## @backstage/plugin-firehydrant@0.2.9

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-fossa@0.2.57

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-gcalendar@0.3.19

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-gcp-projects@0.3.42

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-git-release-manager@0.3.38

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-github-actions@0.6.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-github-deployments@0.1.56

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-github-issues@0.2.14

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 7bd0a8ab3c: Filters out entities that belonged to a different github instance other than the one configured by the plugin
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-github-pull-requests-board@0.1.19

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-gitops-profiles@0.3.41

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-gocd@0.1.31

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-graphiql@0.2.55

### Patch Changes

- 9c9a9100b0: Internal refactor to avoid using the deprecated `.icon.svg` extension.
- 06432f900c: Updated `/alpha` exports to use new `attachTo` option.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-graphql-voyager@0.1.8

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-home@0.5.9

### Patch Changes

- f997f771da: Adds Top/Recently Visited components to homepage
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-home-react@0.1.4
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-home-react@0.1.4

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6

## @backstage/plugin-ilert@0.2.14

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 9c9a9100b0: Internal refactor to avoid using the deprecated `.icon.svg` extension.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-jenkins-common@0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-kafka@0.3.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-kafka-backend@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-kubernetes-cluster@0.0.1

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-react@0.1.0
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-lighthouse@0.4.10

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-lighthouse-common@0.1.4

## @backstage/plugin-lighthouse-backend@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-lighthouse-common@0.1.4

## @backstage/plugin-lighthouse-common@0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1

## @backstage/plugin-linguist@0.1.10

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-linguist-backend@0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-microsoft-calendar@0.1.8

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-newrelic@0.3.41

### Patch Changes

- ce50a15506: Fixed sorting and searching in the NewRelic table.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-nomad@0.1.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @backstage/plugin-nomad-backend@0.1.8

### Patch Changes

- 6822918c50: Added support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-octopus-deploy@0.2.7

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-opencost@0.2.1

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 777b9a16a4: Fix for broken image reference.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-org@0.6.15

### Patch Changes

- dc5b6b971b: Fixed the display of OwnershipCard with aggregated relations by loading relations when getting children of entity.
  This allows the already existing recursive method to work properly when children of entity have children themselves.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-org-react@0.1.14

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5

## @backstage/plugin-pagerduty@0.6.6

### Patch Changes

- b9ce306814: Minor fix to avoid usage of deprecated prop
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-home-react@0.1.4
  - @backstage/theme@0.4.3

## @backstage/plugin-periskop@0.1.23

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-periskop-backend@0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-permission-backend@0.5.29

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-permission-backend-module-allow-all-policy@0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-permission-common@0.7.9

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-permission-node@0.7.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-permission-react@0.4.16

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-playlist@0.1.17

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 65498193e8: Updated Playlist read me with additional screenshots
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/theme@0.4.3
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-playlist-common@0.1.11

## @backstage/plugin-playlist-backend@0.3.10

### Patch Changes

- 9e46f5ff49: Added support to the playlist plugin for the new backend
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-playlist-common@0.1.11

## @backstage/plugin-playlist-common@0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-proxy-backend@0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-puppetdb@0.1.8

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-rollbar@0.4.25

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-rollbar-backend@0.1.51

### Patch Changes

- 407f4284be: ensure rollbar token is hidden
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/config@1.1.1

## @backstage/plugin-scaffolder@1.15.1

### Patch Changes

- b337d78c3b: fixed issue related template editor fails with multiple templates per file.
- ff2ab02690: Make entity picker more reliable with only one available entity
- 83e4a42ccd: Display log visibility button on the template panel
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 4c70fe497d: `RepoUrlPickerRepoName` now correctly handles value changes in allowed repos.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/plugin-scaffolder-react@1.5.6
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-scaffolder-common@1.4.2

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.30

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-gitlab@0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1

## @backstage/plugin-scaffolder-backend-module-rails@0.4.23

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-common@1.4.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-scaffolder-node@0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.4.2

## @backstage/plugin-scaffolder-react@1.5.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.4.2

## @backstage/plugin-search@1.4.1

### Patch Changes

- e5a2956dd2: Create an experimental search plugin that is compatible with the declarative integration system, it is exported from `/alpha` subpath.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 0296f272b4: Minor internal code cleanup.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-search-react@1.7.1
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend@1.4.6

### Patch Changes

- 16be6f9473: Set the default length limit to search query to 100. To override it, define `search.maxTermLength` in the config file.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-openapi-utils@0.0.5
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-module-catalog@0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-module-elasticsearch@1.3.9

### Patch Changes

- 3963d0b885: Ensure that all relevant config fields are properly marked as secret
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.7
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-module-explore@0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-module-pg@0.5.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-module-techdocs@0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-techdocs-node@1.9.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-backend-node@1.2.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-search-common@1.2.7

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## @backstage/plugin-search-react@1.7.1

### Patch Changes

- 06432f900c: Updated `/alpha` exports to use new `attachTo` option.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 0296f272b4: The filter options passed to `SearchResultGroupLayout` are now always explicitly rendered as strings by default.
- 703a4ffc5b: Create `createSearchResultListItem` alpha version that only supports declarative integration.
- Updated dependencies
  - @backstage/frontend-app-api@0.2.0
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-sentry@0.5.10

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-shortcuts@0.3.15

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3
  - @backstage/types@1.1.1

## @backstage/plugin-sonarqube@0.7.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3
  - @backstage/plugin-sonarqube-react@0.1.9

## @backstage/plugin-sonarqube-backend@0.2.8

### Patch Changes

- a5d592d0ad: Added support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @backstage/plugin-sonarqube-react@0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-splunk-on-call@0.4.14

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.4.3

## @backstage/plugin-stack-overflow@0.1.21

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-home-react@0.1.4
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-stack-overflow-backend@0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/config@1.1.1
  - @backstage/plugin-search-common@1.2.7

## @backstage/plugin-stackstorm@0.1.7

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-tech-insights@0.3.17

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- 21f409d776: Export `ScorecardInfo` and `ScorecardsList` components to be able to use manually queried check results directly.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-backend@0.5.20

### Patch Changes

- cc7dddfa7f: Increase the maximum allowed length of an entity filter for tech insights fact schemas.
- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-node@0.4.12
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.38

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-node@0.4.12
  - @backstage/config@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-node@0.4.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-radar@0.6.9

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- c09d2fa1d6: Added experimental support for the declarative integration.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @backstage/plugin-techdocs-addons-test-utils@1.0.22

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog@1.14.0
  - @backstage/test-utils@1.4.4
  - @backstage/core-app-api@1.11.0
  - @backstage/plugin-techdocs@1.8.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/theme@0.4.3

## @backstage/plugin-techdocs-module-addons-contrib@1.1.1

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/theme@0.4.3

## @backstage/plugin-techdocs-react@1.1.12

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/version-bridge@1.0.6
  - @backstage/config@1.1.1

## @backstage/plugin-todo@0.2.28

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-todo-backend@0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/integration@1.7.1
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-openapi-utils@0.0.5
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1

## @backstage/plugin-user-settings@0.7.11

### Patch Changes

- 18c8dee6f5: Added experimental support for declarative integration via the `/alpha` subpath.
- d1b637d005: Fixed a bug where the theme icons would not be colored according to their active state.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3
  - @backstage/types@1.1.1

## @backstage/plugin-user-settings-backend@0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/types@1.1.1

## @backstage/plugin-vault@0.1.20

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## @backstage/plugin-vault-backend@0.3.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1

## @backstage/plugin-xcmetrics@0.2.44

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.3

## example-app@0.2.88

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.2.0
  - @backstage/plugin-pagerduty@0.6.6
  - @backstage/plugin-org@0.6.15
  - @backstage/plugin-code-coverage@0.2.18
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/plugin-catalog@1.14.0
  - @backstage/cli@0.23.0
  - @backstage/core-app-api@1.11.0
  - @backstage/plugin-techdocs@1.8.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-home@0.5.9
  - @backstage/plugin-newrelic@0.3.41
  - @backstage/plugin-user-settings@0.7.11
  - @backstage/plugin-scaffolder@1.15.1
  - @backstage/core-components@0.13.6
  - @backstage/plugin-entity-feedback@0.2.8
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-tech-radar@0.6.9
  - @backstage/plugin-adr@0.6.8
  - @backstage/app-defaults@1.4.4
  - @backstage/plugin-graphiql@0.2.55
  - @backstage/plugin-search@1.4.1
  - @backstage/plugin-jenkins@0.9.0
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-api-docs@0.9.12
  - @backstage/plugin-kubernetes@0.11.0
  - @backstage/plugin-airbrake@0.3.25
  - @backstage/plugin-apache-airflow@0.2.16
  - @backstage/plugin-azure-devops@0.3.7
  - @backstage/plugin-azure-sites@0.1.14
  - @backstage/plugin-badges@0.2.49
  - @backstage/plugin-catalog-graph@0.2.37
  - @backstage/plugin-catalog-import@0.10.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.4
  - @backstage/plugin-circleci@0.3.25
  - @backstage/plugin-cloudbuild@0.3.25
  - @backstage/plugin-cost-insights@0.12.14
  - @backstage/plugin-devtools@0.1.5
  - @backstage/plugin-dynatrace@7.0.5
  - @backstage/plugin-explore@0.4.11
  - @backstage/plugin-gcalendar@0.3.19
  - @backstage/plugin-gcp-projects@0.3.42
  - @backstage/plugin-github-actions@0.6.6
  - @backstage/plugin-gocd@0.1.31
  - @backstage/plugin-kafka@0.3.25
  - @backstage/plugin-kubernetes-cluster@0.0.1
  - @backstage/plugin-lighthouse@0.4.10
  - @backstage/plugin-linguist@0.1.10
  - @backstage/plugin-microsoft-calendar@0.1.8
  - @backstage/plugin-newrelic-dashboard@0.3.0
  - @backstage/plugin-nomad@0.1.6
  - @backstage/plugin-octopus-deploy@0.2.7
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/plugin-playlist@0.1.17
  - @backstage/plugin-puppetdb@0.1.8
  - @backstage/plugin-rollbar@0.4.25
  - @backstage/plugin-scaffolder-react@1.5.6
  - @backstage/plugin-sentry@0.5.10
  - @backstage/plugin-shortcuts@0.3.15
  - @backstage/plugin-stack-overflow@0.1.21
  - @backstage/plugin-stackstorm@0.1.7
  - @backstage/plugin-tech-insights@0.3.17
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.1
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/plugin-todo@0.2.28
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.7

## example-app-next@0.0.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.2.0
  - @backstage/plugin-pagerduty@0.6.6
  - @backstage/plugin-org@0.6.15
  - @backstage/plugin-code-coverage@0.2.18
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/plugin-catalog@1.14.0
  - @backstage/cli@0.23.0
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-app-api@1.11.0
  - @backstage/plugin-techdocs@1.8.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/plugin-home@0.5.9
  - @backstage/plugin-newrelic@0.3.41
  - @backstage/plugin-user-settings@0.7.11
  - @backstage/plugin-scaffolder@1.15.1
  - @backstage/core-components@0.13.6
  - @backstage/plugin-entity-feedback@0.2.8
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-tech-radar@0.6.9
  - @backstage/plugin-adr@0.6.8
  - @backstage/app-defaults@1.4.4
  - @backstage/plugin-graphiql@0.2.55
  - @backstage/plugin-search@1.4.1
  - @backstage/plugin-jenkins@0.9.0
  - @backstage/plugin-search-react@1.7.1
  - @backstage/plugin-api-docs@0.9.12
  - @backstage/plugin-kubernetes@0.11.0
  - @backstage/plugin-airbrake@0.3.25
  - @backstage/plugin-apache-airflow@0.2.16
  - @backstage/plugin-azure-devops@0.3.7
  - @backstage/plugin-azure-sites@0.1.14
  - @backstage/plugin-badges@0.2.49
  - @backstage/plugin-catalog-graph@0.2.37
  - @backstage/plugin-catalog-import@0.10.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.4
  - @backstage/plugin-circleci@0.3.25
  - @backstage/plugin-cloudbuild@0.3.25
  - @backstage/plugin-cost-insights@0.12.14
  - @backstage/plugin-devtools@0.1.5
  - @backstage/plugin-dynatrace@7.0.5
  - @backstage/plugin-explore@0.4.11
  - @backstage/plugin-gcalendar@0.3.19
  - @backstage/plugin-gcp-projects@0.3.42
  - @backstage/plugin-github-actions@0.6.6
  - @backstage/plugin-gocd@0.1.31
  - @backstage/plugin-kafka@0.3.25
  - @backstage/plugin-lighthouse@0.4.10
  - @backstage/plugin-linguist@0.1.10
  - @backstage/plugin-microsoft-calendar@0.1.8
  - @backstage/plugin-newrelic-dashboard@0.3.0
  - @backstage/plugin-octopus-deploy@0.2.7
  - @backstage/plugin-permission-react@0.4.16
  - @backstage/plugin-playlist@0.1.17
  - @backstage/plugin-puppetdb@0.1.8
  - @backstage/plugin-rollbar@0.4.25
  - @backstage/plugin-scaffolder-react@1.5.6
  - @backstage/plugin-sentry@0.5.10
  - @backstage/plugin-shortcuts@0.3.15
  - @backstage/plugin-stack-overflow@0.1.21
  - @backstage/plugin-stackstorm@0.1.7
  - @backstage/plugin-tech-insights@0.3.17
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.1
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/plugin-todo@0.2.28
  - @backstage/theme@0.4.3
  - app-next-example-plugin@0.0.2
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.17
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.7

## app-next-example-plugin@0.0.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-components@0.13.6

## example-backend@0.2.88

### Patch Changes

- Updated dependencies
  - @backstage/plugin-nomad-backend@0.1.8
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-scaffolder-backend@1.18.0
  - @backstage/plugin-search-backend-module-elasticsearch@1.3.9
  - @backstage/integration@1.7.1
  - @backstage/plugin-playlist-backend@0.3.10
  - @backstage/plugin-techdocs-backend@1.8.0
  - @backstage/plugin-auth-backend@0.19.3
  - @backstage/plugin-rollbar-backend@0.1.51
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-catalog-node@1.4.7
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/plugin-graphql-backend@0.2.0
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-badges-backend@0.3.3
  - @backstage/plugin-tech-insights-backend@0.5.20
  - @backstage/plugin-kubernetes-backend@0.13.0
  - @backstage/plugin-jenkins-backend@0.3.0
  - @backstage/plugin-code-coverage-backend@0.2.20
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.23
  - @backstage/plugin-search-backend@1.4.6
  - example-app@0.2.88
  - @backstage/plugin-lighthouse-backend@0.3.3
  - @backstage/plugin-linguist-backend@0.5.3
  - @backstage/plugin-search-backend-module-catalog@0.1.10
  - @backstage/plugin-search-backend-module-explore@0.1.10
  - @backstage/plugin-search-backend-module-techdocs@0.1.10
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/plugin-tech-insights-node@0.4.12
  - @backstage/plugin-adr-backend@0.4.3
  - @backstage/plugin-app-backend@0.3.54
  - @backstage/plugin-azure-devops-backend@0.4.3
  - @backstage/plugin-azure-sites-backend@0.1.16
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3
  - @backstage/plugin-devtools-backend@0.2.3
  - @backstage/plugin-entity-feedback-backend@0.2.3
  - @backstage/plugin-events-backend@0.2.15
  - @backstage/plugin-explore-backend@0.0.16
  - @backstage/plugin-kafka-backend@0.3.3
  - @backstage/plugin-permission-backend@0.5.29
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-proxy-backend@0.4.3
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.7
  - @backstage/plugin-search-backend-module-pg@0.5.15
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.38
  - @backstage/plugin-todo-backend@0.3.4
  - @backstage/catalog-client@1.4.5
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.3
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## example-backend-next@0.0.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-nomad-backend@0.1.8
  - @backstage/backend-tasks@0.5.11
  - @backstage/plugin-sonarqube-backend@0.2.8
  - @backstage/plugin-scaffolder-backend@1.18.0
  - @backstage/plugin-playlist-backend@0.3.10
  - @backstage/plugin-techdocs-backend@1.8.0
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/plugin-badges-backend@0.3.3
  - @backstage/plugin-kubernetes-backend@0.13.0
  - @backstage/plugin-jenkins-backend@0.3.0
  - @backstage/plugin-search-backend@1.4.6
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-lighthouse-backend@0.3.3
  - @backstage/plugin-linguist-backend@0.5.3
  - @backstage/plugin-search-backend-module-catalog@0.1.10
  - @backstage/plugin-search-backend-module-explore@0.1.10
  - @backstage/plugin-search-backend-module-techdocs@0.1.10
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/backend-defaults@0.2.6
  - @backstage/plugin-adr-backend@0.4.3
  - @backstage/plugin-app-backend@0.3.54
  - @backstage/plugin-azure-devops-backend@0.4.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.3
  - @backstage/plugin-devtools-backend@0.2.3
  - @backstage/plugin-entity-feedback-backend@0.2.3
  - @backstage/plugin-permission-backend@0.5.29
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.1.3
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-proxy-backend@0.4.3
  - @backstage/plugin-todo-backend@0.3.4
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.3
  - @backstage/plugin-permission-common@0.7.9

## @backstage/backend-plugin-manager@0.0.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-catalog-backend@1.14.0
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/plugin-search-backend-node@1.2.10
  - @backstage/plugin-events-backend@0.2.15
  - @backstage/plugin-permission-node@0.7.17
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/cli-node@0.1.5
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.15
  - @backstage/plugin-permission-common@0.7.9
  - @backstage/plugin-search-common@1.2.7

## e2e-test@0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.6
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13

## techdocs-cli-embedded-app@0.2.87

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.14.0
  - @backstage/cli@0.23.0
  - @backstage/test-utils@1.4.4
  - @backstage/core-app-api@1.11.0
  - @backstage/plugin-techdocs@1.8.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/integration-react@1.1.20
  - @backstage/catalog-model@1.4.3
  - @backstage/app-defaults@1.4.4
  - @backstage/plugin-techdocs-react@1.1.12
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1

## @internal/plugin-todo-list@1.0.18

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/theme@0.4.3

## @internal/plugin-todo-list-backend@1.0.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## @internal/plugin-todo-list-common@1.0.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.9
