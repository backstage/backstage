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
  MenuAutocomplete,
  MenuItem,
} from './index';
import { Button } from '../..';
import { useState, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/MenuAutocomplete',
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

export const Default = meta.story({
  args: {
    children: null,
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

export const PreviewAutocompleteMenu = meta.story({
  args: {
    ...Default.input.args,
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

export const Virtualized = meta.story({
  args: {
    ...Default.input.args,
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
        <MenuAutocomplete
          items={pokemon}
          placeholder="Search Pokemon..."
          virtualized
        >
          {pokemon.map((p, index) => (
            <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>
          ))}
        </MenuAutocomplete>
      </MenuTrigger>
    );
  },
});

export const VirtualizedMaxHeight = meta.story({
  args: {
    ...Default.input.args,
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
        <MenuAutocomplete
          items={pokemon}
          placeholder="Search Pokemon..."
          virtualized
          maxHeight="300px"
        >
          {pokemon.map((p, index) => (
            <MenuItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuItem>
          ))}
        </MenuAutocomplete>
      </MenuTrigger>
    );
  },
});

export const Submenu = meta.story({
  args: {
    ...Default.input.args,
  },
  render: () => (
    <MenuTrigger isOpen>
      <Button aria-label="Menu">Menu</Button>
      <Menu>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Submenu</MenuItem>
          <MenuAutocomplete placement="right top">
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
