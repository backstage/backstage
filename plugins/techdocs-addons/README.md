# @backstage/plugin-techdocs-addons

Package encapsulating the TechDocs Addon framework.

## What is an addon?

An addon is a isolated piece of functionality that one can use to augment the
TechDocs experience at render-time. For example: an issue counter showing the
number of issues reported on the documentation, or the top contributors to the
documentation.

## Create a new addon

To create a new addon, you can use the `createTechDocsAddon` factory exported
from this plugin. Normally, addons are provided by Backstage plugins, which can
then be composed within a Backstage app.

When you create a new Addon, it requires three things.

1. A `name` for debugging and analytics purposes)
2. A `location`, indicating where/how the addon will be rendered
3. A `component`, encapsulating the addon's logic and functionality

```tsx
import {
  createTechDocsAddon,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-addons';
import { StackOverflowSecondarySidebarAddon } from './components';

export const StackOverflowSecondarySidebar = yourBackstagePlugin.provide(
  createTechDocsAddon({
    name: 'StackOverflowSecondarySidebar',
    type: TechDocsAddonLocations.SECONDARY_SIDEBAR,
    component: StackOverflowSecondarySidebarAddon,
  }),
);
```

## Compose your app with addons

To configure which addons will augment the TechDocs experience in your
Backstage app, you need two things:

- The `TechDocsAddons` component, which is responsible for registering the
  addons.
- A list of the addons themselves, as exported by their respective plugins.

```tsx
import {
  TechDocsAddons,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs-addons';
import { StackOverflowSecondarySidebar } from '@backstage/plugin-soe';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  <TechDocsAddons>
    <StackOverflowSecondarySidebar />
  </TechDocsAddons>
</Route>;
```
