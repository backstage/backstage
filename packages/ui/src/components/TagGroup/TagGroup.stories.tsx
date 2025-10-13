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

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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

const meta = {
  title: 'Backstage UI/TagGroup',
  component: TagGroup<ListItem>,
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
} satisfies Meta<typeof TagGroup<ListItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialList: ListItem[] = [
  { id: 'banana', name: 'Banana', icon: <RiBugLine /> },
  { id: 'apple', name: 'Apple', icon: <RiAccountCircleLine /> },
  { id: 'orange', name: 'Orange', icon: <RiEyeLine /> },
  { id: 'pear', name: 'Pear', icon: <RiHeartLine /> },
  { id: 'grape', name: 'Grape', icon: <RiBugLine /> },
  { id: 'pineapple', name: 'Pineapple', icon: <RiEyeLine /> },
  { id: 'strawberry', name: 'Strawberry', icon: <RiHeartLine /> },
];

export const Default: Story = {
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
};

export const Sizes: Story = {
  args: {
    ...Default.args,
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
};

export const SelectionModeSingle: Story = {
  args: {
    selectionMode: 'single',
    'aria-label': 'Tag Group',
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    return (
      <TagGroup
        items={initialList}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...args}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
};

export const SelectionModeMultiple: Story = {
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Tag Group',
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(
      new Set(['travel', 'shopping']),
    );

    return (
      <TagGroup
        items={initialList}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...args}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
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
};

export const WithLink: Story = {
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id} href={`/items/${item.id}`}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
};

export const Disabled: Story = {
  render: args => (
    <TagGroup {...args}>
      {initialList.map(item => (
        <Tag key={item.id} isDisabled={item.isDisabled}>
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
};

export const RemovingTags: Story = {
  args: {
    ...Default.args,
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    const list = useListData({
      initialItems: initialList,
    });

    return (
      <TagGroup
        items={list.items}
        onRemove={keys => list.remove(...keys)}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...args}
      >
        {item => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
};

export const WithIconAndRemoveButton: Story = {
  args: {
    ...Default.args,
  },
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['travel']));

    const list = useListData({
      initialItems: initialList,
    });

    return (
      <TagGroup
        items={list.items}
        onRemove={keys => list.remove(...keys)}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...args}
      >
        {item => (
          <Tag icon={item.icon ? item.icon : undefined}>{item.name}</Tag>
        )}
      </TagGroup>
    );
  },
};
