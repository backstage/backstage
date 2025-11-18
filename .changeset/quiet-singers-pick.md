---
'@backstage/plugin-signals': patch
---

Fixes a bug where the `SignalClient` would try to subscribe to the same channel twice after an error, instead of just once.
