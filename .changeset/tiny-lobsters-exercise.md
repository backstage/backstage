---
'@backstage/plugin-techdocs': patch
---

- Renamed `DocsResultListItem` to `TechDocsSearchResultListItem`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPage` to `TechDocsReaderPage`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPageRenderFunction` to `TechDocsPageRenderFunction`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPageHeader` to `TechDocsReaderPageHeader`, leaving the old name in place as a deprecations.

- `LegacyTechDocsHome` marked as deprecated and will be deleted in next release, use `TechDocsCustomHome` instead.

- `LegacyTechDocsPage` marked as deprecated and will be deleted in next release, use `TechDocsReaderPage` instead.
