---
'@backstage/core-components': patch
---

Component `MarkdownContent` can now render HTML. This functionality is opt-in, to enable it you can use the following snippet:

```ts
const input = `<div class="note">
      Backstage is <strong>awesome</strong>!
    </div>`;
<MarkdownContent content={input} allowHTML={true} />;
```
