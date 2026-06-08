---
'@backstage/ui': minor
---

`Select` now supports async collections, incremental loading, client and server search, and rich or custom item rendering. Loading placeholders expose `.bui-SelectLoading` and `.bui-SelectLoadingRow`, and stale retained results expose `data-stale` on `.bui-SelectList`.

**BREAKING**: The public `SelectProps` interface is now a union type, and Select popover list content is no longer a direct child of `.bui-SelectPopover`.

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

**Affected components:** Select
