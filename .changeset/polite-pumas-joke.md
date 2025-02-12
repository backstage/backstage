---
'@backstage/cli': minor
---

The `new` command is now powered by a new template system that allows you to define your own templates in a declarative way, as well as import existing templates from external sources. See the [CLI templates documentation](https://backstage.io/docs/tooling/cli/templates) for more information.

The following flags for the `new` command have been deprecated and will be removed in a future release:

- `--license=<license>`: Configure the global `license` instead.
- `--no-private`: Configure the global `private` instead.
- `--baseVersion=<version>`: Configure the global `version` instead.
- `--npmRegistry=<url>`: Configure the global `publishRegistry` instead.
- `--scope=<scope>`: Configure the global `namePrefix` and/or `namePluginInfix` instead.

As part of this change the template IDs and their options have changed. The following backwards compatibility mappings for the `--select` and `--option` flags are enabled when using the default set of templates, but they will also be removed in the future:

- `--select=plugin` is mapped to `--select=frontend-plugin` instead.
- `--option=id=<id>` is mapped to `--option=pluginId=<id>` instead.
