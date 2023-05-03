# @backstage/repo-tools

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
