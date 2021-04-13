---
'@backstage/plugin-techdocs-backend': patch
---

Change the response status of metadata endpoints in case a documentation is not
available to `404 NOT FOUND`. This also introduces the JSON based error messages
used by other backends.
