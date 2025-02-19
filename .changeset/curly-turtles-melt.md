---
'@backstage/plugin-home': patch
---

- export `ContentModal` from `@backstage/plugin-home` so people can use this in other scenarios.
- make `QuickStartCard` `docsLinkTitle` prop more flexible to allow for any `React.JSX.Element` instead of just a string
