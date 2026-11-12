# @backstage/plugin-techdocs-backend-module-zensical

## 0.1.1

### Patch Changes

- f8a717e: Restricts `markdown_extensions` in `mkdocs.yml` to known extension names before documentation generation, in both the MkDocs and Zensical engines. Extension names outside the permitted set are removed from the configuration with a warning. Allow additional extensions, for example from a custom build image, with the new `techdocs.generator.mkdocs.dangerouslyAllowAdditionalExtensions` configuration, or the `--dangerouslyAllowAdditionalExtensions` flag when using the TechDocs CLI.
- Updated dependencies
  - @backstage/plugin-techdocs-node@2.2.1

## 0.1.0

### Minor Changes

- 8fd70e3: New module that adds [Zensical](https://zensical.org) as an experimental TechDocs documentation engine. Opt entities in with the `backstage.io/techdocs-engine: zensical` annotation, or set `techdocs.generator.defaultEngine: zensical`. See [Zensical Engine](https://backstage.io/docs/features/techdocs/engines-zensical) for setup and configuration.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@2.2.0
