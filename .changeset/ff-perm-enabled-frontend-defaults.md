---
'@backstage/frontend-defaults': patch
---

Updated `createApp` to await the now-async `finalize()` call from `prepareSpecializedApp`, enabling permission-gated extensions to be resolved before the app tree is rendered.
