---
'@backstage/plugin-scaffolder': patch
---

Enabling the customization of the last step in the scaffolder template.

To override the content you have to do the next:

```typescript jsx
<TemplatePage ReviewStepComponent={YourCustomComponent} />
```
