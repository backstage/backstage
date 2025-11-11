import type { ChangelogProps } from '../types';

export const changelog_0_5_0: ChangelogProps[] = [
  {
    components: ['textfield'],
    version: '0.5.0',
    description: '`TextField` now has multiple label sizes.',
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
];
