---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed search queries intermittently failing with a 500 error when a collator finished indexing. The index that the search alias pointed to before the rotation is no longer deleted immediately, so queries already running against it can complete. It is instead removed during the next indexing run for that document type. Note that this means the previous index is now retained between runs, so search storage usage per document type is roughly doubled.

Also improved error reporting for failed search queries. An index that disappears while a query is running is now reported as a missing index, and other query failures now include the underlying cause in the logs instead of `undefined`.
