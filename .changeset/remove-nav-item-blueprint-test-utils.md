---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: `renderInTestApp` no longer renders a sidebar or legacy `nav-item` extensions. The app nav extension is now disabled in the minimal test app shell, along with the layout and routes extensions.

If your tests passed `features` containing `nav-item` extensions and asserted on links or labels in that stub sidebar, switch to `renderTestApp` instead — it uses the real app shell and discovers nav items from page extensions.

If you only use `renderInTestApp` to mount a component with APIs or route refs, there is no change.
