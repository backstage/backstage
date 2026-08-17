---
'@backstage/plugin-app': patch
---

Fixed config-driven route redirects to preserve the query string and fragment from the original URL. Previously, redirects declared under `app.extensions[].app/routes.config.redirects` silently dropped everything after `?` or `#` in the incoming URL.
