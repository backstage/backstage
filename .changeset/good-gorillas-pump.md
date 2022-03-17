---
'@backstage/plugin-scaffolder': minor
---

**BREAKING**: Removed the unused `titleComponent` property of `groups` passed to the `ScaffolderPage`. The property was already ignored, but existing usage should migrated to use the `title` property instead, which now accepts any `ReactNode`.
