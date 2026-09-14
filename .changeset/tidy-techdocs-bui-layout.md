---
'@backstage/plugin-techdocs': major
---

**BREAKING**: Replaced the legacy self-contained MUI reader page with a wrapper-free layout designed to compose inside host-provided page chrome. Applications that require the legacy reader page contract should remain on the previous major version.

`TechDocsReaderPage` no longer supplies a Material UI `Page`, `ThemeProvider`, or reader-specific height and scrolling behavior around custom children. Host applications and custom reader children must provide any page chrome they require. The default reader layout now uses Backstage UI for its header and entity metadata card.

The injected MkDocs layout now uses the host page as its scrolling container, with CSS Grid and sticky navigation instead of fixed positioning and JavaScript scroll and resize measurement. `TechDocsReaderLayout` also accepts `defaultPath` and `searchResultUrlMapper` for embedded reader routes.

Reader navigation no longer scrolls the global window or searches the host document for a header. Active MkDocs navigation items are kept visible by scrolling only their own sidebar.

The following legacy sidebar customization properties have been removed along with the measured layout:

- `--techdocs-sidebar-closed-offset-pinned`
- `--techdocs-sidebar-closed-offset-collapsed`
- `--techdocs-sidebar-open-translate`
