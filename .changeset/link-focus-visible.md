---
'@backstage/ui': patch
---

Fix `Card href=...` not showing a focus indicator on keyboard navigation. `Link` now composes `useFocusRing`, emits `data-focus-visible`, and renders a `--bui-ring` outline when keyboard-focused. The Card's existing focus-ring CSS matches when the trigger is focused.

_Affected components_: Card, Link
