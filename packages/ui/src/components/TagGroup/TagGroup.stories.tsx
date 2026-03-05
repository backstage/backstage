/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import preview from '../../../../../.storybook/preview';
import { useState } from 'react';
import { TagGroup, Tag } from '.';
import type { Selection } from 'react-aria-components';
import { Flex } from '../../';
import { useListData } from 'react-stately';
import { MemoryRouter } from 'react-router-dom';
import {
  RiAccountCircleLine,
  RiBugLine,
  RiEyeLine,
  RiHeartLine,
} from '@remixicon/react';

export interface ListItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isDisabled?: boolean;
}

const meta = preview.meta({
  title: 'Backstage UI/TagGroup',
  component: TagGroup,
  argTypes: {
    selectionMode: {
      control: { type: 'inline-radio' },
      options: ['single', 'multiple'],
    },
    'aria-label': {
      control: { type: 'text' },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

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

export const Default = meta.story({
  args: {
    'aria-label': 'Tag Group',
  },
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id}>{item.name}</Tag>
      ))}
    </TagGroup>
  ),
});

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="column">
      <TagGroup {...args}>
        {initialList.map(item => (
          <Tag key={item.id} size="small" icon={item.icon}>
            {item.name}
          </Tag>
        ))}
      </TagGroup>
      <TagGroup {...args}>
        {initialList.map(item => (
          <Tag key={item.id} size="medium" icon={item.icon}>
            {item.name}
          </Tag>
        ))}
      </TagGroup>
    </Flex>
  ),
});

export const SelectionModeSingle = meta.story({
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group',
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    return (
      <TagGroup<ListItem>
        {...args}
        items={initialList}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
});

export const SelectionModeMultiple = meta.story({
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group',
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(
      new Set(['travel', 'shopping']),
    );

    return (
      <TagGroup<ListItem>
        {...args}
        items={initialList}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
});

export const WithIcon = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id} icon={item.icon ? item.icon : undefined}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
});

export const WithLink = meta.story({
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id} href={`/items/${item.id}`}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
});

export const Disabled = meta.story({
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
});

export const RemovingTags = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    const list = useListData<ListItem>({
      initialItems: initialList,
    });

    return (
      <TagGroup<ListItem>
        {...args}
        items={list.items}
        onRemove={keys => list.remove(...keys)}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
});

export const WithIconAndRemoveButton = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    const list = useListData<ListItem>({
      initialItems: initialList,
    });

    return (
      <TagGroup<ListItem>
        {...args}
        items={list.items}
        onRemove={keys => list.remove(...keys)}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => (
          <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>
        )}
      </TagGroup>
    );
  },
});
