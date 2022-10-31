---
'@backstage/core-app-api': minor
---

Updated the React Router wiring to make use of the new `basename` property of the router components in React Router v6 stable. To implement this, a new optional `basename` property has been added to the `Router` app component, which can be forwarded to the concrete router implementation in order to support this new behavior. This is done by default in any app that does not have a `Router` component override.
