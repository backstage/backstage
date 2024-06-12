---
'@backstage/integration': minor
---

**BREAKING**: `gitilesBaseUrl` is now mandatory for the Gerrit integration. The
ability to override this requirement using the `DISABLE_GERRIT_GITILES_REQUIREMENT`
environment variable has been removed.
