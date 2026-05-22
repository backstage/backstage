---
'@backstage/backend-defaults': patch
---

Added a `pingInterval` config option for the Redis cache store to keep connections alive in environments where idle connections are silently dropped. Works with both standalone and clustered Redis. Fixes https://github.com/backstage/backstage/issues/31813, https://github.com/backstage/backstage/issues/31742.
