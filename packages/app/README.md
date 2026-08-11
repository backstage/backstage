# example-app

This package is the main example Backstage application using the [new frontend system](../../docs/frontend-system/index.md).

To play with it, open a terminal and run the command: `yarn start`

**NOTE:** Don't forget to open a second terminal and to launch the backend there, using `yarn start`! The frontend requires a backend to connect to.

## Page router demo

The app runs three sibling demo pages, each under a different page router
adapter: `/nfs-routing-demo` on React Router v6, `/nfs-routing-demo-tanstack` on
TanStack Router, and `/nfs-routing-demo-v7` on React Router v7. Their tabs mix
the adapters further, so you can see a TanStack tab inside a v6 page, or a v6
tab inside a TanStack page.

The point of the demo is to make link resolution failures visible without a
debugger. Every panel prints the app-absolute location and the resolved `href`
of each link it renders, so a doubled base path such as `/page/page/sub` shows
up on screen.

Each page attaches its own adapter, so none of this changes the app-wide
default. See
[`src/examples/nfsRoutingDemo.tsx`](./src/examples/nfsRoutingDemo.tsx) for the
panels, the `PageRouterBlueprint` wiring, and a tab-by-tab description of what
each combination covers. The design behind it is
[RFC #33603](https://github.com/backstage/backstage/issues/33603).
