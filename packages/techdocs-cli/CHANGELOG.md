# @techdocs/cli

## 1.1.2

### Patch Changes

- f96e98f4cd: Updated dependency `cypress` to `^10.0.0`.
- bff65e6958: Updated sidebar-related logic to use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()` from `@backstage/core-components`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-techdocs-node@1.1.2
  - @backstage/catalog-model@1.0.3

## 1.1.2-next.2

### Patch Changes

- f96e98f4cd: Updated dependency `cypress` to `^10.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-techdocs-node@1.1.2-next.2

## 1.1.2-next.1

### Patch Changes

- bff65e6958: Updated sidebar-related logic to use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()` from `@backstage/core-components`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.1

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-techdocs-node@1.1.2-next.0

## 1.1.1

### Patch Changes

- 344ea56acc: Bump `commander` to version 9.1.0
- 52fddad92d: The TechDocs CLI's embedded app now imports all API refs from the `@backstage/plugin-techdocs-react` package.
- c14e78a367: Update `techdocs-cli serve`'s `proxyEndpoint` to match the base URL of the embedded techdocs app.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/cli-common@0.1.9
  - @backstage/config@1.0.1
  - @backstage/plugin-techdocs-node@1.1.1
  - @backstage/catalog-model@1.0.2

## 1.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/cli-common@0.1.9-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.1

## 1.1.1-next.1

### Patch Changes

- 52fddad92d: The TechDocs CLI's embedded app now imports all API refs from the `@backstage/plugin-techdocs-react` package.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1

## 1.1.1-next.0

### Patch Changes

- 344ea56acc: Bump `commander` to version 9.1.0
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-techdocs-node@1.1.1-next.0

## 1.1.0

### Minor Changes

- 733187987b: Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

  **WARNING**: If you notice 404s in TechDocs after updating, check to make sure that all markdown files referenced in your `mkdocs.yml`s' `nav` sections exist. The following flag may be passed to the `generate` command to temporarily revert to the broken behavior.

  ```sh
  techdocs-cli generate --legacyCopyReadmeMdToIndexMd
  ```

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- eb470ea54c: Adds a new flag to override the entrypoint when using a custom docker image. It could be used to reuse existing images with different entrypoints.
- Updated dependencies
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-techdocs-node@1.1.0

## 1.1.0-next.1

### Minor Changes

- bcf1a2496c: BREAKING: The default Techdocs behavior will no longer attempt to copy `docs/README.md` or `README.md` to `docs/index.md` (if not found). To retain this behavior in your instance, you can set the following config in your `app-config.yaml`:

  ```yaml
  techdocs:
    generator:
      mkdocs:
        legacyCopyReadmeMdToIndexMd: true
  ```

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- eb470ea54c: Adds a new flag to override the entrypoint when using a custom docker image. It could be used to reuse existing images with different entrypoints.
- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/plugin-techdocs-node@1.1.0-next.2

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-techdocs-node@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/plugin-techdocs-node@1.0.0

## 0.8.17

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-techdocs-node@0.11.12
  - @backstage/catalog-model@0.13.0

## 0.8.17-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 91bf1e6c1a: Use `@backstage/plugin-techdocs-node` package instead of `@backstage/techdocs-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-techdocs-node@0.11.12-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.8.16

### Patch Changes

- 853efd42bd: Bump `@backstage/techdocs-common` to `0.11.10` to use `spotify/techdocs:v0.3.7` which upgrades `mkdocs-theme` as a dependency of `mkdocs-techdocs-core`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/techdocs-common@0.11.11

## 0.8.15

### Patch Changes

- ed78516480: chore(deps-dev): bump `cypress` from 7.3.0 to 9.5.0
- 209fd128e6: Updated usage of `github:` location types in docs to use `url:` instead.
- 61ff215e08: - Adds `cypress` and `cypress-plugin-snapshots` as dependencies for integration and visual regression tests.
  - Updates README documentation with instructions for how to run tests.
  - Clarifies output text for prepack script.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/techdocs-common@0.11.10

## 0.8.14

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-model@0.10.0
  - @backstage/cli-common@0.1.7
  - @backstage/config@0.1.14
  - @backstage/techdocs-common@0.11.8

## 0.8.13

### Patch Changes

- b70c186194: Updated the HTTP server to allow for simplification of the development of the CLI itself.
- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/techdocs-common@0.11.7

## 0.8.13-next.0

### Patch Changes

- b70c186194: Updated the HTTP server to allow for simplification of the development of the CLI itself.
- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/techdocs-common@0.11.7-next.0

## 0.8.12

### Patch Changes

- 14472509a3: Use a local file dependency for techdocs-cli-embedded-app, to ensure that it's always pulled out of the workspace
- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/techdocs-common@0.11.6

## 0.8.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/techdocs-common@0.11.6-next.0

## 0.8.12-next.0

### Patch Changes

- 14472509a3: Use a local file dependency for techdocs-cli-embedded-app, to ensure that it's always pulled out of the workspace

## 0.8.11

### Patch Changes

- 10086f5873: Bumped `react-dev-utils` from `^12.0.0-next.47` to `^12.0.0-next.60`.
- Updated dependencies
  - @backstage/techdocs-common@0.11.5
  - @backstage/backend-common@0.10.5

## 0.8.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/techdocs-common@0.11.4-next.0
  - @backstage/catalog-model@0.9.10-next.0

## 0.8.10

### Patch Changes

- 8fbc988bfc: remove internal and inline CSS from index.html
- Updated dependencies
  - @backstage/techdocs-common@0.11.2
  - @backstage/backend-common@0.10.1

## 0.8.9

