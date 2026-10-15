# @backstage/cli-module-test

CLI module that provides the `repo test` command for the Backstage CLI. It runs
the `package test` command of each package in the repository, one child process per
package. The tool that runs the tests is chosen by whichever CLI module provides
`package test` for that package, such as `@backstage/cli-module-test-jest`.

## Commands

| Command     | Description                                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------------------------------ |
| `repo test` | Run `package test` for each package in the repository, with `--since`, `--include-dependents` and `--watch` support |

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
