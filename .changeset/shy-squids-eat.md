---
'@backstage/plugin-catalog-react': patch
---

Make `EntityRefLink` a `React.forwardRef` in order to use it as root component in other components like `ListItem`.
