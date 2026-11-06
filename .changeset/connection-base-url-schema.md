---
'@backstage/connections': patch
---

Added a shared internal schema for connection definitions to accept HTTP(S) base roots with or without a trailing slash and return a trailing slash, preserving context paths when consumers resolve relative paths.
