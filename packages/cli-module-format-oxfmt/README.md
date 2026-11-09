# @backstage/cli-module-format-oxfmt

CLI module that formats code with [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for the Backstage CLI, as an alternative to the Prettier module in `@backstage/cli-defaults`.

To use it, add both `oxfmt` and `@backstage/cli-module-format-oxfmt` to the root `package.json` of your project. The CLI then uses this module for `package format` instead of the Prettier module. oxfmt itself isn't bundled. The command uses the `oxfmt` package that the project root depends on, along with the oxfmt configuration of the project.

## Commands

| Command          | Description                 |
| :--------------- | :-------------------------- |
| `package format` | Format a package with oxfmt |

## Documentation

- [Formatting with the Backstage CLI](https://backstage.io/docs/tooling/cli/build-system#formatting)
- [Backstage Documentation](https://backstage.io/docs)
