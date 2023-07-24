---
'@backstage/plugin-home': patch
---

Make sure the function `handleLayoutChange` only updates the widgets if the
layout has changed.

In some cases, if the settings are not stored in the browser and the user
clicks on the "Edit" button, this function could be triggered in a loop and cause
the browser to freeze.
