---
'@backstage/plugin-linguist-backend': patch
---

Several improvements to the Linguist backend have been made:

- Added tests for the `LinguistBackendDatabase` and `LinguistBackendApi`
- Added support for using SQLite as a database, helpful for local development
- Removed the default from the `processes_date` column
- Converted the `LinguistBackendApi` into an Interface
- Added the `LinguistBackendClient` which implements the `LinguistBackendApi` Interface
- Unprocessed entities will get processed before stale entities
- Entities in the Linguist database but not in the Catalog anymore will be deleted
- Improved the README's headings
