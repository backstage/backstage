---
'@backstage/plugin-techdocs': patch
---

In order to decouple this package from `mkdocs` implementation, the following changes has been made:

- `ReaderProvider` has been deprecated in favor of `TechDocsReaderPageContentProvider` exported by `@backstage/plugin-techdocs-react`;
- `TechDocsReaderLayout` has been deprecated, and `TechDocsReaderPageLayout` is now recommended, this new one accepts child prop which must be a content renderer implementation;
- All `mkdocs` components have been extracted to a new package called `@backstage/plugin-techdocs-mkdocs-react`, but no breaking changes are expected, because these components were internal.
