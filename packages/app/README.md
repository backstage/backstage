# example-app

This package is the main example Backstage application using the [new frontend system](../../docs/frontend-system/index.md).

To play with it, open a terminal and run the command: `yarn start`

**NOTE:** Don't forget to open a second terminal and to launch the backend there, using `yarn start`! The frontend requires a backend to connect to.

## NFS routing demo

Three live sibling pages demo different page router adapters (RFC
[#33603](https://github.com/backstage/backstage/issues/33603)), each attached
via `PageRouterBlueprint`:

| Path                         | Page router adapter                         |
| ---------------------------- | ------------------------------------------- |
| `/nfs-routing-demo`          | React Router v6 (app default)               |
| `/nfs-routing-demo-v7`       | `@backstage/plugin-react-router-v7-adapter` |
| `/nfs-routing-demo-tanstack` | `@backstage/plugin-tanstack-router-adapter` |

The v6 and v7 pages share the same tabbed sub-page structure (built with
`SubPageBlueprint`), proving `PageBlueprint`'s native React Router `<Routes>`
composition works unchanged under either adapter. TanStack Router fully owns
its own route tree and has no opaque-children bridge for that tabbed
structure, so its sibling page renders single content instead. Each page
attaches its adapter individually — there is **no** app-wide default router
swap. See
[`src/examples/nfsRoutingDemo.tsx`](./src/examples/nfsRoutingDemo.tsx) for the
shared panel components and the per-page `PageRouterBlueprint` wiring.
