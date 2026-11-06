---
'@backstage/connections': patch
---

Added a shared internal schema for connection definitions to accept HTTP(S) base roots with or without a trailing slash and return a trailing slash, preserving context paths when consumers resolve relative paths.

Connection definitions can also opt in to deriving a missing host from the base URL or a missing base URL as an HTTPS host root. Lookup host names are normalized for matching while remaining independent of explicit endpoint overrides.
