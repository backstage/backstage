export const selectUsageSnippet = `import { Select } from '@backstage/ui';

<Select
  name="font"
  label="Font Family"
  options={[
    { id: 'sans', label: 'Sans-serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
    { id: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const selectDefaultSnippet = `<Select name="font" label="Font Family" options={[
  { id: 'sans', label: 'Sans-serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Monospace' },
  { id: 'cursive', label: 'Cursive' },
]} />`;

export const selectDescriptionSnippet = `<Select
  name="font"
  label="Font Family"
  description="Choose a font family for your document"
  options={[ ... ]}
/>`;

export const selectIconSnippet = `<Select
  name="font"
  label="Font Family"
  icon={<RiCloudLine />}
  options={[ ... ]}
/>`;

export const selectSizesSnippet = `<Flex>
  <Select
    size="small"
    label="Font family"
    options={[ ... ]}
  />
  <Select
    size="medium"
    label="Font family"
    options={[ ... ]}
  />
</Flex>`;

export const selectDisabledSnippet = `<Select
  isDisabled
  label="Font family"
  options={[ ... ]}
/>`;

export const selectResponsiveSnippet = `<Select
  size={{ initial: 'small', lg: 'medium' }}
  label="Font family"
  options={[ ... ]}
/>`;

export const selectSearchableSnippet = `<Select
  name="country"
  label="Country"
  search={{ placeholder: 'Search countries...' }}
  options={[
    { id: 'us', label: 'United States' },
    { id: 'ca', label: 'Canada' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'fr', label: 'France' },
    { id: 'de', label: 'Germany' },
    // ... more options
  ]}
/>`;

export const selectCustomSearchSnippet = `<Select
  label="Owner"
  options={ownerOptions}
  search={{
    placeholder: 'Search owners...',
    filter: (option, query) =>
      option.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()),
  }}
/>`;

export const selectMultipleSnippet = `<Select
  name="options"
  label="Select multiple options"
  selectionMode="multiple"
  options={[
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' },
    { id: 'option4', label: 'Option 4' },
  ]}
/>`;

export const selectSearchableMultipleSnippet = `<Select
  name="skills"
  label="Skills"
  search={{ placeholder: 'Filter skills...' }}
  selectionMode="multiple"
  options={[
    { id: 'react', label: 'React' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    // ... more options
  ]}
/>`;

export const selectDisabledOptionsSnippet = `<Select
  name="font"
  label="Font Family"
  placeholder="Select a font"
  disabledKeys={['cursive', 'serif']}
  options={[
    { id: 'sans', label: 'Sans-serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Monospace' },
    { id: 'cursive', label: 'Cursive' },
  ]}
/>`;

export const selectSectionsSnippet = `<Select
  name="font"
  label="Font Family"
  options={[
    {
      title: 'Serif Fonts',
      options: [
        { id: 'times', label: 'Times New Roman' },
        { id: 'georgia', label: 'Georgia' },
        { id: 'garamond', label: 'Garamond' },
      ],
    },
    {
      title: 'Sans-Serif Fonts',
      options: [
        { id: 'arial', label: 'Arial' },
        { id: 'helvetica', label: 'Helvetica' },
        { id: 'verdana', label: 'Verdana' },
      ],
    },
  ]}
/>`;

export const selectSearchableSectionsSnippet = `<Select
  name="font"
  label="Font Family"
  search={{ placeholder: 'Search fonts...' }}
  options={[
    {
      title: 'Serif Fonts',
      options: [
        { id: 'times', label: 'Times New Roman' },
        { id: 'georgia', label: 'Georgia' },
      ],
    },
    {
      title: 'Sans-Serif Fonts',
      options: [
        { id: 'arial', label: 'Arial' },
        { id: 'helvetica', label: 'Helvetica' },
      ],
    },
  ]}
/>`;

export const selectCustomItemsSnippet = `import { Select, SelectItem } from '@backstage/ui';

<Select label="Release channel" items={releaseChannels}>
  {channel => (
    <SelectItem textValue={channel.name} showSelectionIndicator>
      <CustomReleaseChannel channel={channel} />
    </SelectItem>
  )}
</Select>`;

export const selectAsyncSnippet = `import { Select, useAsyncList } from '@backstage/ui';

const owners = useAsyncList({
  async load({ signal, filterText, cursor }) {
    return fetchOwners({ signal, query: filterText, cursor });
  },
});

<Select
  label="Owner"
  options={owners}
  search={{ mode: 'server', placeholder: 'Search owners...' }}
/>`;

export const selectManualLoadingSnippet = `<Select
  label="Owner"
  options={results}
  search={{
    mode: 'server',
    inputValue: query,
    onInputChange: setQuery,
  }}
  loading={{ state: isLoading ? 'filtering' : 'idle', onLoadMore }}
/>`;
