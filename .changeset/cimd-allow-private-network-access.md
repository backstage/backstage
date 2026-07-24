---
'@backstage/plugin-auth-backend': patch
---

Skip SSRF protection for CIMD metadata fetches when the `client_id` matches an exact (non-wildcard) entry in `allowedClientIdPatterns`. Exact patterns mean the administrator explicitly listed a specific URL, so the DNS resolution is trusted. Wildcard patterns still enforce the SSRF check to protect against attacker-controlled subdomains resolving to internal addresses.
