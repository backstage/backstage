---
'@backstage/plugin-techdocs': patch
---

Only update the `path` when the content is updated.
If content and path are updated independently, the frontend rendering is triggered twice on each navigation: Once for the `path` change (with the old content) and once for the new content.
This might result in a flickering rendering that is caused by the async frontend preprocessing, and the fact that replacing the shadow dom content is expensive.
