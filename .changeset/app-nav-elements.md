---
'@backstage/plugin-app': patch
---

The app navigation now renders content that plugins add through `NavElementBlueprint`, before and after the page links, and passes it to custom navigation components through the `navSlots` prop.
