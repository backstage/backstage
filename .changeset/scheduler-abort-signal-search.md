---
'@backstage/plugin-search-backend-node': patch
---

Scheduled search indexing tasks now stop when the scheduler aborts the task, for example when it times out or the backend shuts down, instead of continuing to collate and index documents in the background.
