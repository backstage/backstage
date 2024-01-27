---
'@backstage/frontend-app-api': patch
---

Added `IconsApi` implementation and the ability to configure icons through the `icons` option for `createApp` and `createSpecializedApp`. This is not a long-term solution as icons should be installable via extensions instead. This is just a stop-gap to make sure there is feature parity with the existing frontend system.
