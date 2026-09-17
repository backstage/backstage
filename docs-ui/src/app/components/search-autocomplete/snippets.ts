export const usage = `import { SearchAutocomplete, SearchAutocompleteItem } from '@backstage/ui';

<SearchAutocomplete
  inputValue={inputValue}
  onInputChange={setInputValue}
>
  {items.map(item => (
    <SearchAutocompleteItem key={item.id} id={item.id} textValue={item.name}>
      {item.name}
    </SearchAutocompleteItem>
  ))}
</SearchAutocomplete>`;

export const defaultSnippet = `const fruits = [
  { id: 'apple', name: 'Apple' },
  { id: 'banana', name: 'Banana' },
  { id: 'cherry', name: 'Cherry' },
  { id: 'grape', name: 'Grape' },
  { id: 'orange', name: 'Orange' },
];

function Example() {
  const [inputValue, setInputValue] = useState('');

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <SearchAutocomplete
      placeholder="Search fruits..."
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
}`;

export const withRichContent = `const fruits = [
  { id: 'apple', name: 'Apple', description: 'A round fruit' },
  { id: 'banana', name: 'Banana', description: 'A yellow curved fruit' },
  { id: 'cherry', name: 'Cherry', description: 'A small red stone fruit' },
];

function Example() {
  const [inputValue, setInputValue] = useState('');

  const filtered = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <SearchAutocomplete
      placeholder="Search fruits..."
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
}`;

export const inHeader = `<PluginHeader
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
/>`;

export const withSelection = `function Example() {
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
}`;
