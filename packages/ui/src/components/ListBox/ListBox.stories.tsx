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
import { ListBox, ListBoxItem } from './ListBox';
import { ButtonIcon } from '../ButtonIcon';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import { TagGroup, Tag } from '../TagGroup';
import type { Selection } from 'react-aria-components';
import {
  RiJavascriptLine,
  RiMoreLine,
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
  title: 'Backstage UI/ListBox',
  component: ListBox,
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
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
];

const itemsWithDescription = [
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Typed superset of JavaScript',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web',
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming with memory safety',
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Simple, fast, and reliable',
  },
];

const itemIcons: Record<string, React.ReactNode> = {
  react: <RiReactjsLine />,
  typescript: <RiCodeLine />,
  javascript: <RiJavascriptLine />,
  rust: <RiShipLine />,
  go: <RiTerminalLine />,
};

export const Default = meta.story({
  render: args => (
    <ListBox {...args}>
      {items.map(item => (
        <ListBoxItem key={item.id} id={item.id}>
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  ),
});

export const WithIcons = meta.story({
  render: args => (
    <ListBox {...args}>
      {items.map(item => (
        <ListBoxItem key={item.id} id={item.id} icon={itemIcons[item.id]}>
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  ),
});

export const WithDescription = meta.story({
  args: {
    style: { width: 340 },
  },
  render: args => (
    <ListBox {...args}>
      {itemsWithDescription.map(item => (
        <ListBoxItem
          key={item.id}
          id={item.id}
          icon={itemIcons[item.id]}
          description={item.description}
        >
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  ),
});

export const SelectionModeSingle = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(new Set(['react']));

    return (
      <ListBox
        {...args}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {items.map(item => (
          <ListBoxItem key={item.id} id={item.id}>
            {item.label}
          </ListBoxItem>
        ))}
      </ListBox>
    );
  },
});

export const SelectionModeMultiple = meta.story({
  render: args => {
    const [selected, setSelected] = useState<Selection>(
      new Set(['react', 'typescript']),
    );

    return (
      <ListBox
        {...args}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        {items.map(item => (
          <ListBoxItem key={item.id} id={item.id}>
            {item.label}
          </ListBoxItem>
        ))}
      </ListBox>
    );
  },
});

export const Disabled = meta.story({
  render: args => (
    <ListBox {...args} disabledKeys={['typescript', 'rust']}>
      {items.map(item => (
        <ListBoxItem key={item.id} id={item.id}>
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  ),
});

export const WithActionsMenu = meta.story({
  render: args => (
    <ListBox {...args}>
      {items.map(item => (
        <ListBoxItem
          key={item.id}
          id={item.id}
          icon={itemIcons[item.id]}
          customActions={
            <MenuTrigger>
              <ButtonIcon
                icon={<RiMoreLine />}
                size="small"
                aria-label="More actions"
              />
              <Menu>
                <MenuItem iconStart={<RiEdit2Line />}>Edit</MenuItem>
                <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
                <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
                  Delete
                </MenuItem>
              </Menu>
            </MenuTrigger>
          }
        >
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  ),
});

export const WithActionsTags = meta.story({
  args: {
    style: { width: 380 },
  },
  render: args => {
    const tagMap: Record<string, string[]> = {
      react: ['frontend', 'ui'],
      typescript: ['typed', 'js'],
      javascript: ['web'],
      rust: ['systems', 'fast'],
      go: ['backend'],
    };

    return (
      <ListBox {...args}>
        {items.map(item => (
          <ListBoxItem
            key={item.id}
            id={item.id}
            icon={itemIcons[item.id]}
            customActions={
              <TagGroup aria-label={`Tags for ${item.label}`}>
                {tagMap[item.id].map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagGroup>
            }
          >
            {item.label}
          </ListBoxItem>
        ))}
      </ListBox>
    );
  },
});
