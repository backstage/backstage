export const usage = `import { TagGroup, Tag } from '@backstage/ui';

<TagGroup>
  <Tag>Tag 1</Tag>
  <Tag>Tag 2</Tag>
</TagGroup>`;

export const preview = `<TagGroup>
  <Tag>Banana</Tag>
  <Tag>Apple</Tag>
  <Tag>Orange</Tag>
  <Tag>Pear</Tag>
  <Tag>Grape</Tag>
  <Tag>Pineapple</Tag>
  <Tag>Strawberry</Tag>
</TagGroup>`;

export const withLink = `<TagGroup>
  <Tag href="/items/banana">Banana</Tag>
  <Tag href="/items/apple">Apple</Tag>
  <Tag href="/items/orange">Orange</Tag>
</TagGroup>`;

export const disabled = `<TagGroup>
  <Tag>Banana</Tag>
  <Tag isDisabled>Apple</Tag>
  <Tag isDisabled>Orange</Tag>
  <Tag>Pear</Tag>
</TagGroup>`;

export const withIcons = `<TagGroup>
  <Tag icon={<RiBugLine />}>Banana</Tag>
  <Tag icon={<RiAccountCircleLine />}>Apple</Tag>
  <Tag icon={<RiEyeLine />}>Orange</Tag>
  <Tag icon={<RiHeartLine />}>Pear</Tag>
</TagGroup>`;

export const sizes = `<Flex direction="column">
  <TagGroup>
    <Tag size="small" icon={<RiBugLine />}>Banana</Tag>
    <Tag size="small" icon={<RiAccountCircleLine />}>Apple</Tag>
  </TagGroup>
  <TagGroup>
    <Tag size="medium" icon={<RiBugLine />}>Banana</Tag>
    <Tag size="medium" icon={<RiAccountCircleLine />}>Apple</Tag>
  </TagGroup>
</Flex>`;

export const removingTags = `const list = useListData({
  initialItems: [
    { id: 'banana', name: 'Banana' },
    { id: 'apple', name: 'Apple' },
    { id: 'orange', name: 'Orange' },
  ],
});

<TagGroup
  items={list.items}
  onRemove={keys => list.remove(...keys)}
>
  {item => <Tag>{item.name}</Tag>}
</TagGroup>`;
