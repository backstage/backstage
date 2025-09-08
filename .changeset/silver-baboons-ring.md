---
'@backstage/frontend-defaults': patch
---

The default app now leverages the new error reporting functionality from `@backstage/frontend-app-api`. If there are critical errors during startup, an error screen that shows a summary of all errors will now be shown, rather than leaving the screen blank. Other errors will be logged as warnings in the console.
