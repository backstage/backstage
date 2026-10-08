---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-react': minor
'@backstage/plugin-techdocs-backend': minor
---

Add engine abstraction layer for multi-engine TechDocs support. Introduces `--engine` flag, engine config map, generator registry with `backstage.io/techdocs-engine` annotation support, `engine` field in `techdocs_metadata.json`, `serve:raw` command, and live-reload adapter interface. MkDocs remains the default with no behavior change.
