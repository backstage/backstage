---
'@backstage/plugin-jenkins': patch
---

Avoid loading data from Jenkins twice. Don't load data when navigating thought the pages as all data from all pages is already loaded.
