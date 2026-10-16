---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-react': minor
'@backstage/plugin-techdocs-backend': minor
---

Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.

The built-in generator is now registered under `mkdocs`; the previous `techdocs` key is kept as an alias, so existing `generators.register('techdocs', ...)` calls continue to work. The CLI's `--engine` flag takes precedence over the `backstage.io/techdocs-engine` annotation for all commands, and the following now print deprecation warnings: the `serve:mkdocs` command (use `serve:raw`), and the `serve` flags `--mkdocs-port` (use `--engine-port`), `--mkdocs-config-file-name` (use `--config-file-name`) and `--mkdocs-parameter-*` (use `--parameter-*`). If both the old and new flag are given, the new one wins and the warning says the old one is ignored.
