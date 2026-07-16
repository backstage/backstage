---
'@backstage/plugin-home-react': patch
---

Fixed `CardExtension` to avoid requiring app context when a custom `Renderer` is provided.

Custom renderer widgets are rendered in a separate component path that does not call `useApp()`, so home widgets loaded via module federation can render without throwing "App context is not available".
