---
'@backstage/plugin-app': patch
---

Updated the default `DialogApi` implementation to support the new `open` method. The dialog display layer no longer renders any dialog chrome — callers provide their own dialog component. The deprecated `show` and `showModal` methods now use `open` internally with a Material UI dialog wrapper for backward compatibility.
