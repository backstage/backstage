---
'@backstage/ui': minor
---

Updated React Aria dependencies to React Aria Components 1.22.0, React Aria 3.53.0, and React Stately 3.51.0. Existing Checkbox, Radio, and Switch implementations are retained.

**Migration:**

`MenuSection` no longer accepts `disabledKeys`. Move `disabledKeys` to `Menu` or set `isDisabled` on the affected `MenuItem` components.

Programmatic clicks on Checkbox and Switch labels no longer toggle their selection. Target the input when activating these controls programmatically, and use a full pointer interaction when simulating label clicks in tests.

**Affected components:** Checkbox, Menu, Switch
