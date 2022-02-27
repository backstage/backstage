---
'@backstage/plugin-techdocs': minor
---

**BREAKING:**
Table column utilities `createNameColumn`, `createOwnerColumn`, `createTypeColumn` as well as actions utilities `createCopyDocsUrlAction` and `createStarEntityAction` are no longer directly exported. Instead accessible through DocsTable and EntityListDocsTable.

Use as following:

```tsx
DocsTable.columns.createNameColumn();
DocsTable.columns.createOwnerColumn();
DocsTable.columns.createTypeColumn();

DocsTable.actions.createCopyDocsUrlAction();
DocsTable.actions.createStarEntityAction();
```

- Renamed `DocsResultListItem` to `TechDocsSearchResultListItem`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPage` to `TechDocsReaderPage`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPageRenderFunction` to `TechDocsPageRenderFunction`, leaving the old name in place as a deprecations.

- Renamed `TechDocsPageHeader` to `TechDocsReaderPageHeader`, leaving the old name in place as a deprecations.

- `LegacyTechDocsHome` marked as deprecated and will be deleted in next release, use `TechDocsCustomHome` instead.

- `LegacyTechDocsPage` marked as deprecated and will be deleted in next release, use `TechDocsReaderPage` instead.
