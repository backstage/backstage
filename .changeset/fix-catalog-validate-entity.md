---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue where `/validate-entity` would not return after sending a 400 response on invalid entity validation, causing an unhandled `ERR_HTTP_HEADERS_SENT` error and triggering duplicate success/fail audit events.
