---
'@backstage/plugin-techdocs-backend': patch
---

Fixed a bug affecting those with cache enabled that would result in empty content being cached if the first attempt to load a static asset from storage were made via a `HEAD` request, rather than a `GET` request.
