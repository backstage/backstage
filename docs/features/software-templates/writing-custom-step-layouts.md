---
id: writing-custom-step-layouts
title: Writing custom step layouts
description: How to override the default step form layout
---

Every form in each step rendered in the frontend uses the default form layout from [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/). It is possible to override this behaviour by supplying a `ui:ObjectFieldTemplate` property for a particular step:

```yaml
parameters:
  - title: Fill in some steps
    ui:ObjectFieldTemplate: TwoColumn
```

This is the same [field](https://rjsf-team.github.io/react-jsonschema-form/docs/advanced-customization/custom-templates#objectfieldtemplate) used by [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/) but we need to add a couple of steps to ensure that the string value of `TwoColumn` above is resolved to a react component.

## Registering a React component as a custom step layout

The [createScaffolderLayout](https://backstage.io/docs/reference/plugin-scaffolder-react.createscaffolderlayout) function is used to mark a component as a custom step layout:

```ts
import React from 'react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  createScaffolderLayout,
  LayoutTemplate,
} from '@backstage/plugin-scaffolder-react';
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

export const TwoColumnLayout = scaffolderPlugin.provide(
  createScaffolderLayout({
    name: 'TwoColumn',
    component: TwoColumn,
  }),
);
```

After you have registered your component as a custom layout then you need to provide the `layouts` to the `ScaffolderPage`:

```tsx
import { MyCustomFieldExtension } from './scaffolder/MyCustomExtension';
import { TwoColumnLayout } from './components/scaffolder/customScaffolderLayouts';

const routes = (
  <FlatRoutes>
    ...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderLayouts>
        <TwoColumnLayout />
      </ScaffolderLayouts>
    </Route>
    ...
  </FlatRoutes>
);
```

## Using the custom step layout

Any component that has been passed to the `ScaffolderPage` as children of the `ScaffolderLayouts` component can be used as a `ui:ObjectFieldTemplate` in your template file:

```yaml
parameters:
  - title: Fill in some steps
    ui:ObjectFieldTemplate: TwoColumn
```
