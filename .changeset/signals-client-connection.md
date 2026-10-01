---
'@backstage/plugin-signals': patch
---

The signals client now shares one WebSocket connection across simultaneous subscriptions and does not connect or retry when no identity token is available.
