---
id: testing-scaffolder-alpha
title: 'Experimental: Testing out the alpha Scaffolder plugin'
# prettier-ignore
description: Docs on the upcoming breaking release for the scaffolder plugin
---

## What's `scaffolder/next`?

The `alpha` version, or as you might have seen referred to in other places the `scaffolder/next` release, is a new version of the `scaffolder` plugin that will be the first breaking change to the plugin, so you can also think of it as `@backstage/plugin-scaffolder@2.0.0`.
Its mostly a rewrite of a lot of the frontend components and pages that had very limited test coverage, which made adding new features to the `scaffolder` plugin quite hard, and we were lacking in confidence when making changes.

There is of course some other things that have changed when re-writing this, which are essentially what has caused some breaking changes.
Now, this is not like previous scaffolder changes where you would have to change all of your templates as this is only the frontend plugin that is going to have breaking changes. You can read more about the [breaking changes](#breaking-changes) below.

## What's new?

First off, the main dependency that we have for the frontend which is responsible for rendering the `JSONSchema` into `material-ui` components is [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).
This dependency in the current version of the plugin is 3.x.x, which is now 2 major versions out of date. Long story short, `v4` of this plugin contained some bug fixes, and new features but we we're unable to upgrade due to some issues with having support for `material-ui@v4`, so we had to wait for `v5` to be released, and because of the `FieldExtensions` and how they are very tightly coupled to the `react-jsonschema-form` library, we also wanted to make sure that this release was stable before getting people to migrate their `Field Extensions`.

With that in mind, this release has `v5` of `react-jsonschema-form`, and with that comes all the new features and bugfixes in `v4` that we were waiting for - one of the main ones being the ability to use `if / then / else` syntax in the `template.yaml` definitions! 🎉

We've also rebuilt how validation works in the `scaffolder` components, which now means that we've opened the ability to have `async` validation functions in your `Field Extensions`.

Some of the pages have gotten a little bit of an overhaul in terms of UI based on some research and feedback from the community and internally.

- The `TemplateList` page has gotten some new `Card` components which show a little more information than the previous version with a little `material-ui` standards.
- The `WizardPage` has received some new updates with the stepper now running horizontally, and the `Review` step being a dedicated step in the stepper.
- The `OngoingTask` page now does not show the logs by default, and instead has a much cleaner interface for tracking the ongoing steps and the pipeline of actions that are currently showing.
  - You can also now provide your own `OutputsComponent` which can be used to render the outputs from an ongoing / completed task in a way that suits your templates the best. For instance, if your template produces `Pull Requests`, it could be useful to render these in an interactive way where you can see the statuses of each of these `Pull Requests` in the `Ongoing Task` page.

There's also a lot of bug fixes, and other things, but these are the main ones that we wanted to highlight.

## How do I test out the `alpha` version?

With the release of [`v1.11.0`](https://github.com/backstage/backstage/releases/tag/v1.11.0) it's now possible to run the `scaffolder/next` plugin and it be a drop in replacement for the current version that you use today. This means that you can start using the new code, and start testing it out. Once we have collected enough feedback, and squashed any bugs that might block us from releasing, it will be promoted from the `/alpha` exports and replace the existing code leading to breaking changes if you haven't already made these changes as part of this testing pilot. Those that have chosen to opt into this testing pilot means that once we promote it from the `/alpha` exports, you will need to update your code to point to the original exports from the `scaffolder` plugin, just like the code is today but with the [breaking changes](#breaking-changes) that you already made to your `Custom Field Extensions`.

It's also worth calling out that if you do test this out, and find some issues or something not working out as expected, feel free to raise an issue in the [repo](https://github.com/backstage/backstage) or reach out to us on Discord!

### Make the required changes to `App.tsx`

The `ScaffolderPage` router has a completely different export for the `scaffolder/next` work, so you will want to change any import from the old `ScaffolderPage` to the new `NextScaffolderPage`

```tsx
/* highlight-remove-next-line */
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
/* highlight-add-next-line */
import { NextScaffolderPage } from '@backstage/plugin-scaffolder/alpha';
```

And this API should be the exact same as the previous Router, so you should be able to make a change like the following further down in this file:

```tsx
<Route
  path="/create"
  element={
    {/* highlight-remove-next-line */}
    <ScaffolderPage
    {/* highlight-add-next-line */}
    <NextScaffolderPage
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

Optionally, you can choose to run the two side by side by using `FeatureFlags` in your `App.tsx` if you wish, but, we would also recommend duplicating any `CustomFieldExtensions` too as the new `CustomFieldExtensions` might not be compatible with the old form.

```tsx
<FeatureFlagged with="scaffolder-next-preview">
  <Route path="/create" element={<NextScaffolderPage />}>
    <ScaffolderFieldExtensions>
      <DelayingComponentFieldExtension />
    </ScaffolderFieldExtensions>
  </Route>
</FeatureFlagged>
<FeatureFlagged without="scaffolder-next-preview">
  <Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
      <DelayingComponentFieldExtension />
    </ScaffolderFieldExtensions>
  </Route>
</FeatureFlagged>
```

You should then be able to enable the `scaffolder-next-preview` feature flag under `/settings/feature-flags` in Backstage.

### Make the required changes to your `CustomFieldExtensions`

There's differently named function for creating field extensions part of the `/alpha` exports as these are the ones that can contain breaking changes because of the breaking changes that have been applied in `react-jsonschema-form`.

Let's take the following example:

```ts
export const EntityNamePickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: EntityNamePicker,
    name: 'EntityNamePicker',
    validation: entityNamePickerValidation,
    schema: EntityNamePickerSchema,
  }),
);
```

References for `createScaffolderFieldExtension` have an `/alpha` version of `createNextScaffolderFieldExtension`, which should be used instead.

```ts
/* highlight-remove-next-line */
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder';
/* highlight-add-next-line */
import { createNextScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react/alpha';

export const EntityNamePickerFieldExtension = scaffolderPlugin.provide(
  /* highlight-remove-next-line */
  createScaffolderFieldExtension({
  /* highlight-add-next-line */
  createNextScaffolderFieldExtension({
    component: EntityNamePicker,
    name: 'EntityNamePicker',
    validation: entityNamePickerValidation,
  }),
);
```

Once you've done this you will find that you will have two squiggly lines under the properties that are passed in. One for the component and one for the validation (if provided.)

Let's take the following code for the `EntityNamePicker` component:

```tsx
export const EntityNamePicker = (
  props: FieldExtensionComponentProps<string, EntityNamePickerProps>,
) => {
  const {
    onChange,
    required,
    schema: { title = 'Name', description = 'Unique name of the component' },
    rawErrors,
    formData,
    uiSchema: { 'ui:autofocus': autoFocus },
    idSchema,
    placeholder,
  } = props;
  // ..
};
```

There's another `/alpha` export that you need to replace `FieldExtensionComponentProps` with which is the `NextFieldExtensionComponentProps`.

```tsx
/* highlight-remove-next-line */
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
/* highlight-add-next-line */
import { NextFieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react/alpha';

export const EntityNamePicker = (
  /* highlight-remove-next-line */
  props: FieldExtensionComponentProps<string, EntityNamePickerProps>,
  /* highlight-add-next-line */
  props: NextFieldExtensionComponentProps<string, EntityNamePickerProps>,
) => {
  const {
    onChange,
    required,
    schema: { title = 'Name', description = 'Unique name of the component' },
    rawErrors,
    formData,
    /* highlight-remove-next-line */
    uiSchema: { 'ui:autofocus': autoFocus },
    /* highlight-add-next-line */
    uiSchema: { 'ui:autofocus': autoFocus } = {},
    idSchema,
    placeholder,
  } = props;
  // ..
};
```

You'll notice that there's an additional change here, which is that we're now defaulting the `uiSchema` to an empty object. This is because the `uiSchema` is now optional, and if you don't provide it, it will be `undefined` instead of an empty object. There's more around this in the [breaking changes](#breaking-changes) section.

To fix the previous validation error, you will need to change the import for the `FieldValidation` type that is used in the `validation` function.

Let's take the following example of the validation function:

```ts
import { FieldValidation } from '@rjsf/utils';
import { KubernetesValidatorFunctions } from '@backstage/catalog-model';

export const entityNamePickerValidation = (
  value: string,
  validation: FieldValidation,
) => {
  if (!KubernetesValidatorFunctions.isValidObjectName(value)) {
    validation.addError(
      'Must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.',
    );
  }
};
```

You will need to change the import for `FieldValidation` to point at the new `react-jsonschema-form` dependency.

> Note: you will probably need to install this dependency too, by using `yarn add @rjsf/utils` in the package where you define these validation functions, this could also be in the `packages/app` folder, so you can install it there if needed.

```ts
/* highlight-remove-next-line */
- import { FieldValidation } from '@rjsf/core';
/* highlight-add-next-line */
+ import { FieldValidation } from '@rjsf/utils;
import { KubernetesValidatorFunctions } from '@backstage/catalog-model';

export const entityNamePickerValidation = (
  value: string,
  validation: FieldValidation,
) => {
```

## Breaking Changes

Once we fully release the code that is in the `/alpha` exports right now onto the current API and release v2.0.0 of `@backstage/plugin-scaffolder` the breaking changes will be as follows:

### `uiSchema` is now optional

Later releases of `react-jsonschema-form` have made the `uiSchema` optional, and if you don't provide it, it will be `undefined` instead of an empty object. This means that you will need to make sure that you're defaulting the `uiSchema` to an empty object if you're using it in your code.

```tsx
const {
  onChange,
  required,
  schema: { title = 'Name', description = 'Unique name of the component' },
  rawErrors,
  formData,
  /* highlight-remove-next-line */
  uiSchema: { 'ui:autofocus': autoFocus },
  /* highlight-add-next-line */
  uiSchema: { 'ui:autofocus': autoFocus } = {},
  idSchema,
  placeholder,
} = props;
// ..
```

### `formData` can also be `undefined`

If you were using the `formData` and assuming that it was set to an empty object when building `Field Extensions` that return objects, then this will be `undefined` now due to a change in the `react-jsonschema-form` library.

```tsx
const {
  onChange,
  required,
  schema: { title = 'Name', description = 'Unique name of the component' },
  rawErrors,
  /* highlight-remove-next-line */
  formData,
  /* highlight-add-next-line */
  formData = {}, // or maybe some other default value that you would prefer
  uiSchema: { 'ui:autofocus': autoFocus } = {},
  idSchema,
  placeholder,
} = props;
// ..
```
