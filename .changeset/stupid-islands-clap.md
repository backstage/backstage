---
'@backstage/plugin-catalog-react': patch
---

To give more flexibility in customizing the layout of the entity overview tab, it is now possible to configure custom entity card types via the `app-config.yaml` file or set them when creating a card extension. This means that any string other than `summary`, `info` or `content` will be accepted as the value of a card extension type `config` or `param`. It is up to the layout component to decide whether to validate and use a custom value.
