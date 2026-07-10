# example-app

This package is the main example Backstage application using the [new frontend system](../../docs/frontend-system/index.md).

To play with it, open a terminal and run the command: `yarn start`

**NOTE:** Don't forget to open a second terminal and to launch the backend there, using `yarn start`! The frontend requires a backend to connect to.

## NFS routing demo

Three live sibling pages share the exact same library-agnostic
[`RouteDescriptor`](../frontend-plugin-api/src/routing/RouteDescriptor.ts)
tree on a `PageBlueprint` page (RFC
[#33603](https://github.com/backstage/backstage/issues/33603)), each attached
to a different page router adapter via `PageRouterBlueprint`:

| Path                         | Page router adapter                         |
| ---------------------------- | ------------------------------------------- |
| `/nfs-routing-demo`          | `@backstage/plugin-react-router-v6-adapter` |
| `/nfs-routing-demo-v7`       | `@backstage/plugin-react-router-v7-adapter` |
| `/nfs-routing-demo-tanstack` | `@backstage/plugin-tanstack-router-adapter` |

Each page attaches its adapter individually — there is **no** app-wide
default router swap. See
[`src/examples/nfsRoutingDemo.tsx`](./src/examples/nfsRoutingDemo.tsx) for the
shared descriptor tree and the per-page `PageRouterBlueprint` wiring.
