export type Component =
  | 'avatar'
  | 'box'
  | 'button'
  | 'heading'
  | 'text'
  | 'icon-button'
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
  | 'switch';

export type Version = `${number}.${number}.${number}`;

export interface ChangelogProps {
  components: Component[];
  description: string;
  version: Version;
  platform: 'oss' | 'portal';
  prs: string[];
}

export const changelog: ChangelogProps[] = [
  {
    components: ['switch'],
    version: '0.5.0',
    description: '✨ Add new `Switch` component',
    platform: 'portal',
    prs: ['30251'],
  },
  {
    components: ['tabs'],
    version: '0.4.0',
    description: '✨ Add new `Tabs` component',
    platform: 'portal',
    prs: ['29996'],
  },
  {
    components: ['text', 'heading'],
    version: '0.4.0',
    description: '✨ Add `truncate` prop to `Text` and `Heading`',
    platform: 'portal',
    prs: ['29988'],
  },
  {
    components: ['menu'],
    version: '0.4.0',
    description: '✨ Add combobox option to `Menu`',
    platform: 'portal',
    prs: ['29986'],
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: '✨ Add icon prop on `TextField`',
    platform: 'portal',
    prs: ['29820'],
  },
  {
    components: ['button', 'icon-button'],
    version: '0.4.0',
    description: 'Improve icon props on `Button` and `IconButton`',
    platform: 'portal',
    prs: ['29667'],
  },
  {
    components: ['text', 'heading'],
    version: '0.4.0',
    description:
      'Improve the way we treat custom render on `Text` and `Heading`',
    platform: 'portal',
    prs: ['29989'],
  },
  {
    components: ['menu'],
    version: '0.4.0',
    description: 'Improve `Menu` styles',
    platform: 'portal',
    prs: ['29986'],
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: 'Improve `TextField` styles',
    platform: 'portal',
    prs: ['29974'],
  },
  {
    components: ['textfield'],
    version: '0.4.0',
    description: 'Improve clear button on `TextField`',
    platform: 'portal',
    prs: ['29878'],
  },
  {
    components: ['flex'],
    version: '0.4.0',
    description: 'Fix spacing props on all layout components',
    platform: 'portal',
    prs: ['30013'],
  },
  {
    components: [],
    version: '0.4.0',
    description: 'Fix - Pin Base UI version',
    platform: 'portal',
    prs: ['29782'],
  },
  {
    components: ['select'],
    version: '0.4.0',
    description: 'Fix - Clicking `Select` label moves focus to trigger',
    platform: 'portal',
    prs: ['29755'],
  },
  {
    components: ['datatable'],
    version: '0.4.0',
    description: 'Fix `DataTable.Pagination` count issue',
    platform: 'portal',
    prs: ['29688'],
  },
  {
    components: ['datatable'],
    version: '0.3.0',
    description: 'Add `DataTable` component',
    platform: 'portal',
    prs: ['29484', '29603'],
  },
  {
    components: ['select'],
    version: '0.3.0',
    description: 'Add `Select` component',
    platform: 'portal',
    prs: ['29440'],
  },
  {
    components: ['avatar'],
    version: '0.3.0',
    description: 'Add `Avatar` component',
    platform: 'portal',
    prs: ['29594'],
  },
  {
    components: ['collapsible'],
    version: '0.3.0',
    description: 'Add `Collapsible` component',
    platform: 'portal',
    prs: ['29617'],
  },
  {
    components: ['textfield'],
    version: '0.3.0',
    description: 'Add `TextField` component instead of `Field` + `Input`',
    platform: 'portal',
    prs: ['29364'],
  },
  {
    components: ['datatable'],
    version: '0.3.0',
    description: 'Add `TableCellProfile`',
    platform: 'portal',
    prs: ['29600'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Add breakpoint hooks - `up()` and `down()`',
    platform: 'portal',
    prs: ['29564'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Add gray scale css tokens',
    platform: 'portal',
    prs: ['29543'],
  },
  {
    components: [],
    version: '0.3.0',
    description:
      'Update CSS styling API using `[data-___]` instead of class names for props',
    platform: 'portal',
    prs: ['29560'],
  },
  {
    components: ['checkbox'],
    version: '0.3.0',
    description: 'Update `Checkbox` dark mode',
    platform: 'portal',
    prs: ['29544'],
  },
  {
    components: ['container'],
    version: '0.3.0',
    description: 'Update `Container` styles',
    platform: 'portal',
    prs: ['29475'],
  },
  {
    components: ['menu'],
    version: '0.3.0',
    description: 'Update `Menu` styles',
    platform: 'portal',
    prs: ['29351'],
  },
  {
    components: ['select'],
    version: '0.3.0',
    description: 'Fix `Select` styles on small sizes + with long option names',
    platform: 'portal',
    prs: ['29545'],
  },
  {
    components: ['link'],
    version: '0.3.0',
    description: 'Fix render prop on `Link`',
    platform: 'portal',
    prs: ['29247'],
  },
  {
    components: ['textfield', 'select'],
    version: '0.3.0',
    description: 'Remove `Field` from `TextField` + `Select`',
    platform: 'portal',
    prs: ['29482'],
  },
  {
    components: ['text', 'heading'],
    version: '0.3.0',
    description: 'Update `textDecoration` to `none` on `Text` / `Heading`',
    platform: 'portal',
    prs: ['29357'],
  },
  {
    components: ['text', 'heading'],
    version: '0.3.0',
    description: 'Update `textDecoration` to `none` on `Text` / `Heading`',
    platform: 'portal',
    prs: ['29357'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Use stories from Storybook for all examples in Nextjs',
    platform: 'portal',
    prs: ['29306'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Add release page (this one 🤗)',
    platform: 'portal',
    prs: ['29461'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Docs - Add docs for Menu, Link',
    platform: 'portal',
    prs: ['29576'],
  },
  {
    components: [],
    version: '0.3.0',
    description: 'Fix CSS watch mode',
    platform: 'portal',
    prs: ['29352'],
  },
  {
    components: ['menu'],
    version: '0.2.0',
    description: 'New `Menu` component',
    platform: 'portal',
    prs: ['29151'],
  },
  {
    components: ['icon-button'],
    version: '0.2.0',
    description: 'New `IconButton` component',
    platform: 'portal',
    prs: ['29239'],
  },
  {
    components: ['scrollarea'],
    version: '0.2.0',
    description: 'New `ScrollArea` component',
    platform: 'portal',
    prs: ['29240'],
  },
  {
    components: ['button', 'checkbox'],
    version: '0.2.0',
    description: 'Improve `Button` & `Checkbox` styles',
    platform: 'portal',
    prs: ['29127', '28789'],
  },
  {
    components: ['text'],
    version: '0.2.0',
    description: 'Improve `Text` styles',
    platform: 'portal',
    prs: ['29200'],
  },
  {
    components: ['icon'],
    version: '0.2.0',
    description: 'Renamed `CanonProvider` to `IconProvider`',
    platform: 'portal',
    prs: ['29002'],
  },
  {
    components: ['icon'],
    version: '0.2.0',
    description: 'Added about 40+ new icons',
    platform: 'portal',
    prs: ['29264'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Simplified styling into a unique styles.css file',
    platform: 'portal',
    prs: ['29199'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Added Canon styles to Backstage',
    platform: 'portal',
    prs: ['29137'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Update global CSS tokens',
    platform: 'portal',
    prs: ['28804'],
  },
  {
    components: ['flex'],
    version: '0.2.0',
    description: 'Merge Stack + Inline into Flex',
    platform: 'portal',
    prs: ['28634'],
  },
  {
    components: ['button'],
    version: '0.2.0',
    description: 'Improve `Button` types',
    platform: 'portal',
    prs: ['29205'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Move font weight and family back to each components',
    platform: 'portal',
    prs: ['28972'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Fix custom values in spacing props',
    platform: 'portal',
    prs: ['28770'],
  },
  {
    components: [],
    version: '0.2.0',
    description: 'Multiple updates on the Canon Docs site',
    platform: 'portal',
    prs: ['28760'],
  },
];
