---
'@backstage/core-components': patch
---

`MarkdownContent` now loads `react-markdown` and its `remark` and `rehype` plugins the first time it renders, instead of with the app. This keeps them out of the app's startup bundle. Markdown appears once the renderer has loaded, so tests that look for rendered markdown right after a synchronous `render` may need to use `findBy*` queries instead.
