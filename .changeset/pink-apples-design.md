---
'@backstage/plugin-shortcuts': patch
---

Fixed bug in LocalStoredShortcuts client where adding new Shortcut results in replacing entire shortcut list.

Refactored LocalStoredShortcuts client to listen to `storageApi` updates to ensure that local state is always up to date.
