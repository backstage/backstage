# @backstage/repo-tools

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
