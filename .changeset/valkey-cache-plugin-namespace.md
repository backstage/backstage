---
'@backstage/backend-defaults': patch
---

Fixed the `valkey` cache store sharing keys between plugins. Two plugins that cached a value under the same key could read and overwrite each other's entries. Keys are now stored under the plugin namespace, the same way the `redis` store does it. Cache entries now use new key names, so existing entries are no longer read and are rebuilt as plugins write new values. Old entries stay in Valkey until their TTL expires. Entries without a TTL, and the per-plugin key index sets that the old layout created, stay until you remove them manually.
