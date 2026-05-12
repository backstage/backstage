---
'@backstage/create-app': patch
---

Pinned the Jest version range in app templates to `~30.2.0` to prevent automatic upgrades to Jest 30.4.x, which requires Node.js v24.9+ and breaks tests on Node 22.
