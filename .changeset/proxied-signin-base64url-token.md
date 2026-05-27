---
'@backstage/core-components': patch
---

Fixed the proxy-based sign-in page failing to read the session token when the proxy issues a token whose payload is encoded using the URL-safe base64 alphabet. Such tokens are now decoded correctly so sign-in no longer breaks.
