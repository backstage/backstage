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
import {
  MenuTrigger,
  SubmenuTrigger,
  Menu,
  MenuListBox,
  MenuAutocomplete,
  MenuAutocompleteListbox,
  MenuItem,
  MenuListBoxItem,
  MenuSection,
  MenuSeparator,
} from './index';
import { Button, Flex, Text } from '../..';
import {
  RiChat1Line,
  RiEdit2Line,
  RiFileCopyLine,
  RiCustomerService2Line,
  RiQuestionLine,
  RiSettingsLine,
  RiUserLine,
  RiDeleteBinLine,
  RiShareBoxLine,
} from '@remixicon/react';
import { useState } from 'react';
import { Selection } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';
import { MenuItem as AriaMenuItem } from 'react-aria-components';

const meta = preview.meta({
  title: 'Backstage UI/Menu',
  component: MenuTrigger,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

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

export const Preview = meta.story({
  args: {
    children: null,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
        <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
        <MenuSeparator />
        <SubmenuTrigger>
          <MenuItem iconStart={<RiSettingsLine />}>Settings</MenuItem>
          <Menu placement="right top">
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Rename</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewSubmenu = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <Menu placement="right top">
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuSeparator />
            <MenuItem>Share</MenuItem>
            <MenuItem>Move</MenuItem>
            <MenuSeparator />
            <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewIcons = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem iconStart={<RiFileCopyLine />}>Copy</MenuItem>
        <MenuItem iconStart={<RiEdit2Line />}>Rename</MenuItem>
        <MenuItem iconStart={<RiChat1Line />}>Send feedback</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewSections = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuSection title="My Account">
          <MenuItem iconStart={<RiUserLine />}>Profile</MenuItem>
          <MenuItem iconStart={<RiSettingsLine />}>Settings</MenuItem>
        </MenuSection>
        <MenuSection title="Support">
          <MenuItem iconStart={<RiQuestionLine />}>Help Center</MenuItem>
          <MenuItem iconStart={<RiCustomerService2Line />}>
            Contact Support
          </MenuItem>
          <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewSeparators = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem>Share</MenuItem>
        <MenuItem>Move</MenuItem>
        <MenuSeparator />
        <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewLinks = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem href="/home">Internal link</MenuItem>
        <MenuItem href="https://www.google.com" target="_blank">
          External link
        </MenuItem>
        <MenuItem href="mailto:test@test.com">Email link</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const PreviewAutocompleteMenu = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
  ),
});

export const PreviewAutocompleteListbox = meta.story({
  args: {
    ...Preview.input.args,
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
});

export const PreviewAutocompleteListboxMultiple = meta.story({
  args: {
    ...Preview.input.args,
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
});

export const Opened = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        {options.map(option => (
          <MenuItem key={option.value}>{option.label}</MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  ),
});

export const WithIcons = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem iconStart={<RiFileCopyLine />}>Copy</MenuItem>
        <MenuItem iconStart={<RiEdit2Line />}>Rename</MenuItem>
        <MenuItem iconStart={<RiChat1Line />}>Send feedback</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithScrolling = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu with Scrolling</Button>
      <Menu>
        {Array.from({ length: 50 }, (_, i) => (
          <MenuItem key={i}>
            Item {i + 1} - This is a long menu item to demonstrate scrolling
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  ),
});

export const WithSections = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuSection title="My Account">
          <MenuItem iconStart={<RiUserLine />}>Profile</MenuItem>
          <MenuItem iconStart={<RiSettingsLine />}>Settings</MenuItem>
        </MenuSection>
        <MenuSection title="Support">
          <MenuItem iconStart={<RiQuestionLine />}>Help Center</MenuItem>
          <MenuItem iconStart={<RiCustomerService2Line />}>
            Contact Support
          </MenuItem>
          <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithSeparators = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem>Share</MenuItem>
        <MenuItem>Move</MenuItem>
        <MenuSeparator />
        <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithColors = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithLinks = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem href="/home">Internal link</MenuItem>
        <MenuItem href="https://www.google.com" target="_blank">
          External link
        </MenuItem>
        <MenuItem href="mailto:test@test.com">Email link</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithLinksTest = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <AriaMenuItem href="/home">Internal link</AriaMenuItem>
        <AriaMenuItem href="https://www.google.com">External link</AriaMenuItem>
        <AriaMenuItem href="mailto:test@test.com">Email link</AriaMenuItem>
      </Menu>
    </MenuTrigger>
  ),
});

export const WithListBox = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuListBox>
        <MenuListBoxItem>Item 1</MenuListBoxItem>
        <MenuListBoxItem>Item 2</MenuListBoxItem>
        <MenuListBoxItem>Item 3</MenuListBoxItem>
      </MenuListBox>
    </MenuTrigger>
  ),
});

export const WithListBoxControlled = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => {
    const [selected, setSelected] = useState<Selection>(new Set(['paul']));

    return (
      <Flex direction="column" gap="2" align="start">
        <Text>Selected: {Array.from(selected).join(', ')}</Text>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuListBox
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
          >
            <MenuListBoxItem key="item1" id="john">
              John Lennon
            </MenuListBoxItem>
            <MenuListBoxItem key="item2" id="paul">
              Paul McCartney
            </MenuListBoxItem>
            <MenuListBoxItem key="item3" id="george">
              George Harrison
            </MenuListBoxItem>
            <MenuListBoxItem key="item4" id="ringo">
              Ringo Starr
            </MenuListBoxItem>
          </MenuListBox>
        </MenuTrigger>
      </Flex>
    );
  },
});

export const WithAutocompleteMenu = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <MenuAutocomplete placeholder="Filter">
        <MenuItem>Create new file...</MenuItem>
        <MenuItem>Create new folder...</MenuItem>
        <MenuItem>Assign to...</MenuItem>
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Change status...</MenuItem>
        <MenuItem>Change priority...</MenuItem>
        <MenuItem>Add label...</MenuItem>
        <MenuItem>Remove label...</MenuItem>
      </MenuAutocomplete>
    </MenuTrigger>
  ),
});

export const WithAutocompleteListbox = meta.story({
  args: {
    ...Preview.input.args,
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
});

export const Submenu = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <Menu>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuSeparator />
            <MenuItem>Share</MenuItem>
            <MenuItem>Move</MenuItem>
            <MenuSeparator />
            <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
});

export const SubmenuAutocompleteMenu = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <MenuAutocomplete>
            {options.map(option => (
              <MenuItem key={option.value} id={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </MenuAutocomplete>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
});

export const SubmenuAutocompleteListbox = meta.story({
  args: {
    ...Preview.input.args,
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
            <SubmenuTrigger>
              <MenuItem>Submenu</MenuItem>
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
            </SubmenuTrigger>
          </Menu>
        </MenuTrigger>
      </Flex>
    );
  },
});
