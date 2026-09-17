'use client';

import {
  TagGroup,
  Tag,
} from '../../../../../packages/ui/src/components/TagGroup/TagGroup';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { useListData } from 'react-stately';
import type { Selection } from 'react-aria-components';
import {
  RiAccountCircleLine,
  RiBugLine,
  RiEyeLine,
  RiHeartLine,
} from '@remixicon/react';

interface ListItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isDisabled?: boolean;
}

const initialList: ListItem[] = [
  { id: 'banana', name: 'Banana', icon: <RiBugLine /> },
  {
    id: 'apple',
    name: 'Apple',
    icon: <RiAccountCircleLine />,
    isDisabled: true,
  },
  { id: 'orange', name: 'Orange', icon: <RiEyeLine />, isDisabled: true },
  { id: 'pear', name: 'Pear', icon: <RiHeartLine /> },
  { id: 'grape', name: 'Grape', icon: <RiBugLine /> },
  { id: 'pineapple', name: 'Pineapple', icon: <RiEyeLine /> },
  { id: 'strawberry', name: 'Strawberry', icon: <RiHeartLine /> },
];

export const Default = () => (
  <MemoryRouter>
    <TagGroup aria-label="Tag Group">
      {initialList.map(item => (
        <Tag key={item.id}>{item.name}</Tag>
      ))}
    </TagGroup>
  </MemoryRouter>
);

export const WithLink = () => (
  <MemoryRouter>
    <TagGroup>
      {initialList.map(item => (
        <Tag key={item.id} href={`/items/${item.id}`}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  </MemoryRouter>
);

export const WithIcon = () => (
  <MemoryRouter>
    <TagGroup aria-label="Tag Group">
      {initialList.map(item => (
        <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  </MemoryRouter>
);

export const Sizes = () => (
  <MemoryRouter>
    <Flex direction="column">
      <TagGroup aria-label="Small Tags">
        {initialList.map(item => (
          <Tag key={item.id} size="small" icon={item.icon}>
            {item.name}
          </Tag>
        ))}
      </TagGroup>
      <TagGroup aria-label="Medium Tags">
        {initialList.map(item => (
          <Tag key={item.id} size="medium" icon={item.icon}>
            {item.name}
          </Tag>
        ))}
      </TagGroup>
    </Flex>
  </MemoryRouter>
);

export const RemovingTags = () => {
  const [selected, setSelected] = useState<Selection>(new Set(['travel']));
  const list = useListData<ListItem>({
    initialItems: initialList,
  });

  return (
    <MemoryRouter>
      <TagGroup<ListItem>
        aria-label="Tag Group"
        items={list.items}
        onRemove={keys => list.remove(...keys)}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    </MemoryRouter>
  );
};

export const Disabled = () => (
  <MemoryRouter>
    <TagGroup>
      {initialList.map(item => (
        <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  </MemoryRouter>
);
