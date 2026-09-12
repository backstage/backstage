---
'@backstage/plugin-signals-backend': patch
---

Fixed WebSocket upgrade error responses to prevent load balancers from returning 502 when authentication fails. Error responses now use valid HTTP headers, ensuring the actual error status (401 or 500) is delivered to the client instead of being masked.
