---
'@backstage/repo-tools': minor
---

**BREAKING**: The `backstage-repo-tools package schema openapi generate --server` command now requires a client package to be accessible. This provides support for recursive types and completely aligns server and client types. [See the updated docs](https://backstage.io/docs/openapi/01-getting-started) for more information.
