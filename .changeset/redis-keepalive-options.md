---
'@backstage/backend-defaults': patch
---

Expose Redis socket keepalive and ping/timeout options in the backend cache
configuration to address https://github.com/backstage/backstage/issues/31813
and https://github.com/backstage/backstage/issues/31742.
