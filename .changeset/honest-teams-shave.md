---
'@backstage/plugin-home-react': patch
'@backstage/plugin-home': patch
---

Export ContentModal from @backstage/plugin-home-react so people can use this in other scenarios.

Make QuickStartCard docsLinkTitle prop more flexible to allow for any React.JSX.Element instead of just a string
