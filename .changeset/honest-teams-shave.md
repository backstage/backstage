---
'@backstage/plugin-home-react': patch
'@backstage/plugin-home': patch
---

Export ContentModal from `@backstage/plugin-home-react` so people can use this in other scenarios.

Made QuickStartCard `docsLinkTitle` prop more flexible to allow for any React.JSX.Element instead of just a string.
Added QuickStartCard prop `additionalContent` which can eventually replace the prop `video`.
Remove unused styles.
