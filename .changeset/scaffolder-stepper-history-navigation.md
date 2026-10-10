---
'@backstage/plugin-scaffolder-react': patch
---

Fixed the scaffolder `Stepper` ignoring browser back/forward navigation. Previously, using the browser's (or a mouse's) back/forward buttons while filling out a template would skip the whole wizard and land on whichever page was open before the template was opened. The wizard now steps back and forward through its own steps first, matching the on-page Back/Next buttons, including re-validating the current step's data before a forward navigation is allowed to proceed.
