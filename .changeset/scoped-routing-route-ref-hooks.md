---
'@backstage/frontend-plugin-api': minor
---

`useRouteRef` and `useRouteRefParams` now answer from the app's own routing instead of React Router, so both work on a page that mounts no router at all ([RFC #33603](https://github.com/backstage/backstage/issues/33603)).

- `useRouteRef` resolves against the app's current location, which is the same basename-stripped location every other framework consumer sees. It still resolves against React Router in the old frontend system, so shared plugin code works under both.
- `useRouteRefParams` reads the params out of the route patterns the surrounding page, and the sub-page inside it, are mounted at. Params therefore resolve at page and sub-page depth alike, whether or not the page renders a router. A page that is not mounted at a registered route has no pattern to bind params with, so every declared param comes back `undefined`, and in the old frontend system this hook has no location to read, so use the `@backstage/core-plugin-api` hook of the same name there.
- `useRouteRefParams` now returns exactly the params the passed route ref declares, so the value matches the ref's type rather than carrying whatever else the current URL happened to bind. A declared param the current URL does not bind is present with the value `undefined`, which is what the previous React Router-backed implementation returned for an optional segment the URL left out.
- `useRouteRefParams` no longer returns the splat `*`, which no route ref declares. Code that read the matched tail out of the returned params as `params['*']` now gets `undefined` and needs another source for it.
