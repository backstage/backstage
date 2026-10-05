---
'@backstage/plugin-catalog-backend': patch
---

Processing errors are now size-limited before they are stored and added to the entity status. Long strings in the serialized error are truncated, and errors that are still too large are reduced to their name, message and code. This prevents errors that carry large payloads, such as HTTP responses, from filling up the database.
