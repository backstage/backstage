---
'@backstage/plugin-auth-backend': patch
---

Switched the secure cookie mode set on the `express-session` to use `'auto'` rather than `true`. This works around an issue where cookies would not be set if TLS termination was handled in a proxy rather than having the backend served directly with HTTPS.

The downside of this change is that secure cookies won't be used unless the backend is directly served with HTTPS. This will be remedied in a future update that allows the backend to configured for trusted proxy mode.
