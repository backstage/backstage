---
'@backstage/plugin-search': minor
---

Migrated to new composability API, exporting the plugin instance as `searchPlugin`, and page as `SearchPage`. Due to the old router component also being called `SearchPage`, this is a breaking change. The old page component is now exported as `Router`, which can be used to maintain the old behavior.
