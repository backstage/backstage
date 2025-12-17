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
import { MenuTrigger, MenuListBox, MenuListBoxItem } from './index';
import { Button, Flex, Text } from '../..';
import { useEffect, useState } from 'react';
import { Selection } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/MenuListBox',
  component: MenuTrigger,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

export const Default = meta.story({
  args: {
    children: null,
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

export const Controlled = meta.story({
  args: {
    ...Default.input.args,
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
        <MenuListBox items={pokemon} virtualized>
          {pokemon.map((p, index) => (
            <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>
          ))}
        </MenuListBox>
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
        <MenuListBox items={pokemon} virtualized maxHeight="300px">
          {pokemon.map((p, index) => (
            <MenuListBoxItem key={index} id={p.name}>
              {p.name.charAt(0).toLocaleUpperCase('en-US') + p.name.slice(1)}
            </MenuListBoxItem>
          ))}
        </MenuListBox>
      </MenuTrigger>
    );
  },
});
