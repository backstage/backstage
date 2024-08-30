---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added support for defining `replaces` in `createExtensionInput` which will allow extensions to redirect missing `attachTo` points to an input of the created extension.

```ts
export const AppThemeApi = ApiBlueprint.makeWithOverrides({
  name: 'app-theme',
  inputs: {
    themes: createExtensionInput([ThemeBlueprint.dataRefs.theme], {
      // attachTo: { id: 'app', input: 'themes'} will be redirected to this input instead
      replaces: [{ id: 'app', input: 'themes' }],
    }),
  },
  factory: () {
    ...
  }
});
```
