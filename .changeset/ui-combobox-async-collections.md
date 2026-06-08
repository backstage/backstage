---
'@backstage/ui': minor
---

`Combobox` now supports async collections, incremental loading, client and server search, and rich or custom item rendering. Loading placeholders expose `.bui-ComboboxLoading` and `.bui-ComboboxLoadingRow`, and stale visible results expose `data-stale` on `.bui-ComboboxList`.

**BREAKING**: The public `ComboboxProps` interface is now a union type.

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

**Affected components:** Combobox
