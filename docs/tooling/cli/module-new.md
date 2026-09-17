---
id: module-new
title: New Module
description: CLI command for scaffolding new plugins and packages.
---

The new module (`@backstage/cli-module-new`) provides a command for scaffolding
new plugins, packages, and other components in your Backstage project.

## new

The `new` command opens up an interactive guide for you to create new things in
your app. If you do not pass in any options it is completely interactive, but it
is possible to pre-select what you want to create using the `--select` flag, and
provide options using `--option`, for example:

```bash
yarn backstage-cli new --select frontend-plugin --option pluginId=foo
```

This command is typically added as a script in the root `package.json` to be
executed with `yarn new`. For example you may have it set up like this:

```json
{
  "scripts": {
    "new": "backstage-cli new"
  }
}
```

The `new` command comes with a default collection of plugins/packages, however,
you can customize this list and even create your own CLI templates. For more
information see [CLI Templates](./04-templates.md).

```text
Usage: backstage-cli new

Options:
  -h, --help               display help for command
```
