import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const tagGroupPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'A list of row keys to disable.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'The type of selection that is allowed in the collection.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The currently selected keys in the collection (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The initial selected keys in the collection (uncontrolled).',
  },
  onRemove: {
    type: 'enum',
    values: ['(keys: Set<Key>) => void'],
    description: 'Handler that is called when a tag is removed.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler that is called when the selection changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tagPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'The id of the tag.',
  },
  textValue: {
    type: 'string',
    description: 'The text value of the tag.',
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the tag is disabled.',
  },
  href: {
    type: 'string',
    description: 'The href of the tag.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'The icon of the tag.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const preview = `import { TagGroup, Tag } from '@backstage/ui';

<TagGroup aria-label="Tag Group">
  <Tag>Banana</Tag>
  <Tag>Apple</Tag>
  <Tag>Orange</Tag>
  <Tag>Pear</Tag>
  <Tag>Grape</Tag>
  <Tag>Pineapple</Tag>
  <Tag>Strawberry</Tag>
</TagGroup>
`;

export const usage = `import { TagGroup, Tag } from '@backstage/ui';

// Basic usage
<TagGroup aria-label="Tag Group">
  <Tag>Tag 1</Tag>
  <Tag>Tag 2</Tag>
  <Tag>Tag 3</Tag>
</TagGroup>

// With the items prop
const list = [
  { id: '1', name: 'Tag 1' },
  { id: '2', name: 'Tag 2' },
  { id: '3', name: 'Tag 3' },
];

<TagGroup aria-label="Tag Group" items={list}>
  {item => <Tag>{item.name}</Tag>}
</TagGroup>`;

export const withLink = `import { TagGroup, Tag } from '@backstage/ui';

<TagGroup aria-label="Tag Group">
  <Tag href="/items/banana">Banana</Tag>
  <Tag href="/items/apple">Apple</Tag>
  <Tag href="/items/orange">Orange</Tag>
  ...
</TagGroup>`;

export const disabled = `import { TagGroup, Tag } from '@backstage/ui';

<TagGroup aria-label="Tag Group">
  <Tag>Banana</Tag>
  <Tag isDisabled>Apple</Tag>
  <Tag isDisabled>Orange</Tag>
  <Tag>Pear</Tag>
  ...
</TagGroup>`;

export const withIcons = `import { TagGroup, Tag } from '@backstage/ui';

<TagGroup aria-label="Tag Group">
  <Tag icon={<RiBugLine />}>Banana</Tag>
  <Tag icon={<RiAccountCircleLine />}>Apple</Tag>
  <Tag icon={<RiEyeLine />}>Orange</Tag>
  ...
</TagGroup>`;

export const sizes = `import { TagGroup, Tag, Flex } from '@backstage/ui';

<Flex direction="column">
  <TagGroup aria-label="Tag Group">
    <Tag size="small">Banana</Tag>
    <Tag size="small">Apple</Tag>
    <Tag size="small">Orange</Tag>
    ...
  </TagGroup>
  <TagGroup aria-label="Tag Group">
    <Tag size="medium">Banana</Tag>
    <Tag size="medium">Apple</Tag>
    <Tag size="medium">Orange</Tag>
    ...
  </TagGroup>
</Flex>`;

export const removingTags = `import { TagGroup, Tag } from '@backstage/ui';
import type { Selection } from 'react-aria-components';
import { useListData } from 'react-stately';

const [selected, setSelected] = useState<Selection>(new Set(['travel']));

const list = useListData({
  initialItems: initialList,
});

<TagGroup
  items={list.items}
  onRemove={keys => list.remove(...keys)}
  selectedKeys={selected}
  onSelectionChange={setSelected}
  {...args}
>
  {item => <Tag>{item.name}</Tag>}
</TagGroup>`;
