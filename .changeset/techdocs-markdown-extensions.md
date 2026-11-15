---
'@backstage/plugin-techdocs-node': patch
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-techdocs-backend-module-zensical': patch
'@techdocs/cli': patch
---

Restricts `markdown_extensions` in `mkdocs.yml` to known extension names before documentation generation, in both the MkDocs and Zensical engines. Extension names outside the permitted set are removed from the configuration with a warning. Allow additional extensions, for example from a custom build image, with the new `techdocs.generator.mkdocs.dangerouslyAllowAdditionalExtensions` configuration, or the `--dangerouslyAllowAdditionalExtensions` flag when using the TechDocs CLI.
