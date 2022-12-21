# @backstage/repo-tools

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
