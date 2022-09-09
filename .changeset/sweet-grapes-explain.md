---
'@backstage/integration': patch
---

Improved caching around github app tokens.
Tokens are now cached for 50 minutes, not 10.
Calls to get app installations are also included in this cache.
If you have more than one github app configured, consider adding `allowedInstallationOwners` to your apps configuration to gain the most benefit from these performance changes.
