---
'@backstage/plugin-tanstack-router-adapter': patch
---

Adds a TanStack Router page adapter that compiles route descriptors into a TanStack route tree and projects the scoped routing contract into history without writing browser history. Pages can opt in via a page router override or register the adapter as the default page router.

The adapter reports that opaque React Router children are unsupported — pages must use route descriptors (or keep a React Router adapter). TanStack page history blockers register into the shared framework blocker seam so adapter and chrome navigations share the same policy.
