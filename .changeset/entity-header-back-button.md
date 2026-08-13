---
'@backstage/plugin-catalog': minor
'@backstage/ui': minor
---

Added an opt-in back button to the entity page header that navigates to the page the user came from. Enable it by passing `showBackButton` to `EntityHeaderBui` or `EntityLayoutBui`. The button uses the Navigation API to detect the entry point and remains stable across tab switches within the entity page.

Added a `leadingAction` prop to the `Header` component that renders content inline before the tags row.
