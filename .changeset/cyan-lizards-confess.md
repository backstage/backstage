---
'@backstage/backend-common': patch
---

Fix HTTPS certificate generation and add new config switch, enabling it simply by setting `backend.https = true`. Also introduces caching of generated certificates in order to avoid having to add a browser override every time the backend is restarted.
