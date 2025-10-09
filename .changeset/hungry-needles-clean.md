---
'@backstage/eslint-plugin': patch
---

Allow frontend plugin to import from another frontend plugin with same plugin id.

This prevents the ESLint rule from incorrectly flagging these imports in the new frontend system
where plugin override requires cross-plugin imports.
