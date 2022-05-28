---
'@backstage/plugin-techdocs-react': patch
---

Creates a `TechDocsShadowDom` component that takes a tree of elements and an `onAppend` handler:

- Calls the `onAppend` handler when appending the element tree to the shadow root;
- Also dispatches an event when styles are loaded to let transformers know that the computed styles are ready to be consumed.
