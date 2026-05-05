---
'@backstage/cli-module-oxlint': patch
---

Fixed `defineBackstageConfig` to enable all seven Backstage lint rules by default and auto-include the bundled plugin. Added a `baseRules` option for applying rules to all files regardless of role. Declared missing `globby`, `chalk`, and `minimatch` dependencies, pinned `oxlint` with tilde version range, and added `oxlint-tsgolint` as an optional peer dependency. The `repo lint` command now forwards the `--max-warnings` flag to each oxlint invocation, and a helpful error message is shown when the oxlint binary is not installed.
