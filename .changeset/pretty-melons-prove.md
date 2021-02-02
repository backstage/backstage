---
'@backstage/plugin-fossa': minor
---

Port FOSSA plugin to new extension model.

If you are using the FOSSA plugin adjust the plugin import from `plugin` to
`fossaPlugin` and replace `<FossaCard entity={...} ...>` with `<EntityFossaCard />`.
