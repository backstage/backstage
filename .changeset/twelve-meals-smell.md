---
'@backstage/plugin-vault-backend': patch
---

Use `express-promise-router` to catch errors properly.
Add `403` error as a known one. It will now return a `NotAllowed` error.
