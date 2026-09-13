---
'@backstage/plugin-techdocs': major
---

**BREAKING**: Replaced the legacy MUI reader layout contract with a wrapper-free layout for the new frontend system. TechDocs now participates in the host page's normal document flow, uses CSS Grid and sticky positioning for its navigation, and no longer accepts `overrideThemeOptions` on `TechDocsReaderPage`. Applications that require the legacy self-contained MUI page layout should remain on the previous major version.
