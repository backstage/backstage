---
'@backstage/plugin-scaffolder': patch
---

- Adds a new field `EntityNamePicker` that can be used in scaffolder templates to accept and validate an entity name. This field is registered by default, and can be used in templates by setting the `ui:field` property to `EntityNamePicker`. If you've customized your scaffolder field extensions, you can include this one by adding it when registering the scaffolder route:

```diff
import {
  ScaffolderFieldExtensions,
+   EntityNamePickerFieldExtension,
} from '@backstage/plugin-scaffolder';

  <Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
      {/* ...custom field extensions... */}

+       <EntityNamePickerFieldExtension />
    </ScaffolderFieldExtensions>
  </Route>;
```

- Adds a new generic field `TextValuePicker` to be used when writing custom field extensions that use a standard UI with custom validation. An example of doing this can be found in `packages/app/src/components/scaffolder/customScaffolderExtensions.tsx`.
