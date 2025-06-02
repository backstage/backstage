---
'@backstage/core-components': patch
---

This adds a `subMenuType` property to the `subMenuOptions` prop on the sidebar to choose a different submenu rendering layout. The types to choose from are `default` and `popper`. The `default` type keeps the original submenu layout, whilst the `popper` type allow the submenu to render as a Material UI Popper component, anchored near the menu item containing the submenu, for easier accessibility.
