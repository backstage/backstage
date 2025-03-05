---
'@backstage/plugin-catalog': minor
---

The default layout of the entity page can now optionally be customized with 3 card types: info, peek and full.

- Cards of type `info` are rendered in a fixed area on the right;
- Cards of type `peek` are rendered on top of the main content area;
- Cards of type `full` and cards with undefined type are rendered as they were before, in the main content area, below the peek cards.

If you want to keep the layout as it was before, you don't need to do anything. But if you want to experiment with the card types and see how they render, here is an example setting the about card to be rendered as an `info` card:

```diff
app:
  extensions:
    # Entity page cards
+   - entity-card:catalog/about:
+       config:
+         type: info # or peek or full
```
