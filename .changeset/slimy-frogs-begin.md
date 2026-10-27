---
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': minor
---

Add support for request query strings.

Add `contentType` to `RequestRejectionDetails` to support both `text/plain` and `application/json` content types.
This is required to enable MSGraph webhook events.
