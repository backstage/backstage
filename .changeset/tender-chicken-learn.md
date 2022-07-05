---
'@backstage/plugin-search-backend': patch
---

If error is `MissingIndexError` we return a 400 response with a more clear error message.
