---
id: writing-custom-field-extensions
title: Writing Custom Field Extensions
description: How to write your own field extensions
---

Collecting input from the user is a very large part of the scaffolding process
and Software Templates as a whole. Sometimes the built in components and fields
just aren't good enough, and sometimes you want to enrich the form that the
users sees with better inputs that fit better.

This is where `Custom Field Extensions` come in.

With them you can show your own `React` Components and use them to control the
state of the JSON schema, as well as provide your own validation functions to
validate the data too.

## Creating a Field Extension

Field extensions are a way to combine an ID, a `React` Component and a
`validation` function together in a modular way that you can then use to pass to
the `Scaffolder` frontend plugin in your own `App.tsx`.

You can create your own Field Extension by using the
`createScaffolderFieldExtension` `API` like below:

```tsx
//packages/app/scaffolder/MyCustomExtension/MyCustomExtension.tsx
import { FieldProps } from '@rjsf/core';
export const MyCustomExtension = ({ onChange, required }: FieldProps<string>) => {
  return (
     <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
  )
};
```

```tsx
// packages/app/scaffolder/MyCustomExtension/validation.ts
import { FieldValidation } from '@rjsf/core';
import { KubernetesValidatorFunctions } from '@backstage/catalog-model';

export const myCustomValidation = (
  value: string,
  validation: FieldValidation,
) => {
  if (!KubernetesValidatorFunctions.isValidObjectName(value)) {
    validation.addError(
      'must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.',
    );
  }
};
```
