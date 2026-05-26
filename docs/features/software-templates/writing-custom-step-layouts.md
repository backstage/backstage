---
id: writing-custom-step-layouts
title: Writing custom step layouts
description: How to override the default step form layout
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./writing-custom-step-layouts--old.md)
instead.
::::

Every form in each step rendered in the frontend uses the default form layout from [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/). It is possible to override this behaviour by supplying a `ui:ObjectFieldTemplate` property for a particular step:

```yaml
parameters:
  - title: Fill in some steps
    ui:ObjectFieldTemplate: TwoColumn
```

This is the same [field](https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-templates#objectfieldtemplate) used by [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/) but we need to add a couple of steps to ensure that the string value of `TwoColumn` above is resolved to a react component.

## Registering a React component as a custom step layout

The scaffolderLayoutBlueprint is used to mark a component as a custom step layout:

```tsx
import { LayoutTemplate } from '@backstage/plugin-scaffolder-react';
import { scaffolderLayoutBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { Grid } from '@material-ui/core';

const TwoColumn: LayoutTemplate = ({ properties, description, title }) => {
  const mid = Math.ceil(properties.length / 2);

  return (
    <>
      <h1>{title}</h1>
      <h2>In two column layout!!</h2>
      <Grid container justifyContent="flex-end">
        {properties.slice(0, mid).map(prop => (
          <Grid item xs={6} key={prop.content.key}>
            {prop.content}
          </Grid>
        ))}
        {properties.slice(mid).map(prop => (
          <Grid item xs={6} key={prop.content.key}>
            {prop.content}
          </Grid>
        ))}
      </Grid>
      {description}
    </>
  );
};

export const TwoColumnLayout = scaffolderLayoutBlueprint.make({
  name: 'two-column-layout',
  params: {
    layout: {
      name: 'TwoColumn',
      component: TwoColumn,
    },
  },
});
```

Once the layout is created, install it in your app by wrapping it in a frontend module and passing it to `createApp`:

```tsx title="packages/app/src/scaffolder/scaffolderModule.ts"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { TwoColumnLayout } from './TwoColumnLayout';

export const scaffolderLayoutModule = createFrontendModule({
  pluginId: 'scaffolder',
  extensions: [TwoColumnLayout],
});
```

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { scaffolderLayoutModule } from './scaffolder/scaffolderModule';

const app = createApp({
  features: [scaffolderLayoutModule],
});

export default app.createRoot();
```

## Using the custom step layout

Any layout that has been registered to `createApp` can be used as a `ui:ObjectFieldTemplate` in your template file:

```yaml
parameters:
  - title: Fill in some steps
    ui:ObjectFieldTemplate: TwoColumn
```
