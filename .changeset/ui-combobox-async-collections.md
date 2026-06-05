---
'@backstage/ui': minor
---

**BREAKING**: Added async collections, rich item rendering, and nested search configuration to `Combobox`. The public `ComboboxProps` interface is now a union type.

**Migration:**

**Required on upgrade:**

Replace interfaces that extend `ComboboxProps` with type intersections.

```diff
- interface MyComboboxProps extends ComboboxProps {
-   trackingId: string;
- }
+ type MyComboboxProps = ComboboxProps & {
+   trackingId: string;
+ };
```

**Optional migration away from deprecated APIs:**

Prefer `id` instead of `value` for plain options. Existing array-valued options using `value` remain supported as a deprecated compatibility path, but new option content fields and async option sources require `id`.

Move input state and custom filtering into the nested `search` configuration:

```diff
- <Combobox inputValue={query} onInputChange={setQuery} />
+ <Combobox search={{ inputValue: query, onInputChange: setQuery }} />
```

The existing top-level input state props remain supported as a deprecated compatibility path for plain-array `options`.

Pass a BUI-exported `useAsyncList` result directly to `options`, or use `items` with `ComboboxItem`, `ComboboxItemText`, and `ComboboxItemProfile` for custom rendering. Direct async server collections use full options or items for `value`, `defaultValue`, and `onChange`; custom items require a canonical `textValue`, while plain options use their `label`. Dynamic item renderers support React Aria Collection `dependencies`, low-level `ComboboxItem` content owns its internal layout and can opt into the standard selection indicator with `showSelectionIndicator`, and manual loading state is available through `loading`. The `.bui-ComboboxItem` root only applies the standard indicator grid when the built-in indicator is enabled.

Loading placeholders expose the new `.bui-ComboboxLoading` and `.bui-ComboboxLoadingRow` classes. Visible results expose `data-stale` on `.bui-ComboboxList` while a server request is in progress.

**Affected components:** Combobox
