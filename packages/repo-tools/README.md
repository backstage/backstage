# @backstage/repo-tools

This package provides a CLI for backstage repo tooling.

## Installation

Install the package via Yarn:

```sh
yarn add @backstage/repo-tools
```

## Modules

The `backstage-repo-tools` command is a thin wrapper around the CLI modules in [`@backstage/repo-tools-defaults`](../repo-tools-defaults). The commands themselves live in the following packages:

| Module                                                                               | Commands                                                                         |
| :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| [`@backstage/cli-module-report-api`](../cli-module-report-api)                       | `api-reports`                                                                    |
| [`@backstage/cli-module-report-knip`](../cli-module-report-knip)                     | `knip-reports`                                                                   |
| [`@backstage/cli-module-schema-openapi`](../cli-module-schema-openapi)               | `package schema openapi ...`, `repo schema openapi ...`                          |
| [`@backstage/cli-module-repo-checks`](../cli-module-repo-checks)                     | `type-deps`, `peer-deps`, `generate-catalog-info`, `lint legacy-backend-exports` |
| [`@backstage/cli-module-package-manager-patch`](../cli-module-package-manager-patch) | `generate-patch`                                                                 |
| [`@backstage/cli-module-package-docs`](../cli-module-package-docs)                   | `package-docs` (experimental)                                                    |
