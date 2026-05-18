---
'@backstage/config': minor
---

Added an optional `onChange` callback parameter to all data-reading methods on
the `Config` type. This allows consumers to register interest in config value
changes and signal whether the update was accepted via the return value.
