---
'@backstage/plugin-search-backend': patch
---

Error messages should not contain backend SQL query strings in the API response, this change will ensure that messages are logged and empty response is returned to the user
