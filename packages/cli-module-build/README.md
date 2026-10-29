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

## Backend development lifecycle

When running a backend with `package start` or `repo start`, file changes and
pressing Enter restart it gracefully. The CLI waits for its shutdown hooks before
starting the replacement. Ctrl-C exits the development backend immediately,
including during startup or an existing shutdown, without waiting for hooks.
Backends running outside the development CLI retain their normal signal handling.

## Embedded PostgreSQL

When using `backend.database.client: embedded-postgres` for local development,
PostgreSQL stays available across backend reloads. A separate helper owns the
database and stops it when the CLI disconnects, including after Ctrl-C or an
unexpected CLI exit. Ctrl-C does not wait for database cleanup to finish. The
helper also handles termination signals and cleans up only its own database
directory. Files left after forcibly killing the helper or a machine failure are
left to the operating system's temporary-file cleanup policy.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
- [Build System](https://backstage.io/docs/tooling/cli/build-system)
