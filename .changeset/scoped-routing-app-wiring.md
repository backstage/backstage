---
'@backstage/frontend-app-api': patch
---

The app now owns browser history for the new frontend system and provides it to plugins as `appHistoryApiRef`, as part of scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). Top level pages are matched and rendered from the app's own route table, and route tracking for analytics follows the app history instead of a router component at the app root.
