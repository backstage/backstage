---
'@backstage/plugin-app': minor
---

Provides the revised dialog and icons APIs under versioned IDs, while retaining adapters under `core.dialog` and `core.icons`. The original dialog API forwards `open` to the current implementation, but `show` and `showModal` now throw errors directing callers to use `open` with explicit dialog presentation.

The original icons API continues providing `getIcon` through the current implementation, including custom overrides. New icon callers should use `IconsApi.icon` to obtain an icon element.
