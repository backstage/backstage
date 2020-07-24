# TechDocs FAQ

This page answer frequently asked questions about [TechDocs].

#### Technology

- [What static site generator is TechDocs using?](./#what-static-site-generator-is-techdocs-using)
- [What is the mkdocs-techdocs-core plugin?](./#what-is-the-mkdocs-techdocs-core-plugin)

## What static site generator is TechDocs using?

TechDocs is using [MkDocs](https://www.mkdocs.org/) to build project
doucmentation under the hood. Documentation built with the
[techdocs-container](https://github.com/spotify/backstage/blob/master/packages/techdocs-container/README.md)
is using the MkDocs Material Theme.

## What is the mkdocs-techdocs-core plugin?

The
[mkdocs-techdocs-core](https://github.com/spotify/backstage/blob/master/packages/techdocs-container/techdocs-core/README.md)
package is a MkDocs Plugin that works like a wrapper around multiple MkDocs
plugins (e.g.
[MkDocs Monorepo Plugin](https://github.com/spotify/mkdocs-monorepo-plugin)) as
well as a selection of Python Markdown extensions that TechDocs supports.

_Add a question that you think others might be interested in? Edit the file
[here](https://github.com/spotify/backstage/edit/master/docs/features/techdocs/FAQ.md)._

[techdocs]: README.md
