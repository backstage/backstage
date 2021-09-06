---
'@backstage/core-components': patch
---

Fix warning produced by BottomLink component

During development, we noticed warnings such as:

```
react_devtools_backend.js:2842 Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
```

The BottomLink component renders a Box component within a Typography component which leads to a div tag within a p tag.
This change inverts that ordering without changing the visual appearance.
