/*
 * Copyright 2026 The Backstage Authors
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
/* eslint-disable no-restricted-syntax */

import preview from '../../../../../.storybook/preview';
import { useState, useEffect } from 'react';
import {
  SearchAutocomplete,
  SearchAutocompleteItem,
} from './SearchAutocomplete';
import { PluginHeader } from '../PluginHeader';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { ButtonIcon } from '../ButtonIcon';
import { RiCactusLine } from '@remixicon/react';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/SearchAutocomplete',
  component: SearchAutocomplete,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    placeholder: {
      control: 'text',
    },
    popoverWidth: {
      control: 'text',
    },
  },
});

const fruits = [
  { id: 'apple', name: 'Apple', description: 'A round fruit' },
  { id: 'banana', name: 'Banana', description: 'A yellow curved fruit' },
  { id: 'blueberry', name: 'Blueberry', description: 'A small blue berry' },
  { id: 'cherry', name: 'Cherry', description: 'A small red stone fruit' },
  { id: 'grape', name: 'Grape', description: 'Grows in clusters on vines' },
  { id: 'lemon', name: 'Lemon', description: 'A sour yellow citrus fruit' },
  { id: 'mango', name: 'Mango', description: 'A tropical stone fruit' },
  { id: 'orange', name: 'Orange', description: 'A citrus fruit' },
  { id: 'peach', name: 'Peach', description: 'A fuzzy stone fruit' },
  {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'A red fruit with seeds on its surface',
  },
];

export const WithItems = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <SearchAutocomplete
        {...args}
        inputValue={inputValue}
        onInputChange={setInputValue}
      >
        {filtered.map(fruit => (
          <SearchAutocompleteItem
            key={fruit.id}
            id={fruit.id}
            textValue={fruit.name}
          >
            {fruit.name}
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});

export const WithRichContent = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <SearchAutocomplete
        {...args}
        inputValue={inputValue}
        onInputChange={setInputValue}
      >
        {filtered.map(fruit => (
          <SearchAutocompleteItem
            key={fruit.id}
            id={fruit.id}
            textValue={fruit.name}
          >
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});

export const WithAsyncItems = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState<typeof fruits>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (!inputValue) {
        setItems([]);
        return undefined;
      }

      setIsLoading(true);
      const timeout = setTimeout(() => {
        setItems(
          fruits.filter(fruit =>
            fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }, [inputValue]);

    return (
      <SearchAutocomplete
        {...args}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isLoading={isLoading}
      >
        {items.map(item => (
          <SearchAutocompleteItem
            key={item.id}
            id={item.id}
            textValue={item.name}
          >
            <Text weight="bold">{item.name}</Text>
            <Text variant="body-small" color="secondary">
              {item.description}
            </Text>
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});

export const WithSelection = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const [selected, setSelected] = useState<string | null>(null);

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <Flex direction="column" gap="4">
        <SearchAutocomplete
          {...args}
          inputValue={inputValue}
          onInputChange={setInputValue}
        >
          {filtered.map(fruit => (
            <SearchAutocompleteItem
              key={fruit.id}
              id={fruit.id}
              textValue={fruit.name}
              onAction={() => {
                setSelected(fruit.name);
                setInputValue('');
              }}
            >
              {fruit.name}
            </SearchAutocompleteItem>
          ))}
        </SearchAutocomplete>
        <Text>Last selected: {selected ?? 'none'}</Text>
      </Flex>
    );
  },
});

export const Sizes = meta.story({
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <Flex
        direction="row"
        gap="4"
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <SearchAutocomplete
          {...args}
          size="small"
          inputValue={inputValue}
          onInputChange={setInputValue}
        >
          {filtered.map(fruit => (
            <SearchAutocompleteItem
              key={fruit.id}
              id={fruit.id}
              textValue={fruit.name}
            >
              {fruit.name}
            </SearchAutocompleteItem>
          ))}
        </SearchAutocomplete>
        <SearchAutocomplete
          {...args}
          size="medium"
          inputValue={inputValue}
          onInputChange={setInputValue}
        >
          {filtered.map(fruit => (
            <SearchAutocompleteItem
              key={fruit.id}
              id={fruit.id}
              textValue={fruit.name}
            >
              {fruit.name}
            </SearchAutocompleteItem>
          ))}
        </SearchAutocomplete>
      </Flex>
    );
  },
});

export const InHeader = meta.story({
  args: {
    'aria-label': 'Search',
    placeholder: 'Search...',
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <PluginHeader
        title="Title"
        customActions={
          <>
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
            <SearchAutocomplete
              {...args}
              size="small"
              inputValue={inputValue}
              onInputChange={setInputValue}
              popoverWidth="400px"
            >
              {filtered.map(fruit => (
                <SearchAutocompleteItem
                  key={fruit.id}
                  id={fruit.id}
                  textValue={fruit.name}
                >
                  {fruit.name}
                </SearchAutocompleteItem>
              ))}
            </SearchAutocomplete>
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
          </>
        }
      />
    );
  },
});

export const WithPopoverWidth = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    popoverWidth: '500px',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <SearchAutocomplete
        {...args}
        inputValue={inputValue}
        onInputChange={setInputValue}
      >
        {filtered.map(fruit => (
          <SearchAutocompleteItem
            key={fruit.id}
            id={fruit.id}
            textValue={fruit.name}
          >
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});

export const OpenByDefault = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    defaultOpen: true,
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('ap');

    const filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    return (
      <SearchAutocomplete
        {...args}
        inputValue={inputValue}
        onInputChange={setInputValue}
      >
        {filtered.map(fruit => (
          <SearchAutocompleteItem
            key={fruit.id}
            id={fruit.id}
            textValue={fruit.name}
          >
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});

export const OpenWithLoading = meta.story({
  args: {
    'aria-label': 'Search fruits',
    placeholder: 'Search fruits...',
    defaultOpen: true,
    isLoading: true,
    inputValue: 'ap',
    style: { maxWidth: '300px' },
  },
  render: function Render(args) {
    return (
      <SearchAutocomplete {...args} onInputChange={() => {}}>
        {fruits.slice(0, 3).map(fruit => (
          <SearchAutocompleteItem
            key={fruit.id}
            id={fruit.id}
            textValue={fruit.name}
          >
            <Text weight="bold">{fruit.name}</Text>
            <Text variant="body-small" color="secondary">
              {fruit.description}
            </Text>
          </SearchAutocompleteItem>
        ))}
      </SearchAutocomplete>
    );
  },
});
