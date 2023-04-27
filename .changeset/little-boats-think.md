---
'@backstage/plugin-catalog-react': minor
---

`EntityOwnerPicker` now loads entities asynchronously

**BREAKING**: In order to improve the performance of the component, the users and groups displayed by `EntityOwnerPicker` aren't inferred
anymore by the entities available in the `EntityListContext` and will no longer react to changes in the filters of `EntityListContext`.
Instead, the entities are displayed in batches, loaded asynchronously on scroll and filtered server side.
