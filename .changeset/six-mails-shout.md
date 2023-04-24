---
'@backstage/plugin-shortcuts': patch
---

Marked `LocalStoredShortcuts` as deprecated, replacing it with `DefaultShortcutsApi` whose naming more clearly suggests that the shortcuts aren't necessarily stored locally (it depends on the storage implementation).
