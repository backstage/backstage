# @backstage/cli-module-build

CLI module that provides build, start, and packaging commands for the Backstage CLI.

## Commands

| Command            | Description                                                               |
| :----------------- | :------------------------------------------------------------------------ |
| `package build`    | Build a package for production deployment or publishing                   |
| `package start`    | Start a package for local development                                     |
| `package clean`    | Delete cache directories                                                  |
| `package prepack`  | Prepares a package for packaging before publishing                        |
| `package postpack` | Restores the changes made by the prepack command                          |
| `repo build`       | Build packages in the project, excluding bundled app and backend packages |
| `repo start`       | Starts packages in the repo for local development                         |
| `repo clean`       | Delete cache and output directories                                       |
| `build-workspace`  | Builds a temporary dist workspace from the provided packages              |

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
- [Build System](https://backstage.io/docs/tooling/cli/build-system)
