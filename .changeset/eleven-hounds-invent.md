---
'@backstage/cli': patch
---

In frontend builds and tests `process.env.HAS_REACT_DOM_CLIENT` will now be defined if `react-dom/client` is present, i.e. if using React 18. This allows for conditional imports of `react-dom/client`.
