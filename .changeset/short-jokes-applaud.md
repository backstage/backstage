---
'example-app': minor
'@backstage/core-components': minor
'@backstage/plugin-catalog': minor
'@backstage/plugin-catalog-react': minor
---

Accessibility updates:

- Added `aria-label` to the sidebar Logo link in `example-app`
- Added `aria-label` to the `Select` component in `core-components`
- Changed heading level used in the header of `Table` component in `core-components`
- Added screenreader elements to describe default table `Action` buttons in `plugin-catalog`
- Wrapped the `EntityLifecyclePicker`, `EntityOwnerPicker`, `EntityTagPicker`, in `label` elements in `plugin-catalog-react`
- Changed group name `Typography` component to `span` (from default `h6`), added `aria-label` to the `List` component, and `role` of `menuitem` to the container of the `MenuItem` component in `plugin-catalog-react`
