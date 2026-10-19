---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-react': minor
'@backstage/plugin-techdocs-backend': minor
---

Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.

The built-in generator is now registered under `mkdocs`; the previous `techdocs` key is kept as an alias, so existing `generators.register('techdocs', ...)` calls continue to work. The CLI's `--engine` flag takes precedence over the `backstage.io/techdocs-engine` annotation for all commands, and `serve:mkdocs` and the `--mkdocs-parameter-*` flags now print deprecation warnings.
