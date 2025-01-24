# @backstage/repo-tools

## 0.12.2-next.0

### Patch Changes

- 98ddf05: The `api-reports` command is now also able to generate SQL reports, enabled by the `--sql-reports` flag.
- cb76663: Internal refactor to support native ESM.
- ecd01a9: Internal refactor of API report generation.
- Updated dependencies
  - @backstage/cli-node@0.2.13-next.0
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7

## 0.12.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.5
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.12
  - @backstage/errors@1.2.7

## 0.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/cli-node@0.2.12-next.0
  - @backstage/config-loader@1.9.5-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/cli-common@0.1.15

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.5-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-model@1.7.2
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.11
  - @backstage/errors@1.2.6

## 0.12.0

### Minor Changes

- c1eccd6: Fix invalid path and malformed flags bugs in api-reports.ts

### Patch Changes

- 860e3b5: Generated OpenAPI clients now support paths with tags.
- 5f04976: Fixed a bug that caused missing code in published packages.
- 00058d0: The `generate-patch` command will now add a single resolution entry for all versions of the patched package, rather than separate entries for each version query.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/cli-node@0.2.11
  - @backstage/config-loader@1.9.3
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/cli-common@0.1.15

## 0.12.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/cli-node@0.2.11-next.1
  - @backstage/config-loader@1.9.3-next.1
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/cli-common@0.1.15

## 0.12.0-next.1

### Patch Changes

- 860e3b5: Generated OpenAPI clients now support paths with tags.
- 00058d0: The `generate-patch` command will now add a single resolution entry for all versions of the patched package, rather than separate entries for each version query.
- Updated dependencies
  - @backstage/config-loader@1.9.3-next.0
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.11-next.0
  - @backstage/errors@1.2.5

## 0.12.0-next.0

### Minor Changes

- c1eccd6: Fix invalid path and malformed flags bugs in api-reports.ts

### Patch Changes

- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/cli-node@0.2.11-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/cli-common@0.1.15
  - @backstage/config-loader@1.9.2
  - @backstage/errors@1.2.5

## 0.11.0

### Minor Changes

- 1440232: `backstage-repo-tools package schema openapi generate --server` now generates complete TS interfaces for all request/response objects in your OpenAPI schema. This fixes an edge case around recursive schemas and standardizes both the generated client and server to have similar generated types.
- 47fdbb4: Adds a `--watch` mode to the `schema openapi generate` command for a better local schema writing experience.

### Patch Changes

- 95401a8: The `generate-patch` command now properly includes newly created files in the patch.
- 23f1da2: Updated dependency `ts-morph` to `^24.0.0`.
- 3f1fb21: The `generate-patch` command will now fall back to always adding a `resolutions` entry, even if no matching descriptors are found.
- dde85ee: Added a new `generate-patch` command that can be used to generate patches for current changes in a source workspace to be installed it a target workspace.
- 702f41d: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/config-loader@1.9.2
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/cli-common@0.1.15
  - @backstage/catalog-model@1.7.1
  - @backstage/cli-node@0.2.10
  - @backstage/errors@1.2.5

## 0.11.0-next.3

### Patch Changes

- 95401a8: The `generate-patch` command now properly includes newly created files in the patch.
- 23f1da2: Updated dependency `ts-morph` to `^24.0.0`.
- 3f1fb21: The `generate-patch` command will now fall back to always adding a `resolutions` entry, even if no matching descriptors are found.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4

## 0.11.0-next.2

### Minor Changes

- 1440232: `backstage-repo-tools package schema openapi generate --server` now generates complete TS interfaces for all request/response objects in your OpenAPI schema. This fixes an edge case around recursive schemas and standardizes both the generated client and server to have similar generated types.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4

## 0.11.0-next.1

### Patch Changes

- dde85ee: Added a new `generate-patch` command that can be used to generate patches for current changes in a source workspace to be installed it a target workspace.
- 702f41d: Bumped dev dependencies `@types/node`
- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4

## 0.11.0-next.0

### Minor Changes

- 47fdbb4: Adds a `--watch` mode to the `schema openapi generate` command for a better local schema writing experience.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.9
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## 0.10.0

