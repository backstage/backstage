---
'@backstage/plugin-scaffolder': patch
---

Form data is now passed to validator functions in 'next' scaffolder, so it's now possible to perform validation for fields that depend on other field values. This is something that we discourage due to the coupling that it creates, but is sometimes still the most sensible solution.

```typescript jsx
export const myCustomValidation = (
  value: string,
  validation: FieldValidation,
  { apiHolder, formData }: { apiHolder: ApiHolder; formData: JsonObject },
) => {
  // validate
};
```
