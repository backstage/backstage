---
id: markdown-source
title: Preview Markdown source rendering
---

TechDocs can experimentally publish documentation source for browser rendering.
Existing HTML generation remains the default. Source rendering treats documents as
data: it does not run Python plugins, macros, JavaScript, or executable examples.

## Publishing

For backend builds, set `techdocs.migration.publishing` to `dual` to publish HTML
and source together, or `source` to skip MkDocs. The default is `legacy`.

For CI builds, run `techdocs-cli generate --publishing dual` (or `source`), then
publish the complete output directory with the existing `techdocs-cli publish`
command. Both formats use the same storage provider. Keep `_techdocs` reserved for
TechDocs. Source assets have their own copies and are stored as inert JSON files.

Run `techdocs-cli migrate-config --source-dir .` to create `techdocs.yaml` from
supported MkDocs settings. Review its diagnostics. Keep `mkdocs.yml` while dual
publishing; each configuration controls its own format. Source generation also
accepts supported MkDocs settings without requiring a new configuration file.

```yaml
version: 1
title: Example documentation
docsDir: docs
nav:
  - Home: index.md
  - Guides:
      - Getting started: guides/getting-started.md
```

Only these keys are accepted in `techdocs.yaml`. Navigation entries must reference
existing Markdown pages. Configuration is parsed as data, without custom YAML
tags. Symlinks, paths outside the document root, and executable source files are
not accepted. Pages are limited to 1 MB, individual assets to 10 MB, and a site to
100 MB and 10,000 files. Unsupported assets and MkDocs settings produce diagnostics.

Source builds produce a search index for Backstage search. Dual builds retain the
legacy search index, and also publish a separate source search index.
