---
'@backstage/core-app-api': patch
---

An app whose `Router` app component does not set up React Router — a passthrough that renders its children unchanged, for example — now renders instead of failing at startup. While no router is present the app has no location to report, so it records no `navigate` analytics events; once a router is in place, tracking behaves exactly as before. Apps that keep the default router are unaffected.
