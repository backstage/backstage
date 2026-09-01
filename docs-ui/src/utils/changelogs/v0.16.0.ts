import type { ChangelogProps } from '../types';

export const changelog_0_16_0: ChangelogProps[] = [
  {
    components: ['combobox'],
    version: '0.16.0',
    prs: ['34489'],
    description: `\`Combobox\` now supports async collections, incremental loading, client and server search, and rich or custom item rendering. Loading placeholders expose \`.bui-ComboboxLoading\` and \`.bui-ComboboxLoadingRow\`, and stale visible results expose \`data-stale\` on \`.bui-ComboboxList\`.

  **BREAKING**: The public \`ComboboxProps\` interface is now a union type.`,
    migration: `**Required on upgrade:**

Replace interfaces that extend \`ComboboxProps\` with type intersections.

\`\`\`diff
- interface MyComboboxProps extends ComboboxProps {
-   trackingId: string;
- }
+ type MyComboboxProps = ComboboxProps & {
+   trackingId: string;
+ };
\`\`\`

**Optional migration away from deprecated APIs:**

Prefer \`id\` instead of \`value\` for plain options. Existing array-valued options using \`value\` remain supported as a deprecated compatibility path, but new option content fields and async option sources require \`id\`.

Move input state and custom filtering into the nested \`search\` configuration:

\`\`\`diff
- <Combobox inputValue={query} onInputChange={setQuery} />
+ <Combobox search={{ inputValue: query, onInputChange: setQuery }} />
\`\`\`

The existing top-level input state props remain supported as a deprecated compatibility path for plain-array \`options\`.`,
    breaking: true,
    commitSha: 'fc4e624',
  },
  {
    components: ['select'],
    version: '0.16.0',
    prs: ['34489'],
    description: `\`Select\` now supports async collections, incremental loading, client and server search, and rich or custom item rendering. Loading placeholders expose \`.bui-SelectLoading\` and \`.bui-SelectLoadingRow\`, and stale retained results expose \`data-stale\` on \`.bui-SelectList\`.

  **BREAKING**: The public \`SelectProps\` interface is now a union type, and Select popover list content is no longer a direct child of \`.bui-SelectPopover\`.`,
    migration: `**Required on upgrade:**

Replace interfaces that extend \`SelectProps\` with type intersections.

\`\`\`diff
- interface MySelectProps extends SelectProps {
-   trackingId: string;
- }
+ type MySelectProps = SelectProps & {
+   trackingId: string;
+ };
\`\`\`

Update CSS selectors that rely on list content being a direct child of \`.bui-SelectPopover\`. Select popovers now use the standard BUI Popover content structure, with contents wrapped in \`.bui-Box.bui-PopoverContent\`. The existing \`.bui-Popover.bui-SelectPopover\` root classes are unchanged.

**Optional migration away from deprecated APIs:**

Prefer \`id\` instead of \`value\` for plain options. Existing array-valued options using \`value\` remain supported as a deprecated compatibility path, but new option content fields and async option sources require \`id\`.

Replace \`searchable\` and \`searchPlaceholder\` with nested \`search\` configuration:

\`\`\`diff
- <Select searchable searchPlaceholder="Search owners" />
+ <Select search={{ placeholder: 'Search owners' }} />
\`\`\``,
    breaking: true,
    commitSha: 'fc4e624',
  },
  {
    components: [],
    version: '0.16.0',
    prs: ['34567'],
    description: `Updated the dark theme neutral background tokens to provide clearer contrast between neutral surfaces.`,

    commitSha: '3d6c2e4',
  },
  {
    components: [],
    version: '0.16.0',
    prs: ['34539'],
    description: `Fixed the Table component not filling its container width in Firefox. The \`overflow\` style is now applied to a wrapper element instead of the \`<table>\` element directly, which avoids a Firefox behavior where non-visible overflow on tables causes them to shrink-wrap to content size.`,

    commitSha: 'c86efcd',
  },
  {
    components: ['skeleton'],
    version: '0.16.0',
    prs: ['34582'],
    description: `Make Skeleton component background aware, automatically adjusting its color to maintain visible contrast against neutral parent surfaces.`,

    commitSha: 'adf94f5',
  },
  {
    components: ['header'],
    version: '0.16.0',
    prs: ['34469'],
    description: `Fixed header tab links to respect the configured router \`basename\`.`,

    commitSha: 'b06b3c7',
  },
  {
    components: ['switch'],
    version: '0.16.0',
    prs: ['34455'],
    description: `Switch now adapts its track and thumb colors based on the background context of its parent container, and uses the accent token family when selected.`,

    commitSha: '14a101f',
  },
  {
    components: [],
    version: '0.16.0',
    prs: ['34557'],
    description: `Fixed tab indicator not updating position when tab content changes width dynamically.`,

    commitSha: '66c4e55',
  },
  {
    components: [],
    version: '0.16.0',
    prs: ['34264'],
    description: `Added a new \`NumberField\` component for numeric input with support for min, max, step, and keyboard increment/decrement.`,

    commitSha: 'b33bb24',
  },
  {
    components: ['combobox', 'select'],
    version: '0.16.0',
    prs: ['34591'],
    description: `Fixed async pagination in \`Combobox\` and \`Select\` popovers so additional pages load as users scroll instead of loading every page immediately. \`Combobox\` now uses \`.bui-PopoverContent\` as its scroll container, while all \`Select\` variants use the new \`.bui-SelectResults\` results container.

  Searchable \`Select\` keeps its search field fixed while results scroll. The new public classes \`.bui-SelectContent\` and \`.bui-SelectResults\` expose this layout for theme customization.`,

    commitSha: '350407d',
  },
  {
    components: ['combobox'],
    version: '0.16.0',
    prs: ['34590'],
    description: `Fixed \`Combobox\` client search crashing when used with plain options.`,

    commitSha: 'e989f95',
  },
  {
    components: ['header'],
    version: '0.16.0',
    prs: ['34448'],
    description: `Fixed Header breadcrumb typography so it remains consistent when component styles are loaded in different orders.`,

    commitSha: '1f709a3',
  },
  {
    components: [],
    version: '0.16.0',
    prs: ['34400'],
    description: `Introduces a new set of semantic color token families — Accent, Announcement, Warning, Negative, and Positive — each providing a consistent set of background, foreground, and border tokens for both light and dark themes. A gray scale (\`--bui-gray-1\` through \`--bui-gray-11\`) and updated foreground tokens are also included.

  The previous tokens remain in place for backward compatibility but are now deprecated and will be removed in a future release.`,
    migration: `**Neutral backgrounds**

The neutral background tokens keep their existing names (\`--bui-bg-app\`, \`--bui-bg-neutral-1\` through \`--bui-bg-neutral-4\`) but are updated with new solid-color values for both light and dark themes. No token renaming is required. The \`-hover\`, \`-pressed\`, and \`-disabled\` interaction variants of these tokens are deprecated and should be removed.

**Foreground**

| Deprecated         | Replacement             |
| ------------------ | ----------------------- |
| \`--bui-fg-danger\`  | \`--bui-fg-negative\`     |
| \`--bui-fg-success\` | \`--bui-fg-positive\`     |
| \`--bui-fg-info\`    | \`--bui-fg-announcement\` |

**Accent**

| Deprecated                | Replacement                |
| ------------------------- | -------------------------- |
| \`--bui-bg-solid\`          | \`--bui-accent-bg\`          |
| \`--bui-bg-solid-hover\`    | \`--bui-accent-bg-hover\`    |
| \`--bui-bg-solid-disabled\` | \`--bui-accent-bg-disabled\` |
| \`--bui-fg-solid\`          | \`--bui-accent-fg\`          |
| \`--bui-fg-solid-disabled\` | \`--bui-accent-fg-disabled\` |

**Positive**

| Deprecated               | Replacement                 |
| ------------------------ | --------------------------- |
| \`--bui-bg-success\`       | \`--bui-positive-bg-subdued\` |
| \`--bui-fg-success-on-bg\` | \`--bui-positive-fg-subdued\` |
| \`--bui-border-success\`   | \`--bui-positive-border\`     |

**Negative**

| Deprecated              | Replacement                 |
| ----------------------- | --------------------------- |
| \`--bui-bg-danger\`       | \`--bui-negative-bg-subdued\` |
| \`--bui-fg-danger-on-bg\` | \`--bui-negative-fg-subdued\` |
| \`--bui-border-danger\`   | \`--bui-negative-border\`     |

**Warning**

| Deprecated               | Replacement                |
| ------------------------ | -------------------------- |
| \`--bui-bg-warning\`       | \`--bui-warning-bg-subdued\` |
| \`--bui-fg-warning-on-bg\` | \`--bui-warning-fg-subdued\` |
| \`--bui-border-warning\`   | \`--bui-warning-border\`     |

**Announcement**

| Deprecated            | Replacement                     |
| --------------------- | ------------------------------- |
| \`--bui-bg-info\`       | \`--bui-announcement-bg-subdued\` |
| \`--bui-fg-info-on-bg\` | \`--bui-announcement-fg-subdued\` |
| \`--bui-border-info\`   | \`--bui-announcement-border\`     |`,

    commitSha: '5d80f77',
  },
];
