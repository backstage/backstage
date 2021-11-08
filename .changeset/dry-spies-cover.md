---
'@backstage/core-components': patch
'@backstage/theme': patch
---

Added a warning variant to `DismissableBanner` component. If you are using a
custom theme, you will need to add the optional `palette.banner.warning` color,
otherwise this variant will fall back to the `palette.banner.error` color.
