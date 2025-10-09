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

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  MenuTrigger,
  MenuAutocompleteListbox,
  MenuListBoxItem,
  Menu,
  MenuItem,
  SubmenuTrigger,
} from './index';
import { Button, Flex, Text } from '../..';
import { useState } from 'react';
import { Selection } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Backstage UI/MenuAutocompleteListBox',
  component: MenuTrigger,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof MenuTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
];

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(
      new Set([options[2].value]),
    );

    return (
      <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox
            selectedKeys={selected}
            onSelectionChange={setSelected}
          >
            {options.map(option => (
              <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>
            ))}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>
    );
  },
};

export const PreviewListbox: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(
      new Set([options[2].value]),
    );

    return (
      <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox
            selectedKeys={selected}
            onSelectionChange={setSelected}
          >
            {options.map(option => (
              <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>
            ))}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>
    );
  },
};

export const PreviewListboxMultiple: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(
      new Set([options[2].value, options[3].value]),
    );

    return (
      <Flex direction="column" gap="2" align="center">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocompleteListbox
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
          >
            {options.map(option => (
              <MenuListBoxItem key={option.value} id={option.value}>
                {option.label}
              </MenuListBoxItem>
            ))}
          </MenuAutocompleteListbox>
        </MenuTrigger>
      </Flex>
    );
  },
};

export const Submenu: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(
      new Set([options[2].value]),
    );

    return (
      <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <Menu>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <SubmenuTrigger>
              <MenuItem>Submenu</MenuItem>
              <MenuAutocompleteListbox
                selectedKeys={selected}
                onSelectionChange={setSelected}
                placement="right top"
              >
                {options.map(option => (
                  <MenuListBoxItem key={option.value} id={option.value}>
                    {option.label}
                  </MenuListBoxItem>
                ))}
              </MenuAutocompleteListbox>
            </SubmenuTrigger>
          </Menu>
        </MenuTrigger>
      </Flex>
    );
  },
};
