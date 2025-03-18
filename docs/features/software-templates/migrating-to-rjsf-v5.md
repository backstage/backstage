---
id: migrating-to-rjsf-v5
title: 'Migrating to react-jsonschema-form@v5'
# prettier-ignore
description: Docs on migrating to `react-jsonschema-form`@v5 and the new designs
---

:::note Note

If you were previously using the `/alpha` imports to test out the `scaffolder/next` work, those imports have been promoted to the default exports from the respective packages. You should just have to remove the `/alpha` from the import path, and remove the `Next` from the import name. `NextScaffolderPage` -> `ScaffolderPage`, `createNextScaffolderFieldExtension` -> `createScaffolderFieldExtension` etc.

:::

## What's `react-jsonschema-form`?

This library is core to the frontend part of the scaffolder plugin, and is responsible for rendering the form in which developers and end users fill out to meet the `jsonschema` requirement for the parameters section.

Since the initial release of the `scaffolder` plugin, we we're on a pretty old version of `react-jsonschema-form` (v3), which has been pretty outdated as of late. The problem with us just bumping this library was that there are several breaking changes with the new v5 version, which we've tried pretty aggressively not to pass on to our end users for their templates and [Custom Field Extensions](https://backstage.io/docs/features/software-templates/writing-custom-field-extensions/).

We're hoping that by duplicating the types from version 3 of `react-jsonschema-form` and making these the types that we will support even though the underlying library is v5, it should get us through all of the breaking changes without passing that down.

## What's new?

With that in mind, this release has `v5` of `react-jsonschema-form`, and with that comes all the new features and bugfixes in `v4` that we were waiting for - one of the main ones being the ability to use `if / then / else` syntax in the `template.yaml` definitions! 🎉

We've also rebuilt how validation works in the `scaffolder` components, which now means that we've opened the ability to have `async` validation functions in your `Field Extensions`.

Some of the pages have gotten a little bit of an overhaul in terms of UI based on some research and feedback from the community and internally.

- The `TemplateList` page has gotten some new `Card` components which show a little more information than the previous version with a little `material-ui` standards.
- The `WizardPage` has received some new updates with the stepper now running horizontally, and the `Review` step being a dedicated step in the stepper.
- The `OngoingTask` page now does not show the logs by default, and instead has a much cleaner interface for tracking the ongoing steps and the pipeline of actions that are currently showing.
  - You can also now provide your own `OutputsComponent` which can be used to render the outputs from an ongoing / completed task in a way that suits your templates the best. For instance, if your template produces `Pull Requests`, it could be useful to render these in an interactive way where you can see the statuses of each of these `Pull Requests` in the `Ongoing Task` page.

There's also a lot of bug fixes, and other things, but these are the main ones that we wanted to highlight.

## How do I upgrade

With the release of [`v1.20.0`](https://github.com/backstage/backstage/releases/tag/v1.20.0) these changes should have been made for you. We're hoping that it should be pretty transparent, and things just work as expected. Please reach out to us on [discord](https://discord.com/invite/MUpMjP2) or in a [issue](https://github.com/backstage/backstage/issues/new?assignees=&labels=bug&projects=&template=bug.yaml&title=%F0%9F%90%9B+Bug+Report%3A+%3Ctitle%3E) if you're having issues.

It's possible that if you have a hard dependency on any of the `@rjsf/*` libraries in your app, you'll need to bump these manually to the version that we currently support: `5.13.6` at the time of writing. There could be breaking changes that you will have to fix here however, which we think should be pretty simple, but they're things like changing imports from `@rjsf/core` to `@rjsf/utils`.

```ts
/* highlight-remove-next-line */
import { FieldValidation } from '@rjsf/core';
/* highlight-add-next-line */
import { FieldValidation } from '@rjsf/utils';
```

## Escape hatch

If for some reason the upgrade to [`v1.20.0`](https://github.com/backstage/backstage/releases/tag/v1.20.0) didn't go as planned, there's an escape hatch for use until the next mainline release in which we will try to get any issues fixed before removing the legacy code.

We've moved some of the older exports to an `/alpha` export so you should be able switch to using the old library just in case.

```tsx
/* highlight-remove-next-line */
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
/* highlight-add-next-line */
import { LegacyScaffolderPage } from '@backstage/plugin-scaffolder/alpha';
```

And this API should be the exact same as the previous Router, so you should be able to make a change like the following further down in this file:

```tsx
<Route
  path="/create"
  element={
    {/* highlight-remove-next-line */}
    <ScaffolderPage
    {/* highlight-add-next-line */}
    <LegacyScaffolderPage
      groups={[
        {
          title: 'Recommended',
          filter: entity =>
            entity?.metadata?.tags?.includes('recommended') ?? false,
        },
      ]}
    />
  }
>
  <ScaffolderFieldExtensions>
    <LowerCaseValuePickerFieldExtension />
    {/* ... other extensions */}
  </ScaffolderFieldExtensions>
  <ScaffolderLayouts>
    <TwoColumnLayout />
    {/* ... other layouts */}
  </ScaffolderLayouts>
</Route>
```

And you can also update any of your `CustomFieldExtensions` to use the old helper like so:

```ts
/* highlight-remove-next-line */
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder';
/* highlight-add-next-line */
import { createLegacyScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react/alpha';

export const EntityNamePickerFieldExtension = scaffolderPlugin.provide(
  /* highlight-remove-next-line */
  createScaffolderFieldExtension({
  /* highlight-add-next-line */
  createLegacyScaffolderFieldExtension({
    component: EntityNamePicker,
    name: 'EntityNamePicker',
    validation: entityNamePickerValidation,
  }),
);
```

And in the component themselves, you might have to do the following:

```tsx
/* highlight-remove-next-line */
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
/* highlight-add-next-line */
import { LegacyFieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react/alpha';

export const EntityNamePicker = (
  /* highlight-remove-next-line */
  props: FieldExtensionComponentProps<string, EntityNamePickerProps>,
  /* highlight-add-next-line */
  props: LegacyFieldExtensionComponentProps<string, EntityNamePickerProps>,
) => {
  const {
    onChange,
    required,
    schema: { title = 'Name', description = 'Unique name of the component' },
    rawErrors,
    formData,
    idSchema,
    placeholder,
  } = props;
  // ..
};
```
