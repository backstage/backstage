# explore

Welcome to the explore plugin!
This plugin helps to visualize the domains and tools in your ecosystem.

## Getting started

To install the plugin, include the following import your `plugins.ts`:

```typescript
export { explorePlugin } from '@backstage/plugin-explore';
```

Register and bind the route in `App.tsx`:

```typescript
import { ExplorePage, explorePlugin } from '@backstage/plugin-explore';

...

bindRoutes({ bind }) {
  ...
  bind(explorePlugin.externalRoutes, {
    catalogEntity: catalogPlugin.routes.catalogEntity,
  });
},

...

<Route path="/explore" element={<ExplorePage />} />
```

Add a link to the sidebar in `Root.tsx`:

```typescript
import LayersIcon from '@material-ui/icons/Layers';

...

<SidebarItem icon={LayersIcon} to="explore" text="Explore" />
```
