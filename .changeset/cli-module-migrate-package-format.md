---
'@backstage/cli-module-migrate': patch
---

The `migrate package-lint-configs` command now formats the configuration files it writes with `backstage-cli package format`, so it uses whichever formatter module the project has installed. The command now fails if the project root doesn't depend on that formatter, instead of skipping formatting when Prettier isn't found.
