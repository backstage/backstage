---
'@backstage/plugin-search-backend-node': patch
---

Change search scheduler from starting indexing in a fixed interval (for example
every 60 seconds), to wait a fixed time between index runs.
This makes sure that no second index process for the same document type is
started when the previous one is still running.
