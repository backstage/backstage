---
'@backstage/plugin-app-react': patch
---

Added `NavElementBlueprint`, which lets plugins add content to the app's navigation that is not a link to a page, such as a list of user shortcuts. Each element goes in the `start` or `end` slot, before or after the page links, and apps can move, order or disable it through configuration. Custom navigation components receive the elements through the new `navSlots` prop and should render `navSlots.start.rest()` and `navSlots.end.rest()`.
