---
'@backstage/plugin-scaffolder': minor
---

Augment the field parameter of custom validator functions to include the
field's JSON schema. This makes it possible to retrive things like regular
expressions rather than duplicating them in the code.

Given the following template:

```yaml
parameters:
  - title: Custom Fields
    required:
      - emailValue
    properties:
      emailValue:
        title: An email address
        type: string
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$'
        ui:field: EmailValuePicker
```

The custom validator function can reach in and extract the regular expression like so:

```typescript
export const EmailValuePickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'EmailValuePicker',
    component: TextValuePicker,
    validation: (value: string, validation: ExtendedFieldValidation) => {
      const { pattern } = fieldValidation.schema.properties.emailValue;
      const validEmailCheck = new RegExp(pattern);

      if (!validEmailCheck.test(value)) {
        validation.addError('Not a valid email address.');
      }
    },
  }),
);
```
