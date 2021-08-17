---
'@backstage/plugin-scaffolder': patch
---

Previously when supplying custom scaffolder field extensions, it was necessary to also include the default ones if they were needed. Since the field extensions are keyed by name, there's no harm in leaving the default ones in place when adding custom ones - if templates don't refer to them they will be ignored, and if custom ones are introduced with the same name, the custom ones will take priority over the default ones.

Users configuring custom field extensions can remove the default ones from the scaffolder route after this change, and they'll still be available:

```diff
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
-        <EntityPickerFieldExtension />
-        <EntityNamePickerFieldExtension />
-        <RepoUrlPickerFieldExtension />
-        <OwnerPickerFieldExtension />
        <LowerCaseValuePickerFieldExtension />
      </ScaffolderFieldExtensions>
    </Route>
```
