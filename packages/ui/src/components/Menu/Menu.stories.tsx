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
  MenuItem,
  MenuSection,
  MenuSeparator,
} from './index';
import { Button } from '../..';
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
import { MemoryRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

export const Virtualized = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => {
    const [pokemon, setPokemon] = useState<
      Array<{ name: string; url: string }>
    >([]);

    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => {
          setPokemon(data.results);
        })
        .catch(error => {
          console.error('Error fetching Pokemon:', error);
        });
    }, []);

    return (
      <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <Menu items={pokemon} virtualized>
          {pokemon.map((p, index) => (
            <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    );
  },
});

export const VirtualizedMaxHeight = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: () => {
    const [pokemon, setPokemon] = useState<
      Array<{ name: string; url: string }>
    >([]);

    useEffect(() => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => {
          setPokemon(data.results);
        })
        .catch(error => {
          console.error('Error fetching Pokemon:', error);
        });
    }, []);

    return (
      <MenuTrigger isOpen>
        <Button aria-label="Menu">Menu</Button>
        <Menu items={pokemon} virtualized maxHeight="300px">
          {pokemon.map((p, index) => (
            <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    );
  },
});

export const WithScroll = meta.story({
  args: {
    children: null,
  },
  decorators: [
    Story => (
      <div style={{ height: '2000px', overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
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
