---
'@backstage/ui': minor
---

**BREAKING**: Added async collections, rich item rendering, and nested search configuration to `Select`. The public `SelectProps` interface is now a union type, and Select popover list content is no longer a direct child of `.bui-SelectPopover`.

**Migration:**

**Required on upgrade:**

Replace interfaces that extend `SelectProps` with type intersections.

```diff
- interface MySelectProps extends SelectProps {
-   trackingId: string;
- }
+ type MySelectProps = SelectProps & {
+   trackingId: string;
+ };
```

Update CSS selectors that rely on list content being a direct child of `.bui-SelectPopover`. Select popovers now use the standard BUI Popover content structure, with contents wrapped in `.bui-Box.bui-PopoverContent`. The existing `.bui-Popover.bui-SelectPopover` root classes are unchanged.

**Optional migration away from deprecated APIs:**

Prefer `id` instead of `value` for plain options. Existing array-valued options using `value` remain supported as a deprecated compatibility path, but new option content fields and async option sources require `id`.

Replace `searchable` and `searchPlaceholder` with nested `search` configuration:

```diff
- <Select searchable searchPlaceholder="Search owners" />
+ <Select search={{ placeholder: 'Search owners' }} />
```

Pass a BUI-exported `useAsyncList` result directly to `options`, or use `items` with `SelectItem`, `SelectItemText`, and `SelectItemProfile` for custom rendering. Dynamic item renderers support React Aria Collection `dependencies`, low-level `SelectItem` content owns its internal layout and can opt into the standard selection indicator with `showSelectionIndicator`, and manual loading state is available through `loading`. The `.bui-SelectItem` root only applies the standard indicator grid when the built-in indicator is enabled.

Loading placeholders expose the new `.bui-SelectLoading` and `.bui-SelectLoadingRow` classes. Retained results expose `data-stale` on `.bui-SelectList` while a server request is in progress.

**Affected components:** Select
