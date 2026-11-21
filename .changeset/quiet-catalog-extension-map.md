---
'@backstage/frontend-app-api': patch
---

Added an object form of `app.extensions` for settings that merge across configuration files without changing extension order. Extensions can configure `inputs.<input-name>.order` to order their children by ID, with `*` positioning unlisted children. Invalid settings are reported through app errors with recoverable fallbacks; duplicate ordering IDs and wildcards use their first occurrence. The existing array form retains its ordering and enabling behavior.
