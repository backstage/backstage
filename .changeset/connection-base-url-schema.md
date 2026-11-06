---
'@backstage/connections': patch
---

Added a shared internal schema for connection definitions to accept HTTP(S) base roots with or without a trailing slash and return a trailing slash, preserving context paths when consumers resolve relative paths.

Connection definitions can also opt in to defaulting an omitted base URL to an HTTPS root for the required lookup host. Lookup host names are normalized for matching while remaining independent of explicit endpoint overrides.
