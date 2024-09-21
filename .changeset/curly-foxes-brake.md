---
'@backstage/plugin-scaffolder': patch
---

Apply `defaultValue` props in `MultiEntityPicker`

```diff
  <Autocomplete
    multiple
    filterSelectedOptions
    disabled={entities?.entities?.length === 1}
    id={idSchema?.$id}
+   defaultValue={formData}
```
