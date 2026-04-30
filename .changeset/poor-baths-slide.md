---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-backend': minor
---

Added modular generator architecture for TechDocs, allowing you to swap documentation engines via configuration.

**Backend and Node packages:**

- New `techdocs.generator.type` config option to select generator (defaults to `'techdocs-mkdocs'`)
- Added support for Zensical-based documentation generation
- Extension point now supports `registerGenerator(type, factory)` for custom generators

**CLI:**

- Added `--generator-type` option to `generate`, `serve`, and `serve:engine` commands
- Renamed `serve:mkdocs` to `serve:engine` (old name still works for backward compatibility)
- Renamed CLI options: `--mkdocs-port` to `--docs-port`, `--mkdocs-parameter-*` to `--clean`/`--dirty-reload`/`--strict`, `--mkdocs-config-file-name` to `--config` (old names still work for backward compatibility)
