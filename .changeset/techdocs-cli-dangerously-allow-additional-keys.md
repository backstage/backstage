---
'@techdocs/cli': minor
---

Added a `--dangerouslyAllowAdditionalKeys` option to `techdocs-cli generate`, matching the existing `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` backend config option. Previously, running `techdocs-cli generate` directly had no way to allow additional `mkdocs.yml` top-level keys, even if the equivalent setting was configured in `app-config.yaml`, since the CLI builds its own in-memory config from flags rather than reading a config file.