### Minor Changes

- 30c2be9: Update @microsoft/api-extractor and use their api report resolution.
  Change api report format from `api-report.md` to `report.api.md`
- 8eb3033: Adds a new command `backstage-repo-tools peer-deps` for validating your usage of peer dependencies in your plugins. It currently supports react related peer dependencies. It also has a `--fix` mode for quickly fixing any issues that it finds.

### Patch Changes

- 1f6706f: Properly log instructions when APIs do not match
- 35e735b: Fix issues with warnings in API reports not being checked or reported.

  Due to the recent version bump of API Extractor you may now see a lot of `ae-undocumented` warnings,
  these can be ignored using the `-o` option, for example, `backstage-repo-tools api-reports -o ae-undocumented,ae-wrong-input-file-type`.

- 248793e: Updated dependency `@useoptic/optic` to `^1.0.0`.
- Updated dependencies
  - @backstage/cli-node@0.2.9
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## 0.10.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## 0.10.0-next.1

### Minor Changes

- 8eb3033: Adds a new command `backstage-repo-tools peer-deps` for validating your usage of peer dependencies in your plugins. It currently supports react related peer dependencies. It also has a `--fix` mode for quickly fixing any issues that it finds.

### Patch Changes

- 1f6706f: Properly log instructions when APIs do not match
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.8
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## 0.10.0-next.0

### Minor Changes

- 30c2be9: Update @microsoft/api-extractor and use their api report resolution.
  Change api report format from `api-report.md` to `report.api.md`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.8
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## 0.9.7

### Patch Changes

- 5c4aa2f: Updated dependency `@useoptic/openapi-utilities` to `^0.55.0`.
- 1a8837e: Avoid generating API reports for packages with `backstage.inline` set.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-node@0.2.8
  - @backstage/config-loader@1.9.1
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4

## 0.9.7-next.2

### Patch Changes

- 1a8837e: Avoid generating API reports for packages with `backstage.inline` set.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/cli-node@0.2.8-next.0
  - @backstage/config-loader@1.9.1-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4

## 0.9.7-next.1

### Patch Changes

