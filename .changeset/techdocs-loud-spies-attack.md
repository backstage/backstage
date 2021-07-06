---
'@backstage/plugin-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
---

Rewrite the `/sync/:namespace/:kind/:name` endpoint to support an event-stream as response.
This change allows the sync process to take longer than a normal HTTP timeout.
The stream also emits log events, so the caller can follow the build process in the frontend.
