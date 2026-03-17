---
'@backstage/frontend-defaults': patch
---

Updated `createApp` to use the phased `prepareSpecializedApp` flow, allowing apps to render a bootstrap tree before the full app is finalized.
