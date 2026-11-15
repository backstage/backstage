---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

GitLab discovery entity provider: catalog locations and refresh keys resulting from push events are now derived from the project record fetched from the GitLab API, instead of fields of the event payload. Committed file paths that do not resolve within the project itself are ignored.
