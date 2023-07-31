---
'@backstage/plugin-newrelic': patch
---

The newrelic plugin now supports pagination when retrieving results from newrelic. It will no longer truncate results. To see all applications, the link header will need to be allowed through the proxy (see the newrelic plugin readme).
