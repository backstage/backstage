---
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog-graph': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
'@backstage/plugin-home': patch
'@backstage/plugin-notifications': patch
'@backstage/plugin-search': patch
'@backstage/plugin-user-settings': patch
---

New frontend pages use Backstage links and routing hooks without declaring a React Router adapter. Removed the unused page adapter dependency. Legacy frontend exports remain supported.
