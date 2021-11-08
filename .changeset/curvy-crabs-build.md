---
'@backstage/plugin-scaffolder': minor
---

Added changes so as to enable addition of custom components in scaffolder.

registerComponent() takes name, component and validation and adds them into an array.
Later, that array is read from scaffolder/src/components/Router.tsx and the custom components are included.
