---
'@backstage/plugin-user-settings': patch
---

Prevent `.set()` to execute a request to the StorageClient if the user is `guest`
