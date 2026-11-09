# @backstage/cli-module-format-prettier

CLI module that formats code with [Prettier](https://prettier.io/) for the Backstage CLI. It's included in `@backstage/cli-defaults`.

Prettier itself isn't bundled. The command uses the `prettier` package that the root `package.json` of the project depends on, along with the Prettier configuration and `.prettierignore` file of the project.

## Commands

| Command          | Description                    |
| :--------------- | :----------------------------- |
| `package format` | Format a package with Prettier |

## Documentation

- [Formatting with the Backstage CLI](https://backstage.io/docs/tooling/cli/build-system#formatting)
- [Backstage Documentation](https://backstage.io/docs)
