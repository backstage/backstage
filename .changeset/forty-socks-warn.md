---
'@backstage/plugin-auth-node': patch
---

Fixed chunked cookie replacing edge case in OAuthCookieManager class where some of the old chunks would not get removed if new chunked cookie would have fewer chunks.
