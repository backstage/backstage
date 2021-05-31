---
'@backstage/plugin-scaffolder': patch
---

Scaffolder Field Extensions are here! This means you'll now the ability to create custom field extensions and have the Scaffolder use the components when collecting information from the user in the wizard. By default we supply the `RepoUrlPicker` and the `OwnerPicker`, but if you want to provide some more extensions or override the built on ones you will have to change how the `ScaffolderPage` is wired up in your `app/src/App.tsx` to pass in the custom fields to the Scaffolder.

You'll need to move this:

```tsx
<Route path="/create" element={<ScaffolderPage />} />
```

To this:

```tsx
import {
  ScaffolderFieldExtensions,
  RepoUrlPickerFieldExtension,
  OwnerPickerFieldExtension,
} from '@backstage/plugin-scaffolder';

<Route path="/create" element={<ScaffolderPage />}>
  <ScaffolderFieldExtensions>
    <RepoUrlPickerFieldExtension />
    <OwnerPickerFieldExtension />

    {/*Any other extensions you want to provide*/}
  </ScaffolderFieldExtensions>
</Route>;
```

More documentation on how to write your own `FieldExtensions` to follow.
