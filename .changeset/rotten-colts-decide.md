---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': minor
---

**BREAKING** Allow incremental event handlers to be async; Force event handler
to indicate if it made a change. Instead of returning `null` or `undefined` from an event
handler to indicate no-oop, instead return the value { type: "ignored" }.

**before**

```javascript
import { createDelta, shouldIgnore } from "./my-delta-creater";

eventHandler: {
  onEvent(params) {
    if (shouldIgnore(params)) {
      return;
    }
    return createDelta(params);
  }
}
```

**after**

```javascript
import { createDelta, shouldIgnore } from "./my-delta-creater";

eventHandler: {
  async onEvent(params) {
    if (shouldIgnore(params) {
      return { type: "ignored" };
    }
    // code to create delta can now be async if needed
    return await createDelta(params);
  }
}
```
