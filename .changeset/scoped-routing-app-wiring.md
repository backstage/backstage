---
'@backstage/frontend-app-api': patch
---

The app now owns browser history for the new frontend system and provides it to plugins as `appHistoryApiRef`, as part of scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)). Top level pages are matched and rendered from the app's own route table, and route tracking for analytics follows the app history instead of a router component at the app root.

This also fixes three routing problems:

- A page no longer loses its state when the user moves between two URLs that the same page serves, for example from one entity to another. Scroll position, open dialogs and in-progress form input survive the navigation instead of the page being rebuilt from scratch.
- A URL containing malformed percent-encoding, such as a stray `%` in a path segment, no longer fails route matching and leaves the app blank. The segment is used as written instead.
- A static route now wins over a parameterised one that could also match, regardless of how many segments each has, so a page registered at a fixed path is no longer shadowed by another plugin's wildcard.
