---
'@backstage/plugin-auth-node': patch
---

Hardened return URL validation in the OAuth redirect flow. Failed sign-in attempts now return to the configured app URL with the error message, including when the return URL is invalid.
