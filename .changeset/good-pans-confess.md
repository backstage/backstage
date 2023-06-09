---
'@backstage/plugin-scaffolder': minor
---

A new `ui:options` configuration `nameTemplate` is added to the `EntityPicker`, `OwnerPicker` and `OwnedEntityPicker` components.
It allows to customize the name of the entity that is displayed in the picker, by using a template string with `entity` as context variable.
It can only be used in combination with the `allowArbitraryValues: false` option.
