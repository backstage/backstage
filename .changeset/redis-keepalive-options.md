---
'@backstage/backend-defaults': patch
---

Expose Redis socket keepalive, ping/timeout, and reconnect strategy options in
the backend cache configuration to address
https://github.com/backstage/backstage/issues/31813 and
https://github.com/backstage/backstage/issues/31742.
