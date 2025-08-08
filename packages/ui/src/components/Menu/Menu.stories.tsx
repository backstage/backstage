/*
 * Copyright 2024 The Backstage Authors
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

import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { Text, Icon, Button, Flex } from '../../index';
import { useState } from 'react';

const meta = {
  title: 'Components/Menu',
  component: Menu.Root,
} satisfies Meta<typeof Menu.Root>;

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
  args: { children: undefined },
  render: args => (
    <Menu.Root {...args}>
      <Menu.Trigger
        render={props => (
          <Button
            {...props}
            size="small"
            variant="secondary"
            iconEnd={<Icon name="chevron-down" />}
          >
            Menu
          </Button>
        )}
      />
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start">
          <Menu.Popup>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Invite new members</Menu.Item>
            <Menu.Item>Download app</Menu.Item>
            <Menu.Item>Log out</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
  render: Default.render,
};

export const OpenOnHover: Story = {
  args: {
    ...Default.args,
    openOnHover: true,
  },
  render: Default.render,
};

export const Submenu: Story = {
  args: { children: undefined },
  render: args => (
    <Menu.Root {...args}>
      <Menu.Trigger
        render={props => (
          <Button
            {...props}
            size="small"
            variant="secondary"
            iconEnd={<Icon name="chevron-down" />}
          >
            Menu
          </Button>
        )}
      />
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start">
          <Menu.Popup>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Invite new members</Menu.Item>
            <Menu.Item>Download app</Menu.Item>
            <Menu.Item>Log out</Menu.Item>
            <Menu.Root>
              <Menu.SubmenuTrigger>Submenu</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup>
                    <Menu.Item>Submenu Item 1</Menu.Item>
                    <Menu.Item>Submenu Item 2</Menu.Item>
                    <Menu.Item>Submenu Item 3</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const SubmenuCombobox = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Flex direction="column" gap="1" align="start">
      <Text style={{ marginBottom: 16 }}>
        {selectedValues.length === 0
          ? 'Which is your favorite fruit?'
          : `Yum, ${selectedValues[0]} is delicious!`}
      </Text>
      <Menu.Root>
        <Menu.Trigger
          render={props => (
            <Button
              {...props}
              size="small"
              variant="secondary"
              iconEnd={<Icon name="chevron-down" />}
            >
              Select Fruits
            </Button>
          )}
        />
        <Menu.Portal>
          <Menu.Positioner sideOffset={4} align="start">
            <Menu.Popup>
              <Menu.Item>Regular Item</Menu.Item>
              <Menu.Root>
                <Menu.SubmenuTrigger>Fruits</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={8} align="start">
                    <Menu.Popup>
                      <Menu.Combobox
                        options={options}
                        value={selectedValues}
                        onValueChange={setSelectedValues}
                      />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
              <Menu.Item>Another Item</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Flex>
  );
};

export const SubmenuComboboxMultiselect = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Flex direction="column" gap="1" align="start">
      <Text style={{ marginBottom: 16 }}>
        {selectedValues.length === 0
          ? 'Tell us what fruits you like.'
          : `${selectedValues.join(
              ', ',
            )} would make for a great, healthy smoothy!`}
      </Text>
      <Menu.Root>
        <Menu.Trigger
          render={props => (
            <Button
              {...props}
              size="small"
              variant="secondary"
              iconEnd={<Icon name="chevron-down" />}
            >
              Select Fruits
            </Button>
          )}
        />
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Regular Item</Menu.Item>
              <Menu.Root>
                <Menu.SubmenuTrigger>Fruits</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      <Menu.Combobox
                        multiselect
                        options={options}
                        value={selectedValues}
                        onValueChange={setSelectedValues}
                      />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
              <Menu.Item>Another Item</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Flex>
  );
};
