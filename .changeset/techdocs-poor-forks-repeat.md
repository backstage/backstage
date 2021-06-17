---
'@backstage/plugin-techdocs-backend': patch
---

Return a `304 Not Modified` from the `/sync/:namespace/:kind/:name` endpoint if nothing was built. This enables the caller to know whether a refresh of the docs page will return updated content (-> `201 Created`) or not (-> `304 Not Modified`).
