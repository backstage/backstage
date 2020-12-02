---
'@backstage/plugin-proxy-backend': patch
---

Filter the headers that are sent from the proxied-targed back to the frontend to not forwarded unwanted authentication or
monitoring contexts from other origins (like `Set-Cookie` with e.g. a google analytics context). The implementation reuses
the `allowedHeaders` configuration that now controls both directions `frontend->target` and `target->frontend`.
