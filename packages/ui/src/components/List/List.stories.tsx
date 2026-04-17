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
import { List, ListRow } from './List';
import { MenuItem } from '../Menu';
import { TagGroup, Tag } from '../TagGroup';
import type { Selection } from 'react-aria-components';
import {
  RiJavascriptLine,
  RiReactjsLine,
  RiShipLine,
  RiTerminalLine,
  RiCodeLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiShareBoxLine,
} from '@remixicon/react';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/List',
  component: List,
  args: {
    style: { width: 320 },
    'aria-label': 'List',
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

const items = [
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
    icon: <RiReactjsLine />,
    tags: ['frontend', 'ui'],
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Typed superset of JavaScript',
    icon: <RiCodeLine />,
    tags: ['typed', 'js'],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web',
    icon: <RiJavascriptLine />,
    tags: ['web'],
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming with memory safety',
    icon: <RiShipLine />,
    tags: ['systems', 'fast'],
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Simple, fast, and reliable',
    icon: <RiTerminalLine />,
    tags: ['backend'],
  },
];

const menuItems = (
  <>
    <MenuItem iconStart={<RiEdit2Line />}>Edit</MenuItem>
    <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
    <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
      Delete
    </MenuItem>
  </>
);

export const Default = meta.story({
  render: args => (
    <List {...args} items={items}>
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
  ),
});

export const WithIcons = meta.story({
  render: args => (
    <List {...args} items={items}>
      {item => (
        <ListRow id={item.id} icon={item.icon}>
          {item.label}
        </ListRow>
      )}
    </List>
  ),
});

export const WithDescription = meta.story({
  args: {
    style: { width: 340 },
  },
  render: args => (
    <List {...args} items={items}>
      {item => (
        <ListRow id={item.id} icon={item.icon} description={item.description}>
          {item.label}
        </ListRow>
      )}
    </List>
  ),
});

export const SelectionModeSingle = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react']));

    return (
      <List
        {...args}
        items={items}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <ListRow id={item.id}>{item.label}</ListRow>}
      </List>
    );
  },
});

export const SelectionModeSingleWithIcons = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react']));

    return (
      <List
        {...args}
        items={items}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => (
          <ListRow id={item.id} icon={item.icon}>
            {item.label}
          </ListRow>
        )}
      </List>
    );
  },
});

export const SelectionModeMultiple = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(
      new Set(['react', 'typescript']),
    );

    return (
      <List
        {...args}
        items={items}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => <ListRow id={item.id}>{item.label}</ListRow>}
      </List>
    );
  },
});

export const SelectionModeMultipleWithIcons = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(
      new Set(['react', 'typescript']),
    );

    return (
      <List
        {...args}
        items={items}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {item => (
          <ListRow id={item.id} icon={item.icon}>
            {item.label}
          </ListRow>
        )}
      </List>
    );
  },
});

export const Disabled = meta.story({
  render: args => (
    <List {...args} items={items} disabledKeys={['typescript', 'rust']}>
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
  ),
});

export const WithActionsMenu = meta.story({
  args: {
    style: { width: 420 },
  },
  render: args => (
    <List {...args} items={items}>
      {item => (
        <ListRow id={item.id} icon={item.icon} menuItems={menuItems}>
          {item.label}
        </ListRow>
      )}
    </List>
  ),
});

export const WithActionsTags = meta.story({
  args: {
    style: { width: 420 },
  },
  render: args => (
    <List {...args} items={items}>
      {item => (
        <ListRow
          id={item.id}
          icon={item.icon}
          customActions={
            <TagGroup aria-label={`Tags for ${item.label}`}>
              {item.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagGroup>
          }
        >
          {item.label}
        </ListRow>
      )}
    </List>
  ),
});

export const WithActionsMenuAndTags = meta.story({
  args: {
    style: { width: 420 },
  },
  render: args => (
    <List {...args} items={items}>
      {item => (
        <ListRow
          id={item.id}
          icon={item.icon}
          menuItems={menuItems}
          customActions={
            <TagGroup aria-label={`Tags for ${item.label}`}>
              {item.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagGroup>
          }
        >
          {item.label}
        </ListRow>
      )}
    </List>
  ),
});
