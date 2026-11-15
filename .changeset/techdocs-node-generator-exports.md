---
'@backstage/plugin-techdocs-node': minor
---

Added a new `@backstage/plugin-techdocs-node/alpha` entry point with building blocks for implementing additional documentation engines in separate modules: `createDockerContainerRunner`, `createOrUpdateMetadata`, `storeEtagMetadata`, `runCommand`, `validateInputDirectory`, `patchIndexPreBuild`, and the `mkdocs.yml` helpers `MKDOCS_SCHEMA`, `validateMkdocsYaml` and `sanitizeMkdocsYml`. These are alpha and may change in minor releases.
