# ecosystem

Welcome to the ecosystem plugin!
This plugin helps to visualize the domains in your ecosystem.

![Domain Explorer](./docs/domains.png)

## Getting started

To install the plugin, include the following import your `plugins.ts`:

```typescript
export { plugin as Ecosystem } from '@backstage/plugin-ecosystem';
```

Add a link to the sidebar in `Root.tsx`:

```typescript
import LayersIcon from '@material-ui/icons/Layers';

...

<SidebarItem icon={LayersIcon} to="ecosystem" text="Explore" />
```
