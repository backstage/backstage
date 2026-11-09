# @backstage/repo-tools-defaults

The default set of CLI modules for the Backstage repo tools CLI. Installing this single package provides all standard `backstage-repo-tools` commands without needing to list each module individually.

## Included Modules

| Module                                                                               | Description                                       |
| :----------------------------------------------------------------------------------- | :------------------------------------------------ |
| [`@backstage/cli-module-package-docs`](../cli-module-package-docs)                   | Experimental package documentation generation     |
| [`@backstage/cli-module-package-manager-patch`](../cli-module-package-manager-patch) | Patch generation for other repositories           |
| [`@backstage/cli-module-repo-checks`](../cli-module-repo-checks)                     | Dependency and catalog metadata checks            |
| [`@backstage/cli-module-report-api`](../cli-module-report-api)                       | API, CLI and SQL report generation                |
| [`@backstage/cli-module-report-knip`](../cli-module-report-knip)                     | Knip report generation                            |
| [`@backstage/cli-module-schema-openapi`](../cli-module-schema-openapi)               | OpenAPI schema generation, validation and diffing |

For fine-grained control over which commands are available, you can install individual modules instead.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
