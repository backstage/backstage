---
'@backstage/plugin-home': patch
---

Added a `variant` prop to the `WelcomeTitle` component making it work with the Customizable Home page feature. Adding it like this `<WelcomeTitle variant='h1' />` to the list of items under `CustomHomepageGrid` will allow it to render with a size that works well.
