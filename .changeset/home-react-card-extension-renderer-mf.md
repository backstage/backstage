---
'@backstage/plugin-home-react': patch
---

Fixed `CardExtension` to avoid calling `useApp()` when a custom `Renderer` is provided.

This allows home widgets loaded via module federation (which may not have legacy app context) to render with a custom renderer without throwing "App context is not available".
