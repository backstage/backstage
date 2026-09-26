---
id: extension-route-reference-migration
title: Extension Route Reference Migration
description: Migrate new frontend system route references to target extension IDs
---

Route references in the new frontend system identify their target by extension
ID. This guide covers updating plugins that already use the new frontend system.
For plugins using the old frontend system, see the
[plugin migration guide](../frontend-system/building-plugins/05-migrating.md).

## Target a routable extension

Add `extensionId` to each `createRouteRef` call. Use the ID of the page or subpage
extension that provides the route:

```ts
const rootRouteRef = createRouteRef({ extensionId: 'page:example' });
```

Keep `params` unchanged and ensure they match the target extension's route path.
Remove the corresponding `routeRef` parameter from `PageBlueprint` or
`SubPageBlueprint`.

Replace `aliasFor` with the target extension's ID. For example, replace
`aliasFor: 'example.root'` with `extensionId: 'page:example'` when that named
route points to `page:example`.

## Override pages from existing plugins

Previously compiled plugins continue to work with their existing route
references. When overriding a page that uses a historical reference, keep
passing that reference from the plugin's `routes` to the replacement page's
`routeRef` parameter.

If the reference already targets an extension ID, replacing the extension with
that same ID automatically directs the reference to the replacement page.