- 5c4aa2f: Updated dependency `@useoptic/openapi-utilities` to `^0.55.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4

## 0.9.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4

## 0.9.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/config-loader@1.9.0
  - @backstage/catalog-model@1.6.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/errors@1.2.4

## 0.9.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/errors@1.2.4

## 0.9.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/cli-node@0.2.7
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4

## 0.9.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.0-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/errors@1.2.4

## 0.9.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.8.2-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/errors@1.2.4

## 0.9.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/cli-node@0.2.7
  - @backstage/config-loader@1.8.1
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4

## 0.9.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.6
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4

## 0.9.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.6
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4

## 0.9.1

### Patch Changes

- 8721a02: Add `--client-additional-properties` option to `openapi generate` command
- Updated dependencies
  - @backstage/cli-node@0.2.6
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.8.1
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.9.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.6-next.2
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/config-loader@1.8.1-next.0
  - @backstage/catalog-model@1.5.0
  - @backstage/errors@1.2.4

## 0.9.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/config-loader@1.8.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4

## 0.9.1-next.1

### Patch Changes

- 8721a02: Add `--client-additional-properties` option to `openapi generate` command
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/cli-node@0.2.6-next.0
  - @backstage/config-loader@1.8.0

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.6-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/catalog-model@1.5.0
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4

## 0.9.0

### Minor Changes

- 683870a: Adds 2 new commands `repo schema openapi diff` and `package schema openapi diff`. `repo schema openapi diff` is intended to power a new breaking changes check on pull requests and the package level command allows plugin developers to quickly see new API breaking changes. They're intended to be used in complement with the existing `repo schema openapi verify` command to validate your OpenAPI spec against a variety of things.

### Patch Changes

- 9ae9bb2: Update the paths logic in the api reports command to support complex subpaths
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-plugin-api@0.6.18

## 0.9.0-next.2

### Minor Changes

- 683870a: Adds 2 new commands `repo schema openapi diff` and `package schema openapi diff`. `repo schema openapi diff` is intended to power a new breaking changes check on pull requests and the package level command allows plugin developers to quickly see new API breaking changes. They're intended to be used in complement with the existing `repo schema openapi verify` command to validate your OpenAPI spec against a variety of things.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2

## 0.8.1-next.1

### Patch Changes

- 9ae9bb2: Update the paths logic in the api reports command to support complex subpaths
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/cli-node@0.2.5
  - @backstage/config-loader@1.8.0

## 0.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.5
  - @backstage/config-loader@1.8.0
  - @backstage/errors@1.2.4

## 0.8.0

### Minor Changes

- 2bd291e: Adds a lint rule to `repo schema openapi lint` to enforce `allowReserved` for all parameters. To fix this, simply add `allowReserved: true` to your parameters, like so

  ```diff
  /v1/todos:
      get:
        operationId: ListTodos
        # ...
        parameters:
          - name: entity
            in: query
  +         allowReserved: true
            schema:
              type: string
  ```

- cfdc5e7: Adds two new commands, `repo schema openapi fuzz` and `package schema openapi fuzz` for fuzzing your plugins documented with OpenAPI. This can help find bugs in your application code through the use of auto-generated schema-compliant inputs. For more information on the underlying library this leverages, take a look at [the docs](https://schemathesis.readthedocs.io/en/stable/index.html).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/config-loader@1.8.0
  - @backstage/cli-node@0.2.5
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4

## 0.8.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/errors@1.2.4

## 0.8.0-next.0

### Minor Changes

- cfdc5e7: Adds two new commands, `repo schema openapi fuzz` and `package schema openapi fuzz` for fuzzing your plugins documented with OpenAPI. This can help find bugs in your application code through the use of auto-generated schema-compliant inputs. For more information on the underlying library this leverages, take a look at [the docs](https://schemathesis.readthedocs.io/en/stable/index.html).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/errors@1.2.4

## 0.7.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/errors@1.2.4

## 0.7.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4
  - @backstage/errors@1.2.4

## 0.7.0

### Minor Changes

- 8bfcc50: Fix knip-report command to send 1 exit status in case of fail

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9
- 1bd4596: Removed the `ts-node` dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/errors@1.2.4
  - @backstage/cli-node@0.2.4
  - @backstage/catalog-model@1.4.5
  - @backstage/cli-common@0.1.13

## 0.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0

## 0.7.0-next.1

### Minor Changes

- 8bfcc50: Fix knip-report command to send 1 exit status in case of fail

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0

## 0.6.3-next.0

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13

## 0.6.0

### Minor Changes

- 04907c3: Updates the OpenAPI client template to support the new format for identifying plugin ID. You should now use `info.title` like so,

  ```diff
  info:
  +    title: yourPluginId
  -    title: @internal/plugin-*-backend

  servers:
    - /
  - - yourPluginId
  ```

- b10c603: Add support for `oneOf` in client generated by `schema openapi generate-client`.
- 4c62935: **BREAKING**: The `schema openapi *` commands are now renamed into `package schema openapi *` and `repo schema openapi *`. The aim is to make it more clear what the command is operating on, the entire repo or just a single package.

  The following commands now live under the `package` namespace,

  - `schema openapi generate` is now `package schema openapi generate --server`
  - `schema openapi generate-client` is now `package schema openapi generate --client-package`
  - `schema openapi init` is now `package schema openapi init`

  And these commands live under the new `repo` namespace,

  - `schema openapi lint` is now `repo schema openapi lint`
  - `schema openapi test` is now `repo schema openapi test`
  - `schema openapi verify` is now `repo schema openapi verify`

  The `package schema openapi generate` now supports defining both `--server` and `--client-package` to generate both at once.This update also reworks the `--client-package` flag to accept only an output directory as the input directory can now be inferred.

### Patch Changes

- aa91cd6: Resolved an issue with generate-catalog-info where it was replacing upper case characters with -.
- 60a68f1: Introduced `knip` to the `knip-reports` command, which generates a `knip-report.md` file for your packages with dependency warnings, if any.
- ec16093: Add an internal limiter on concurrency when launching processes
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- 6ba64c4: Updated dependency `commander` to `^12.0.0`.
- c04c42b: Fixes an issue where comments would be duplicated in the template. Also, removes a header with the title and version of the OpenAPI spec from generated code.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/cli-node@0.2.3
  - @backstage/catalog-model@1.4.4
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.6.0-next.3

### Patch Changes

- 60a68f1: Introduced `knip` to the `knip-reports` command, which generates a `knip-report.md` file for your packages with dependency warnings, if any.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/cli-node@0.2.3-next.0
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.6.0-next.2

### Minor Changes

- 4c62935: **BREAKING**: The `schema openapi *` commands are now renamed into `package schema openapi *` and `repo schema openapi *`. The aim is to make it more clear what the command is operating on, the entire repo or just a single package.

  The following commands now live under the `package` namespace,

  - `schema openapi generate` is now `package schema openapi generate --server`
  - `schema openapi generate-client` is now `package schema openapi generate --client-package`
  - `schema openapi init` is now `package schema openapi init`

  And these commands live under the new `repo` namespace,

  - `schema openapi lint` is now `repo schema openapi lint`
  - `schema openapi test` is now `repo schema openapi test`
  - `schema openapi verify` is now `repo schema openapi verify`

  The `package schema openapi generate` now supports defining both `--server` and `--client-package` to generate both at once.This update also reworks the `--client-package` flag to accept only an output directory as the input directory can now be inferred.

### Patch Changes

- aa91cd6: Resolved an issue with generate-catalog-info where it was replacing upper case characters with -.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.2
  - @backstage/errors@1.2.3

## 0.6.0-next.1

### Patch Changes

- c04c42b: Fixes an issue where comments would be duplicated in the template. Also, removes a header with the title and version of the OpenAPI spec from generated code.
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.2
  - @backstage/errors@1.2.3

## 0.6.0-next.0

### Minor Changes

- 04907c3: Updates the OpenAPI client template to support the new format for identifying plugin ID. You should now use `info.title` like so,

  ```diff
  info:
  +    title: yourPluginId
  -    title: @internal/plugin-*-backend

  servers:
    - /
  - - yourPluginId
  ```

- b10c603: Add support for `oneOf` in client generated by `schema openapi generate-client`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/cli-node@0.2.2
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.5.2

### Patch Changes

- 883782e: Updated the OpenAPI template to export the `TypedResponse` interface so that client code can leverage it
- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/cli-node@0.2.2
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/cli-node@0.2.2-next.0

## 0.5.2-next.1

### Patch Changes

- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/cli-node@0.2.2-next.0
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.5.2-next.0

### Patch Changes

- 883782e: Updated the OpenAPI template to export the `TypedResponse` interface so that client code can leverage it
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.1
  - @backstage/errors@1.2.3

## 0.5.0

### Minor Changes

- aea8f8d: **BREAKING**: API Reports generated for sub-path exports now place the name as a suffix rather than prefix, for example `api-report-alpha.md` instead of `alpha-api-report.md`. When upgrading to this version you'll need to re-create any such API reports and delete the old ones.
- 3834067: Adds a new command `schema openapi generate-client` that creates a Typescript client with Backstage flavor, including the discovery API and fetch API. This command doesn't currently generate a complete client and needs to be wrapped or exported manually by a separate Backstage plugin. See `@backstage/catalog-client/src/generated` for example output.

### Patch Changes

- f909e9d: Includes templates in @backstage/repo-tools package and use them in the CLI
- da3c4db: Updates the `schema openapi generate-client` command to export all generated types from the generated directory.
- 7959f23: The `api-reports` command now checks for api report files that no longer apply.
  If it finds such files, it's treated basically the same as report errors do, and
  the check fails.

  For example, if you had an `api-report-alpha.md` but then removed the alpha
  export, the reports generator would now report that this file needs to be
  deleted.

- f49e237: Fixed a bug where `schema openapi init` created an invalid test command.
- f91be2c: Updated dependency `@stoplight/types` to `^14.0.0`.
- 45bfb20: Execute `openapi-generator-cli` from `@backstage/repo-tools` directory to force it to use our openapitools.json config file.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/cli-node@0.2.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/errors@1.2.3

## 0.5.0-next.1

### Patch Changes

- f909e9d: Includes templates in @backstage/repo-tools package and use them in the CLI
- da3c4db: Updates the `schema openapi generate-client` command to export all generated types from the generated directory.
- 7959f23: The `api-reports` command now checks for api report files that no longer apply.
  If it finds such files, it's treated basically the same as report errors do, and
  the check fails.

  For example, if you had an `api-report-alpha.md` but then removed the alpha
  export, the reports generator would now report that this file needs to be
  deleted.

- f49e237: Fixed a bug where `schema openapi init` created an invalid test command.
- f91be2c: Updated dependency `@stoplight/types` to `^14.0.0`.
- 45bfb20: Execute `openapi-generator-cli` from `@backstage/repo-tools` directory to force it to use our openapitools.json config file.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/errors@1.2.3

## 0.5.0-next.0

### Minor Changes

- aea8f8d329: **BREAKING**: API Reports generated for sub-path exports now place the name as a suffix rather than prefix, for example `api-report-alpha.md` instead of `alpha-api-report.md`. When upgrading to this version you'll need to re-create any such API reports and delete the old ones.
- 38340678c3: Adds a new command `schema openapi generate-client` that creates a Typescript client with Backstage flavor, including the discovery API and fetch API. This command doesn't currently generate a complete client and needs to be wrapped or exported manually by a separate Backstage plugin. See `@backstage/catalog-client/src/generated` for example output.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/errors@1.2.3

## 0.4.0

### Minor Changes

- 4e36abef14: Remove support for the deprecated `--experimental-type-build` option for `package build`.
- 6694b369a3: Adds a new command `schema openapi test` that performs runtime validation of your OpenAPI specs using your test data. Under the hood, we're using Optic to perform this check, really cool work by them!

  To use this new command, you will have to run `yarn add @useoptic/optic` in the root of your repo.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.4.0-next.0

### Minor Changes

- 4e36abef14: Remove support for the deprecated `--experimental-type-build` option for `package build`.
- 6694b369a3: Adds a new command `schema openapi test` that performs runtime validation of your OpenAPI specs using your test data. Under the hood, we're using Optic to perform this check, really cool work by them!

  To use this new command, you will have to run `yarn add @useoptic/optic` in the root of your repo.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## 0.3.5

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.1.5

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/cli-node@0.1.5-next.1

## 0.3.5-next.0

### Patch Changes

- de42eebaaf: Bumped dev dependencies `@types/node` and `mock-fs`.
- Updated dependencies
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/cli-node@0.1.5-next.0
  - @backstage/errors@1.2.2

## 0.3.4

### Patch Changes

- 0109d3f11159: The `generate-catalog-info` command now uses the first listed `CODEOWNER` as Component owner when initially
  creating the `catalog-info.yaml` file. It continues to allow any one listed `CODEOWNER` when updating
  entity metadata.
- 6f874cdb04eb: Fixed a bug with the `generate-catalog-info` command that could cause `metadata.description` values to be overwritten by `package.json` description values only because unrelated attributes were being changed.
- ec13d3e86028: Fixed a bug with the `generate-catalog-info` command that could cause the `--dry-run` flag to indicate changes to files when no changes would actually be made if the command were run without the flag.
- db60a16e0a54: Added a `--ci` flag to the `generate-catalog-info` command. This flag behaves similarly to the same flag on `api-reports`: if `catalog-info.yaml` files would have been added or modified, then the process exits with status code `1`, and instructions are printed.
- Updated dependencies
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.4

## 0.3.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.4-next.0

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1

## 0.3.4-next.1

### Patch Changes

- 6f874cdb04eb: Fixed a bug with the `generate-catalog-info` command that could cause `metadata.description` values to be overwritten by `package.json` description values only because unrelated attributes were being changed.
- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1

## 0.3.4-next.0

### Patch Changes

- 0109d3f11159: The `generate-catalog-info` command now uses the first listed `CODEOWNER` as Component owner when initially
  creating the `catalog-info.yaml` file. It continues to allow any one listed `CODEOWNER` when updating
  entity metadata.
- ec13d3e86028: Fixed a bug with the `generate-catalog-info` command that could cause the `--dry-run` flag to indicate changes to files when no changes would actually be made if the command were run without the flag.
- db60a16e0a54: Added a `--ci` flag to the `generate-catalog-info` command. This flag behaves similarly to the same flag on `api-reports`: if `catalog-info.yaml` files would have been added or modified, then the process exits with status code `1`, and instructions are printed.
- Updated dependencies
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.3
  - @backstage/errors@1.2.1

## 0.3.3

### Patch Changes

- 75702e85862a: Bumped `@microsoft/api-extractor` dependency to `^7.36.4`, and `@microsoft/api-documenter` to `^7.22.33`.
- 1f3337ebc707: Introducing a new, experimental command `backstage-repo-tools generate-catalog-info`, which can be used to create standardized `catalog-info.yaml` files for each Backstage package in a Backstage monorepo. It can also be used to automatically fix existing `catalog-info.yaml` files with the correct metadata (including `metadata.name`, `metadata.title`, and `metadata.description` introspected from the package's `package.json`, as well as `spec.owner` introspected from `CODEOWNERS`), e.g. in a post-commit hook.
- ebeb77586975: Update `schema openapi generate` command to now create a default router that can be imported and used directly.
- Updated dependencies
  - @backstage/cli-node@0.1.3
  - @backstage/catalog-model@1.4.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.1.3-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1

## 0.3.3-next.0

### Patch Changes

- ebeb77586975: Update `schema openapi generate` command to now create a default router that can be imported and used directly.
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.2
  - @backstage/errors@1.2.1

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/cli-node@0.1.2
  - @backstage/cli-common@0.1.12

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.1.2-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1-next.0

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.2-next.0

## 0.3.1

### Patch Changes

- ee411e7c2623: Adding a new command `schema openapi lint` to lint your OpenAPI specs and ensure consistent style across Backstage plugins.
- Updated dependencies
  - @backstage/errors@1.2.0
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/cli-node@0.1.1-next.0
  - @backstage/cli-common@0.1.12

## 0.3.0

### Minor Changes

- 799c33047ed: **BREAKING**: The OpenAPI commands are now found within the `schema openapi` sub-command. For example `yarn backstage-repo-tools schema:openapi:verify` is now `yarn backstage-repo-tools schema openapi verify`.
- 27956d78671: Generated OpenAPI files now have a `.generated.ts` file name and a warning header at the top, to highlight that they should not be edited by hand.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/cli-node@0.1.0
  - @backstage/errors@1.1.5

## 0.3.0-next.0

### Minor Changes

- 27956d78671: Generated OpenAPI files now have a `.generated.ts` file name and a warning header at the top, to highlight that they should not be edited by hand.

## 0.2.0

### Minor Changes

- a876e69b20e: Adding two new commands to support OpenAPI spec writing, `schema:openapi:generate` to generate the Typescript file that `@backstage/backend-openapi-utils` needs for typing and `schema:openapi:verify` to verify that this file exists and matches your `src/schema/openapi.yaml` file.

### Patch Changes

- f59041a3c07: Package paths provided to `api-reports` and OpenAPI commands will now match any path within the target package.
- f59041a3c07: Added `--include <patterns>` and `--exclude <patterns>` options for `api-reports` command that work based on package names.
- 9129ca8cabb: Log API report instructions when api-report is missing.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/cli-node@0.1.0
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5

## 0.2.0-next.2

### Minor Changes

- a876e69b20e: Adding two new commands to support OpenAPI spec writing, `schema:openapi:generate` to generate the Typescript file that `@backstage/backend-openapi-utils` needs for typing and `schema:openapi:verify` to verify that this file exists and matches your `src/schema/openapi.yaml` file.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5

## 0.1.4-next.1

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5

## 0.1.4-next.0

### Patch Changes

- 9129ca8cabb: Log API report instructions when api-report is missing.
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5

## 0.1.3

### Patch Changes

- 32a4a05838c: Tweaked type dependency check to trim wildcard type imports.
- 6ba8faf22ac: The API report generation process is now able to detect and generate reports for additional entry points declared in the package `"exports"` field.
- Updated dependencies
  - @backstage/errors@1.1.5
  - @backstage/cli-common@0.1.12

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/cli-common@0.1.12-next.0

## 0.1.3-next.0

### Patch Changes

- 32a4a05838: Tweaked type dependency check to trim wildcard type imports.
- 6ba8faf22a: The API report generation process is now able to detect and generate reports for additional entry points declared in the package `"exports"` field.
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.2

### Patch Changes

- ff63acf30a: Packages without a declared `backstage.role` are now ignored.
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.2-next.0

### Patch Changes

- ff63acf30a: Packages without a declared `backstage.role` are now ignored.
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.1

### Patch Changes

- c447a5221b: Use the project tsconfig in case of selection all packages
- 93cff3053e: Move some dependencies as `peerDependencies` because we need to always use same version as in `api-extractor`
- d48cf39f2a: fix glob on windows os
- 75275b0b0b: Updated dependency `@microsoft/tsdoc-config` to `0.16.2`.
- 76fc6f7ec8: Updates Api-extractor and api-documenter version
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.1-next.2

### Patch Changes

- 76fc6f7ec8: Updates Api-extractor and api-documenter version
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.1-next.1

### Patch Changes

- d48cf39f2a: fix glob on windows os
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.1-next.0

### Patch Changes

- c447a5221b: Use the project tsconfig in case of selection all packages
- 93cff3053e: Move some dependencies as `peerDependencies` because we need to always use same version as in `api-extractor`
- 75275b0b0b: Updated dependency `@microsoft/tsdoc-config` to `0.16.2`.
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## 0.1.0

### Minor Changes

- 99713fd671: Introducing repo-tools package
- 03843259b4: Api reference documentation improvements

  - breadcrumbs links semantics as code spans
  - new `@config` annotation to describe related config keys

### Patch Changes

- 9b1193f277: declare dependencies
- a8611bcac4: Add new command options to the `api-report`

  - added `--allow-warnings`, `-a` to continue processing packages if selected packages have warnings
  - added `--allow-all-warnings` to continue processing packages any packages have warnings
  - added `--omit-messages`, `-o` to pass some warnings messages code to be omitted from the api-report.md files
  - The `paths` argument for this command now takes as default the value on `workspaces.packages` inside the root package.json
  - change the path resolution to use the `@backstage/cli-common` packages instead

- 25ec5c0c3a: Include asset-types.d.ts while running the api report command
- 71f80eb354: add the command type-deps to the repo tool package.
- ac440299ef: Updated api docs generation to be compatible with Docusaurus 2-alpha and 2.x.
- Updated dependencies
  - @backstage/errors@1.1.4
  - @backstage/cli-common@0.1.11

## 0.1.0-next.2

### Patch Changes

- a8611bcac4: Add new command options to the `api-report`

  - added `--allow-warnings`, `-a` to continue processing packages if selected packages have warnings
  - added `--allow-all-warnings` to continue processing packages any packages have warnings
  - added `--omit-messages`, `-o` to pass some warnings messages code to be omitted from the api-report.md files
  - The `paths` argument for this command now takes as default the value on `workspaces.packages` inside the root package.json
  - change the path resolution to use the `@backstage/cli-common` packages instead

- Updated dependencies
  - @backstage/cli-common@0.1.11-next.0
  - @backstage/errors@1.1.4-next.1

## 0.1.0-next.1

### Minor Changes

- 03843259b4: Api reference documentation improvements

  - breadcrumbs links semantics as code spans
  - new `@config` annotation to describe related config keys

### Patch Changes

- 71f80eb354: add the command type-deps to the repo tool package.
- Updated dependencies
  - @backstage/errors@1.1.4-next.1

## 0.1.0-next.0

### Minor Changes

- 99713fd671: Introducing repo-tools package

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.4-next.0
