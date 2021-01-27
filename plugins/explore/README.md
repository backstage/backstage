# explore

Welcome to the explore plugin!
This plugin helps to visualize the domains and in your ecosystem.

## Getting started

To install the plugin, include the following import your `plugins.ts`:

```typescript
export { plugin as Ecosystem } from '@backstage/plugin-explore';
```

Add a link to the sidebar in `Root.tsx`:

```typescript
import LayersIcon from '@material-ui/icons/Layers';

...

<SidebarItem icon={LayersIcon} to="explore" text="Explore" />
```