### Patch Changes

- 5fdc8df0e8: The `index.html` template was updated to use the new `config` global.
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/techdocs-common@0.11.1

## 0.8.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/techdocs-common@0.11.0

## 0.8.7

### Patch Changes

- e7230ef814: Bump react-dev-utils to v12
- Updated dependencies
  - @backstage/backend-common@0.9.12

## 0.8.6

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- 1578ad341b: Add support for specifying bucketRootPath for AWS and GCS publishers
- f2694e3750: Adds ability to use encrypted S3 buckets by utilizing the SSE option in the AWS SDK
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/techdocs-common@0.10.7

## 0.8.5

### Patch Changes

- Reunified the [techdocs-cli](https://github.com/backstage/techdocs-cli) monorepo code back into the main [backstage](https://github.com/backstage/backstage) repo

  See [7288](https://github.com/backstage/backstage/issues/7288)). The changes include some internal refactoring that do not affect functionality beyond the local development setup.

## 0.8.4

### Patch Changes

- 8333394: The [change](https://github.com/backstage/techdocs-cli/commit/b25014cec313d46ce1c9b4f324cc09047a00fc1f) updated the `@backstage/techdocs-common` from version `0.9.0` to `0.10.2` and one of the intermediate versions, the [0.10.0](https://github.com/backstage/backstage/blob/cac4afb95fdbd130a66e53a1b0430a1e62787a7f/packages/techdocs-common/CHANGELOG.md#patch-changes-2), introduced the use of search in context that requires an implementation for the Search API.

  Created a custom techdocs page to disable search in the Reader component, preventing it from using the Search API, as we don't want to provide search in preview mode.

## 0.8.3

### Patch Changes

- edbb988: Upgrades the techdocs common page to the latest version 0.10.2.

  See [@backstage/techdocs-common changelog](https://github.com/backstage/backstage/blob/cac4afb95fdbd130a66e53a1b0430a1e62787a7f/packages/techdocs-common/CHANGELOG.md#L3).

- db4ebfc: Add an `etag` flag to the `generate` command that is stored in the `techdocs_metadata.json` file.

## 0.8.2

### Patch Changes

- 8fc7384: Allow to execute techdocs-cli serve using docker techdocs-container on Windows

## 0.8.1

### Patch Changes

- 0187424: Separate build and publish release steps

## 0.8.0

### Minor Changes

- c6f437a: OpenStack Swift configuration changed due to OSS SDK Client change in @backstage/techdocs-common, it was a breaking change.
  PR Reference: https://github.com/backstage/backstage/pull/6839

### Patch Changes

- 05f0409: Merge Jobs for Release Pull Requests and Package Publishes

## 0.7.0

### Minor Changes

- 9d1f8d8: The `techdocs-cli publish` command will now publish TechDocs content to remote
  storage using the lowercase'd entity triplet as the storage path. This is in
  line with the beta release of the TechDocs plugin (`v0.11.0`).

  If you have been running `techdocs-cli` prior to this version, you will need to
  follow this [migration guide](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

## 0.6.2

### Patch Changes

- f1bcf1a: Changelog (from v0.6.1 to v0.6.2)

  #### :bug: Bug Fix

  - `techdocs-cli`
    - [#105](https://github.com/backstage/techdocs-cli/pull/105) Add azureAccountKey parameter back to the publish command ([@emmaindal](https://github.com/emmaindal))

  #### :house: Internal

  - `techdocs-cli-embedded-app`
    - [#122](https://github.com/backstage/techdocs-cli/pull/122) chore(deps-dev): bump @types/node from 12.20.20 to 16.7.1 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#120](https://github.com/backstage/techdocs-cli/pull/120) chore(deps-dev): bump @types/react-dom from 16.9.14 to 17.0.9 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#119](https://github.com/backstage/techdocs-cli/pull/119) chore(deps-dev): bump @testing-library/user-event from 12.8.3 to 13.2.1 in /packages/techdocs-cli-embedded-app ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#118](https://github.com/backstage/techdocs-cli/pull/118) chore(deps-dev): bump @testing-library/react from 10.4.9 to 12.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
  - Other
    - [#117](https://github.com/backstage/techdocs-cli/pull/117) chore(deps): bump @backstage/plugin-catalog from 0.6.11 to 0.6.12 ([@dependabot[bot]](https://github.com/apps/dependabot))
    - [#124](https://github.com/backstage/techdocs-cli/pull/124) Update release process docs ([@emmaindal](https://github.com/emmaindal))
    - [#116](https://github.com/backstage/techdocs-cli/pull/116) ignore dependabot branches for project board workflow ([@emmaindal](https://github.com/emmaindal))
    - [#106](https://github.com/backstage/techdocs-cli/pull/106) Configure dependabot for all packages ([@emmaindal](https://github.com/emmaindal))
    - [#102](https://github.com/backstage/techdocs-cli/pull/102) readme: add information about running techdocs-common locally ([@vcapretz](https://github.com/vcapretz))
    - [#103](https://github.com/backstage/techdocs-cli/pull/103) Introduce changesets and improve the publish workflow ([@minkimcello](https://github.com/minkimcello))
    - [#101](https://github.com/backstage/techdocs-cli/pull/101) update yarn lockfile to get rid of old version of node-forge ([@emmaindal](https://github.com/emmaindal))

  #### Committers: 3

  Thank you for contributing ❤️

  - `Emma Indal` ([@emmaindal](https://github.com/emmaindal))
  - `Min Kim` ([@minkimcello](https://github.com/minkimcello))
  - `Vitor Capretz` ([@vcapretz](https://github.com/vcapretz))
