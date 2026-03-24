# @backstage/cli-module-migrate

CLI module that provides migration and version management commands for the Backstage CLI.

## Commands

| Command                        | Description                                                       |
| :----------------------------- | :---------------------------------------------------------------- |
| `versions:bump`                | Bump Backstage packages to the latest versions                    |
| `versions:migrate`             | Migrate plugins moved to the @backstage-community namespace       |
| `migrate package-roles`        | Add package role field to packages that don't have it             |
| `migrate package-scripts`      | Set package scripts according to each package role                |
| `migrate package-exports`      | Synchronize package subpath export definitions                    |
| `migrate package-lint-configs` | Migrates all packages to use @backstage/cli/config/eslint-factory |
| `migrate react-router-deps`    | Migrates the react-router dependencies to be peer dependencies    |

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
