---
'@backstage/cli': patch
---

Allow relative URLs to be passed as config values for `app.baseUrl` and `backend.baseUrl`. For example, `app.baseUrl` can now be `/`.

Relative URLs are only supported for frontend builds, the backend still needs the full URL defined before run time.
