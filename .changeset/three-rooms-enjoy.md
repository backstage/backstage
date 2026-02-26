---
'@backstage/plugin-search': minor
---

Added support for configuring the default search type in the search page via the `search.defaultType` option in `app-config.yaml`. This applies to both the legacy and new frontend systems. If not set, the default is empty, which means searching for "all" types.
