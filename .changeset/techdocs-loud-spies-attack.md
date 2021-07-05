---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-techdocs-backend': minor
---

Rewrite the `/sync/:namespace/:kind/:name` to return an event-stream.
This change allows the sync process to take longer than a normal HTTP timeout.
The stream also emits log events, so the caller can follow the build process in the frontend.
