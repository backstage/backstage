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

## Reader policies

Set `techdocs.migration.rendering` explicitly to enable source discovery:

- `legacy`: start with HTML, with source preview when both artifacts exist.
- `opt-in`: use source when the published project contains `techdocs.yaml`.
- `prefer-source`: use source whenever available, otherwise HTML.
- `source`: require source and disable the HTML preview choice.

Leaving this setting absent preserves the existing reader without additional
source requests. In the first three modes, a **Documentation preview** selector
appears for dual publications. Its `techdocs-preview` URL parameter is shareable;
it changes neither publishing nor repository configuration. Missing source can
fall back to HTML; malformed artifacts and authorization errors cannot.

The source reader supports tables, task lists, footnotes, admonitions, collapsible
tab content, syntax highlighting, Mermaid and KaTeX. It sanitizes embedded HTML
and resolves links within the published snapshot. Scripts, document styles,
executable imports, external images, and document-supplied diagram configuration
are not allowed. Mermaid and math have input limits, and expensive renderers load
on demand. Large diagrams can still be expensive; this is an experimental reader.

## Markdown add-ons

Import `MarkdownAddonBlueprint` from `@backstage/plugin-techdocs-react/alpha`.
Register it alongside the existing `AddonBlueprint` in a frontend module to
support both readers. Each reader activates only its own registrations.

```tsx
const diagram = MarkdownAddonBlueprint.make({
  name: 'diagram',
  params: {
    codeBlocks: [{ language: 'diagram', loader: () => import('./Diagram') }],
  },
});
```

Add-ons can contribute toolbar/settings/navigation/TOC/content slots, override
links, images, tables and code rendering, and transform the Markdown syntax tree
before sanitization. `useTechDocsDocument` exposes page, headings and navigation;
`useTechDocsSelection` exposes selected text and source lines where available.
Duplicate component or code-language registrations are configuration errors.
Add-ons are trusted application code: documents cannot install them. Custom
components must preserve URL and output security policies. Any syntax transforms
that change headings or searchable content must also run during ingestion.
