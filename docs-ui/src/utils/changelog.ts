export type Component =
  | 'avatar'
  | 'box'
  | 'button'
  | 'button-link'
  | 'heading'
  | 'text'
  | 'button-icon'
  | 'icon'
  | 'tabs'
  | 'menu'
  | 'textfield'
  | 'datatable'
  | 'select'
  | 'collapsible'
  | 'checkbox'
  | 'container'
  | 'link'
  | 'tooltip'
  | 'scrollarea'
  | 'flex'
  | 'switch'
  | 'grid'
  | 'searchfield'
  | 'radio-group'
  | 'card'
  | 'skeleton'
  | 'header';

export type Version = `${number}.${number}.${number}`;

export interface ChangelogProps {
  components: Component[];
  description: string;
  version: Version;
  prs: string[];
  type?: 'breaking' | 'new' | 'fix';
}

export const changelog: ChangelogProps[] = [
  {
    components: ['tooltip'],
    version: '0.6.0',
    description: 'New `Tooltip` component.',
    prs: ['30461'],
    type: 'new',
  },
  {
    components: ['card'],
    version: '0.6.0',
    description: 'New `Card` component.',
    prs: ['30467'],
    type: 'new',
  },
  {
    components: ['header'],
    version: '0.6.0',
    description: 'New `Header` component.',
    prs: ['30410', '30459', '30493'],
    type: 'new',
  },
  {
    components: ['button', 'button-link', 'button-icon'],
    version: '0.6.0',
    description: 'Improve `Button`, `ButtonIcon` and `ButtonLink` styling.',
    prs: ['30448'],
    type: 'fix',
  },
  {
    components: ['text', 'heading'],
    version: '0.6.0',
    description:
      'Update return types for `Heading` & `Text` components for React 19.',
    prs: ['30440'],
    type: 'fix',
  },
  {
    components: ['button', 'button-link', 'button-icon'],
    version: '0.6.0',
    description:
      'New `tertiary` variant to `Button`, `ButtonIcon` and `ButtonLink`.',
    prs: ['30453'],
    type: 'new',
  },
  {
    components: ['skeleton'],
    version: '0.6.0',
    description: 'New `Skeleton` component.',
    prs: ['30466'],
    type: 'new',
  },
  {
    components: ['button-icon'],
    version: '0.6.0',
    description: 'Rename `IconButton` to `ButtonIcon`.',
    prs: ['30297'],
    type: 'breaking',
  },
  {
    components: ['button-link'],
    version: '0.6.0',
    description:
      'New `ButtonLink`, which replaces the previous render prop pattern on `Button` and `IconButton`.',
    prs: ['30297'],
    type: 'new',
  },
  {
    components: ['button', 'button-link', 'button-icon'],
    version: '0.6.0',
    description: 'Remove the `render` prop from all button-related components.',
    prs: ['30297'],
    type: 'breaking',
  },
  {
    components: [],
    version: '0.6.0',
    description:
      'We are consolidating all css files into a single styles.css in Canon.',
    prs: ['30325'],
    type: 'fix',
  },
  {
    components: ['searchfield'],
    version: '0.6.0',
    description: 'New `SearchField` component.',
    prs: ['30357'],
    type: 'new',
  },
  {
    components: ['radio-group'],
    version: '0.6.0',
    description: 'New `RadioGroup` + `Radio` component.',
    prs: ['30327'],
    type: 'new',
  },
  {
    components: ['textfield'],
    version: '0.6.0',
    description: 'Added placeholder prop back to `TextField` component.',
    prs: ['30286'],
    type: 'fix',
  },
  {
    components: ['textfield'],
    version: '0.5.0',
    description: '`TextField` in Canon now has multiple label sizes.',
    prs: ['30249'],
    type: 'breaking',
  },
  {
    components: ['textfield'],
    version: '0.5.0',
    description:
      '`TextField` can now hide label and description while keeping them available for screen readers.',
    prs: ['30249'],
    type: 'breaking',
  },
  {
    components: ['textfield'],
    version: '0.5.0',
    description:
      'We are removing the `render` prop in favour of the `as` prop on `Heading` and `Text`.',
    prs: ['30291'],
    type: 'breaking',
  },
  {
    components: ['textfield'],
    version: '0.5.0',
    description: 'Move `TextField` component to use react Aria under the hood.',
    prs: ['30286'],
    type: 'breaking',
  },
  {
    components: ['button', 'button-link'],
    version: '0.5.0',
    description:
      'Added a render prop to the `Button` component to use it as a link.',
    prs: ['30165'],
    type: 'new',
  },
  {
    components: ['heading'],
    version: '0.5.0',
    description: 'Fix styling for the title4 prop on the Heading component.',
    prs: ['30167'],
    type: 'fix',
  },
  {
    components: ['flex'],
    version: '0.5.0',
    description:
      'Add `min-width: 0;` by default on Flex components to support truncated text.',
    prs: ['30168'],
    type: 'fix',
  },
  {
    components: ['button', 'button-link', 'button-icon'],
    version: '0.5.0',
    description:
      '`Button`, `ButtonLink`, `ButtonIcon` now default to size `small` instead of `medium`',
    prs: ['30085', '30097'],
    type: 'breaking',
  },
  {
    components: ['grid'],
    version: '0.5.0',
    description: 'Rename Grid component to `<Grid.Root />`',
    prs: ['30013'],
    type: 'breaking',
  },
  {
    components: ['flex', 'container', 'grid', 'box'],
    version: '0.5.0',
    description: 'Fixes spacing props on layout components',
    prs: ['30013'],
    type: 'fix',
  },
  {
    components: ['switch'],
    version: '0.5.0',
    description: 'New `Switch` component',
    prs: ['30251'],
    type: 'new',
  },
  {
    components: ['tabs'],
    version: '0.4.0',
    description: 'New `Tabs` component',
    prs: ['29996'],
    type: 'new',
  },
  {
    components: ['text', 'heading'],
    version: '0.4.0',
    description: 'Add `truncate` prop to `Text` and `Heading`',
    prs: ['29988'],
    type: 'new',
  },
  {
    components: ['menu'],
    version: '0.4.0',
    description: 'Add combobox option to `Menu`',
    prs: ['29986'],
    type: 'new',
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: 'Add icon prop on `TextField`',
    prs: ['29820'],
    type: 'new',
  },
  {
    components: ['button', 'button-icon'],
    version: '0.4.0',
    description: 'Improve icon props on `Button` and `IconButton`',
    prs: ['29667'],
  },
  {
    components: ['text', 'heading'],
    version: '0.4.0',
    description:
      'Improve the way we treat custom render on `Text` and `Heading`',
    prs: ['29989'],
  },
  {
    components: ['menu'],
    version: '0.4.0',
    description: 'Improve `Menu` styles',
    prs: ['29986'],
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: 'Improve `TextField` styles',
    prs: ['29974'],
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: 'Improve clear button on `TextField`',
    prs: ['29878'],
  },
  {
    components: ['flex'],
    version: '0.4.0',
    description: 'Fix spacing props on all layout components',
    prs: ['30013'],
  },
  {
    components: [],
    version: '0.4.0',
    description: 'Fix - Pin Base UI version',
    prs: ['29782'],
  },
  {
    components: ['select'],
    version: '0.4.0',
    description: 'Fix - Clicking `Select` label moves focus to trigger',
    prs: ['29755'],
  },
  {
    components: ['datatable'],
    version: '0.4.0',
    description: 'Fix `DataTable.Pagination` count issue',
    prs: ['29688'],
  },
  {
    components: ['datatable'],
    version: '0.3.0',
    description: 'Add `DataTable` component',
    prs: ['29484', '29603'],
    type: 'new',
  },
  {
    components: ['select'],
    version: '0.3.0',
    description: 'Add `Select` component',
    prs: ['29440'],
    type: 'new',
  },
  {
    components: ['avatar'],
    version: '0.3.0',
    description: 'Add `Avatar` component',
    prs: ['29594'],
    type: 'new',
  },
  {
    components: ['collapsible'],
    version: '0.3.0',
    description: 'Add `Collapsible` component',
    prs: ['29617'],
    type: 'new',
  },
  {
    components: ['textfield'],
    version: '0.3.0',
    description: 'Add `TextField` component instead of `Field` + `Input`',
    prs: ['29364'],
    type: 'new',
  },
  {
    components: ['datatable'],
    version: '0.3.0',
    description: 'Add `TableCellProfile`',
    prs: ['29600'],
    type: 'new',
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Add breakpoint hooks - `up()` and `down()`',
    prs: ['29564'],
    type: 'new',
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Add gray scale css tokens',
    prs: ['29543'],
    type: 'new',
  },
  {
    components: [],
    version: '0.3.0',
    description:
      'Update CSS styling API using `[data-___]` instead of class names for props',
    prs: ['29560'],
  },
  {
    components: ['checkbox'],
    version: '0.3.0',
    description: 'Update `Checkbox` dark mode',
    prs: ['29544'],
  },
  {
    components: ['container'],
    version: '0.3.0',
    description: 'Update `Container` styles',
    prs: ['29475'],
  },
  {
    components: ['menu'],
    version: '0.3.0',
    description: 'Update `Menu` styles',
    prs: ['29351'],
  },
  {
    components: ['select'],
    version: '0.3.0',
    description: 'Fix `Select` styles on small sizes + with long option names',
    prs: ['29545'],
  },
  {
    components: ['link'],
    version: '0.3.0',
    description: 'Fix render prop on `Link`',
    prs: ['29247'],
  },
  {
    components: ['textfield', 'select'],
    version: '0.3.0',
    description: 'Remove `Field` from `TextField` + `Select`',
    prs: ['29482'],
  },
  {
    components: ['text', 'heading'],
    version: '0.3.0',
    description: 'Update `textDecoration` to `none` on `Text` / `Heading`',
    prs: ['29357'],
  },
  {
    components: ['text', 'heading'],
    version: '0.3.0',
    description: 'Update `textDecoration` to `none` on `Text` / `Heading`',
    prs: ['29357'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Use stories from Storybook for all examples in Nextjs',
    prs: ['29306'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Add release page (this one 🤗)',
    prs: ['29461'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Add docs for Menu, Link',
    prs: ['29576'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Fix CSS watch mode',
    prs: ['29352'],
  },
  {
    components: ['menu'],
    version: '0.2.0',
    description: 'New `Menu` component',
    prs: ['29151'],
    type: 'new',
  },
  {
    components: ['button-icon'],
    version: '0.2.0',
    description: 'New `IconButton` component',
    prs: ['29239'],
    type: 'new',
  },
  {
    components: ['scrollarea'],
    version: '0.2.0',
    description: 'New `ScrollArea` component',
    prs: ['29240'],
    type: 'new',
  },
  {
    components: ['button', 'checkbox'],
    version: '0.2.0',
    description: 'Improve `Button` & `Checkbox` styles',
    prs: ['29127', '28789'],
  },
  {
    components: ['text'],
    version: '0.2.0',
    description: 'Improve `Text` styles',
    prs: ['29200'],
  },
  {
    components: ['icon'],
    version: '0.2.0',
    description: 'Renamed `CanonProvider` to `IconProvider`',
    prs: ['29002'],
  },
  {
    components: ['icon'],
    version: '0.2.0',
    description: 'Added about 40+ new icons',
    prs: ['29264'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Simplified styling into a unique styles.css file',
    prs: ['29199'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Added Canon styles to Backstage',
    prs: ['29137'],
    type: 'new',
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Update global CSS tokens',
    prs: ['28804'],
  },
  {
    components: ['flex'],
    version: '0.2.0',
    description: 'Merge Stack + Inline into Flex',
    prs: ['28634'],
  },
  {
    components: ['button'],
    version: '0.2.0',
    description: 'Improve `Button` types',
    prs: ['29205'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Move font weight and family back to each components',
    prs: ['28972'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Fix custom values in spacing props',
    prs: ['28770'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Multiple updates on the Canon Docs site',
    prs: ['28760'],
  },
];
