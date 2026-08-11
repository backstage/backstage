# example-app

This package is the main example Backstage application using the [new frontend system](../../docs/frontend-system/index.md).

To play with it, open a terminal and run the command: `yarn start`

**NOTE:** Don't forget to open a second terminal and to launch the backend there, using `yarn start`! The frontend requires a backend to connect to.

## NFS routing demo

Three live sibling pages demo different page router adapters (RFC
[#33603](https://github.com/backstage/backstage/issues/33603)). Each page is
hosted by a different routing library, and each tab proves a combination the
others do not:

| Page (host adapter)                            | Tab         | Combination proved                                  |
| ---------------------------------------------- | ----------- | --------------------------------------------------- |
| `/nfs-routing-demo` (React Router v6, default) | `nested-v6` | React Router v6 nested inside React Router v6       |
|                                                | `tanstack`  | a TanStack sub-page inside a React Router v6 page   |
|                                                | `deep-link` | links resolved three segments below the page base   |
| `/nfs-routing-demo-tanstack` (TanStack Router) | `tanstack`  | a plugin-owned nested TanStack route tree           |
|                                                | `v6-guest`  | a React Router v6 sub-page inside a TanStack page   |
| `/nfs-routing-demo-v7` (React Router v7)       | `v6-guest`  | React Router v6 and v7 route trees in the same app  |
|                                                | `v7-only`   | framework chrome with no React Router v6 in context |

Sub-pages are ordinary routes one level below their page, matched by the app's
own route table, so an adapter is only ever handed the content that is already
showing — including TanStack Router, which could not host a tabbed page at all
while the framework was passing down a React Router `<Routes>` tree. A sub-page
that attaches its own `router` input runs its content under that adapter; one
that does not falls back to the app-plugin default (React Router v6), which is
how the TanStack and v7 pages end up hosting a v6 guest.

Every panel prints the resolved app-absolute URL and the resolved `href` of
each link it renders, so a doubled base path (`/page/page/sub`) is visible on
screen rather than only in devtools. Each page attaches its adapter
individually — there is **no** app-wide default router swap. See
[`src/examples/nfsRoutingDemo.tsx`](./src/examples/nfsRoutingDemo.tsx) for the
panel components and the per-page and per-sub-page `PageRouterBlueprint`
wiring.
