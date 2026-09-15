---
'@backstage/frontend-app-api': patch
---

The app now owns browser history in the new frontend system and provides it to plugins as `appHistoryApiRef`, as part of scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). Route resolution and analytics route tracking both read that history rather than a router component at the app root, and top level pages are matched against it instead of against a React Router route tree.

Nested route-bearing extensions share the same matching rules for rendered content, route references and navigation tracking. Parent-relative links follow extension ancestry, and static routes with spaces or Unicode characters match their browser-encoded URLs. Browser Back and Forward navigation notify the app consistently.

Backstage UI links resolve clicks against the same page scope as their rendered hrefs, including relative paths, query strings, fragments and parent routes.
