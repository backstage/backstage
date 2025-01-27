---
'@backstage/cli': patch
---

Added `--allowed-types` to `new` command. This is useful for limiting the type of plugins that can be created. For example, if you only want to create `plugin` and `plugin-react` plugins, you can run `backstage-cli new --allowed-types plugin,plugin-react`.

Added `--skip-install` to `new` command. This is useful for skipping the installation of dependencies after creating a new plugin.

Added `--prefix` to `new` command. This is useful for customizing the prefix of the plugin package name, defined after the scope, which by default is `backstage-plugin-`.
