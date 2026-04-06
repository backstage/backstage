---
'@backstage/frontend-app-api': patch
---

Wrapped extension permission authorization in a try/catch to surface errors as `ForwardedError` with a clear message.
