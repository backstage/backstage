---
'@backstage/plugin-techdocs-node': minor
---

Export the generator building blocks needed to implement additional documentation engines in separate modules: `DockerContainerRunner`, `createOrUpdateMetadata`, `storeEtagMetadata`, `runCommand`, `validateInputDirectory`, `patchIndexPreBuild`, the `mkdocs.yml` format helpers `MKDOCS_SCHEMA`, `validateMkdocsYaml` and `sanitizeMkdocsYml`, and the `GeneratorConfig`, `GeneratorRunInType` and `RunCommandOptions` types. `DockerContainerRunner` was previously internal.
