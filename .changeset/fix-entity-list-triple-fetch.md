---
'@backstage/plugin-catalog-react': patch
---

Fixed redundant API calls during entity list initialization. Filter components that register their initial state in quick succession (e.g. `EntityKindPicker`, `UserListPicker`, `EntityTagPicker`) no longer trigger multiple identical fetches. Frontend-only filter changes such as toggling the user list are now applied synchronously without a network round-trip.
