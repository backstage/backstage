---
'@backstage/plugin-scaffolder': patch
---

Enabling the customization of the last page in the scaffolder template.

To override the content you have to do the next:

```typescript jsx
scaffolderPlugin.__experimentalReconfigure({
  lastStepFormComponent: (props: LastStepFormProps) => (
    <YourCustomComponent {...props} />
  ),
});
```
