---
'@backstage/plugin-techdocs-react': patch
'@backstage/plugin-techdocs': patch
---

Fixed a bug with the TechDocsReaderPageProvider not re-rendering when setShadowDom is called, meaning that the useShadowDom hooks were inconsistent. This issue caused the TextSize addon changes not to reapply during navigation.
