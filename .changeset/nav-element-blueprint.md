---
'@backstage/plugin-app-react': patch
---

Added `NavElementBlueprint`, which lets plugins add content to the app's navigation that is not a link to a page, such as a list of user shortcuts. Elements only render when the app lists them in the `app/nav` config, which also sets their slot and order. Custom navigation components receive them through the new `navSlots` prop and should render `navSlots.start.rest()` and `navSlots.end.rest()`.
