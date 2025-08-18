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
import type { Meta, StoryObj } from '@storybook/react';
import { TagGroup, Tag } from '.';
import type { Selection } from 'react-aria-components';
import { Icon, IconNames } from '@backstage/ui';
import { useListData } from 'react-stately';

export interface ListItem {
  id: string;
  name: string;
  icon: IconNames;
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
} satisfies Meta<typeof TagGroup<ListItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialList: ListItem[] = [
  { id: 'banana', name: 'Banana', icon: 'bug' },
  { id: 'apple', name: 'Apple', icon: 'account-circle' },
  { id: 'orange', name: 'Orange', icon: 'eye' },
  { id: 'pear', name: 'Pear', icon: 'heart' },
  { id: 'grape', name: 'Grape', icon: 'bug' },
  { id: 'pineapple', name: 'Pineapple', icon: 'eye' },
  { id: 'strawberry', name: 'Strawberry', icon: 'heart' },
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
        <Tag
          key={item.id}
          icon={item.icon ? <Icon name={item.icon} /> : undefined}
        >
          {item.name}
        </Tag>
      ))}
    </TagGroup>
  ),
};

export const WithRemoveButton: Story = {
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
          <Tag icon={item.icon ? <Icon name={item.icon} /> : undefined}>
            {item.name}
          </Tag>
        )}
      </TagGroup>
    );
  },
};
