---
'@backstage/config-loader': patch
---

Add boolean `allowMissingDefaultConfig` option to `ConfigSources.default` and
`ConfigSources.defaultForTargets`, which results in omission of a ConfigSource
for the default app-config.yaml configuration file if it's not present.
