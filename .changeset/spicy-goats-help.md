---
'@backstage/cli': patch
---

Add an experimental `install <plugin>` command.

Given a `pluginId`, the command looks for NPM packages matching `@backstage/plugin-{pluginId}` or `backstage-plugin-{pluginId}` or `{pluginId}`. It looks for the `installationRecipe` in their `package.json` for the steps of installation. Detailed documentation and API Spec to follow (and to be decided as well).
