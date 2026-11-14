---
'@backstage/plugin-app': patch
---

Ensure dismissed toasts are marked as closed in `ToastApiForwarder` so they are not replayed when `ToastDisplay` remounts (such as during theme changes).
