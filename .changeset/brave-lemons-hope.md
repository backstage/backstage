---
'@backstage/plugin-scaffolder': minor
'@backstage/create-app': patch
---

Scaffolder Field Extensions are here! This means you'll now have to change how the `ScaffolderPage` is wired up in your `app/src/App.tsx` to pass in the custom fields to the Scaffolder.

You'll need to move this:

```tsx
<Route path="/create" element={<ScaffolderPage />} />
```

To this:

```tsx
import {
  ScaffolderCustomFields,
  RepoUrlPickerFieldExtension,
  OwnerPickerFieldExtension,
} from '@backstage/plugin-scaffolder';

<Route path="/create" element={<ScaffolderPage />}>
  <ScaffolderCustomFields>
    <RepoUrlPickerFieldExtension />
    <OwnerPickerFieldExtension />
  </ScaffolderCustomFields>
</Route>;
```

Failure to do this will result in no component being rendered for the custom field's like `OwnerPicker` and `RepoUrlPicker`.

More documentation on how to write your own `FieldExtensions` to follow.
