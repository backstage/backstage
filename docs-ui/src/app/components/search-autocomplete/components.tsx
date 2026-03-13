'use client';

import { useState } from 'react';
import {
  SearchAutocomplete,
  SearchAutocompleteItem,
} from '../../../../../packages/ui/src/components/SearchAutocomplete/SearchAutocomplete';
import { PluginHeader } from '../../../../../packages/ui/src/components/PluginHeader/PluginHeader';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { MemoryRouter } from 'react-router-dom';

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

export const WithItems = () => {
  const [inputValue, setInputValue] = useState('');

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <SearchAutocomplete
      placeholder="Search fruits..."
      inputValue={inputValue}
      onInputChange={setInputValue}
      style={{ maxWidth: '300px' }}
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
};

export const WithRichContent = () => {
  const [inputValue, setInputValue] = useState('');

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <SearchAutocomplete
      placeholder="Search fruits..."
      inputValue={inputValue}
      onInputChange={setInputValue}
      style={{ maxWidth: '300px' }}
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
};

export const InHeader = () => {
  const [inputValue, setInputValue] = useState('');

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <MemoryRouter>
      <PluginHeader
        title="Title"
        customActions={
          <>
            <SearchAutocomplete
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
          </>
        }
      />
    </MemoryRouter>
  );
};

export const WithSelection = () => {
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Flex direction="column" gap="4">
      <SearchAutocomplete
        placeholder="Search fruits..."
        inputValue={inputValue}
        onInputChange={setInputValue}
        style={{ maxWidth: '300px' }}
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
};
