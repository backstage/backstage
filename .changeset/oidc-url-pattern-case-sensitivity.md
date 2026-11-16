---
'@backstage/plugin-auth-backend': patch
---

Made matching of the `allowedRedirectUriPatterns` and `allowedClientIdPatterns` configuration case-sensitive for URL paths, while the host part of a URL stays case-insensitive as required by URL semantics. Redirect URIs and client IDs that differ from a configured pattern only by path casing are now rejected. Wildcards keep working, including in the path, but the literal text of a pattern is matched case-sensitively too, so a pattern such as `https://app.example.com/oauth/*` no longer matches `https://app.example.com/OAUTH/...`.
