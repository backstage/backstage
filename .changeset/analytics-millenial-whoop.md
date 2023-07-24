---
'@backstage/core-app-api': patch
---

Fixed a bug that could cause `navigate` analytics events to be misattributed to the plugin mounted on the root route (e.g. the `home` plugin at `/`) when the route that was navigated to wasn't associated with a routable extension.
