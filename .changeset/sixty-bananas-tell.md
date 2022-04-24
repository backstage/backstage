---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-node': minor
---

Add a `--strict` option to the TechDocs CLI to convert mkdocs warnings to errors

This adds a `--strict` option to the TechDocs CLI `generate` function, which causes
warnings from mkdocs to surface as errors.
This is implemented by passing through this flag to mkdocs, which already supports
the `--strict` flag on the `build` command.

This feature allows users to fail builds when, for example, the mkdocs nav
configuration references a file that doesn't exist.
