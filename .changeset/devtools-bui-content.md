---
'@backstage/plugin-devtools': patch
---

Migrated the DevTools content screens and tables to Backstage UI. The screens use responsive system information, consistent table toolbars, and a contained configuration viewer. Scheduled task details open in a dialog from the task ID, with task actions, search, sorting, and pagination preserved. Loading states use the app-provided progress component from the new frontend system. Legacy apps without a compatibility provider no longer display a loading indicator. Existing layout and tab customizations remain supported.
