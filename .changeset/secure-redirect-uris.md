---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The OAuth redirect URI and client ID metadata document allowlists now match patterns against each URL component separately instead of against the full URL string. Wildcards no longer match across the host and path boundary, patterns must include an explicit protocol and are otherwise rejected as invalid configuration instead of being silently ignored, and redirect URIs that contain embedded credentials are always rejected.

A wildcard port also no longer implicitly matches every path: a pattern such as `http://localhost:*` now only matches the root path. Use `http://localhost:*/*` to allow any port and any path. The built-in loopback defaults have been updated accordingly, so this only affects explicitly configured patterns.
