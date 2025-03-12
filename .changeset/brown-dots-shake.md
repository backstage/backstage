---
'@backstage/core-plugin-api': patch
---

Failure to lazy load an extension will now always result in an error being thrown to be forwarded to error boundaries, rather than being rendered using the `BootErrorPage` app component.
