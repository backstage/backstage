---
'@backstage/backend-common': minor
---

adds a User-Agent header to existing API requests in this package to clearly identify API requests from this Google Cloud Storage. headers are formatted as follows where `userAgent` is the property and the value is `backstage/kubernetes-backend.GkeClusterLocator/${packageinfo.version}`
