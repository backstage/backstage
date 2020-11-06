---
id: faqs
title: TechDocs FAQ
sidebar_label: FAQ
description: This page answers frequently asked questions about TechDocs
---

This page answers frequently asked questions about [TechDocs](README.md).

## Technology

- [What static site generator is TechDocs using?](#what-static-site-generator-is-techdocs-using)
- [What is the mkdocs-techdocs-core plugin?](#what-is-the-mkdocs-techdocs-core-plugin)
- [Does TechDocs support file formats other than Markdown (e.g. RST, AsciiDoc)?](#does-techdocs-support-file-formats-other-than-markdown-eg-rst-asciidoc-)

#### What static site generator is TechDocs using?

TechDocs is using [MkDocs](https://www.mkdocs.org/) to build project
documentation under the hood. Documentation built with the
[techdocs-container](https://github.com/backstage/techdocs-container) is using
the MkDocs [Material Theme](https://github.com/squidfunk/mkdocs-material).

#### What is the mkdocs-techdocs-core plugin?

The [mkdocs-techdocs-core](https://github.com/backstage/mkdocs-techdocs-core)
package is a MkDocs Plugin that works like a wrapper around multiple MkDocs
plugins (e.g.
[MkDocs Monorepo Plugin](https://github.com/spotify/mkdocs-monorepo-plugin)) as
well as a selection of Python Markdown extensions that TechDocs supports.

#### Does TechDocs support file formats other than Markdown (e.g. RST, AsciiDoc) ?

Not right now. We are currently using MkDocs to generate the documentation from
source, so the files have to be in Markdown format. However, in the future we
want to support other static site generators which will make it possible to use
other file formats.
