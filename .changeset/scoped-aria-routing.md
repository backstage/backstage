---
'@backstage/frontend-plugin-api': minor
---

Added `useAppRouting` to bind href resolution and navigation to the same page or sub-page. Pass its `createHref` and `navigate` callbacks to React Aria's `RouterProvider` to support relative destinations, deployment basenames, and navigation state consistently.

Removed the unused second argument to `AppHistoryApi.createHref`. Use `useAppRouting` to resolve and navigate scoped destinations.
