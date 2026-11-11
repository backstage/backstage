# example-app

This package is the main example Backstage application using the [new frontend system](../../docs/frontend-system/index.md).

To play with it, open a terminal and run the command: `yarn start`

**NOTE:** Don't forget to open a second terminal and to launch the backend there, using `yarn start`! The frontend requires a backend to connect to.

## Page router demo

The app runs three sibling demo pages, each leading with a different routing
library: `/nfs-routing-demo` with React Router v6, `/nfs-routing-demo-tanstack`
with TanStack Router, and `/nfs-routing-demo-v7` with React Router v7. The
framework keeps a root React Router v6 context for shared UI. Migrated pages and tabs declare adapters inside their lazily loaded React components. One tab
deliberately declares nothing to demonstrate implicit React Router v6
compatibility alongside framework navigation. Pages using only framework
routing need no adapter.

The demo makes link resolution failures visible without a debugger. Every panel
prints the app-absolute location and the resolved `href` of each link it
renders, so a doubled base path such as `/page/page/sub` shows up on screen.

Adapters are added rather than selected, so nothing here overrides anything:
a sub-page's adapter nests inside whatever its page declared, which is what
lets a TanStack tab sit beside a React Router v6 tab. See
[`src/examples/nfsRoutingDemo.tsx`](./src/examples/nfsRoutingDemo.tsx) for the
panels, how each tab declares its adapter, and a tab-by-tab description of what
each combination covers. The design behind it is
[RFC #33603](https://github.com/backstage/backstage/issues/33603).
