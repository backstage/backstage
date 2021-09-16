---
id: integrating-plugin-into-software-catalog
title: Integrate into the Software Catalog
description: How to integrate a plugin into software catalog
---

> This is an advanced use case and currently is an experimental feature. Expect
> API to change over time

## Steps

1. [Create a plugin](#create-a-plugin)
1. [Reading entities from within your plugin](#reading-entities-from-within-your-plugin)
1. [Import your plugin and embed in the entities page](#import-your-plugin-and-embed-in-the-entities-page)

### Create a plugin

Follow the [same process](create-a-plugin.md) as for standalone plugin. You
should have a separate package in a folder, which represents your plugin.

Example:

```
$ yarn create-plugin
> ? Enter an ID for the plugin [required] my-plugin
> ? Enter the owner(s) of the plugin. If specified, this will be added to CODEOWNERS for the plugin path. [optional]

Creating the plugin...
```

### Reading entities from within your plugin

You can access the currently selected entity using the backstage api
`useEntity`. For example,

```tsx
import { useEntity } from '@backstage/plugin-catalog-react';

export const MyPluginEntityContent = () => {
  const { entity, loading, error, refresh } = useEntity();

  // Do something with the entity data...
};
```

Internally `useEntity` makes use of
[react `Context`s](https://reactjs.org/docs/context.html). The entity context is
provided by the entity page into which your plugin will be embedded.

### Import your plugin and embed in the entities page

To begin, you will need to import your plugin in the entities page. Located at
`packages/app/src/components/Catalog/EntityPage.tsx` from the root package of
your backstage app.

```tsx
import { MyPluginEntityContent } from '@backstage/plugin-my-plugin;
```

To add your component to the Entity view, you will need to modify the
`packages/app/src/components/Catalog/EntityPage.tsx`. Depending on the needs of
your plugin, you may only care about certain kinds of
[entities](https://backstage.io/docs/features/software-catalog/descriptor-format),
each of which has its own
[element](https://reactjs.org/docs/rendering-elements.html) for rendering. This
functionality is handled by the `EntitySwitch` component:

```tsx
export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
```

At this point, you will need to modify the specific page where you want your
component to appear. If you are extending the Software Catalog model you will
need to add a new case to the `EntitySwitch`. For adding a plugin to an existing
component type, you modify the existing page. For example, if you want to add
your plugin to the `systemPage`, you can add a new tab by adding an
`EntityLayout.Route` such as below:

```tsx
const systemPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntitySystemDiagramCard />
    </EntityLayout.Route>

    {/* Adding a new tab to the system view */}
    <EntityLayout.Route path="/your-custom-route" title="CustomTitle">
      <MyPluginEntityContent />
    </EntityLayout.Route>
  </EntityLayout>
);
```
