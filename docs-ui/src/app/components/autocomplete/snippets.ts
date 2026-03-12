export const autocompleteUsageSnippet = `import { Autocomplete } from '@backstage/ui';

<Autocomplete
  label="Country"
  options={countries}
  placeholder="Type to search..."
/>`;

export const basicSnippet = `<Autocomplete
  label="Programming Language"
  options={[
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
  ]}
  placeholder="Type to search..."
/>`;

export const withIconSnippet = `<Autocomplete
  label="Country"
  icon={<RiSearchLine />}
  options={countries}
  placeholder="Type to search..."
/>`;

export const sizesSnippet = `<Flex direction="column" gap="4">
  <Autocomplete
    size="small"
    label="Small"
    options={options}
    placeholder="Type to search..."
  />
  <Autocomplete
    size="medium"
    label="Medium"
    options={options}
    placeholder="Type to search..."
  />
</Flex>`;

export const withDescriptionSnippet = `<Autocomplete
  label="Country"
  description="Select your country of residence"
  options={countries}
  placeholder="Type to search..."
/>`;

export const customValueSnippet = `<Autocomplete
  label="Custom Value"
  description="Type your own value or select from list"
  options={options}
  allowsCustomValue
  placeholder="Type to search or enter custom..."
/>`;

export const disabledSnippet = `<Autocomplete
  label="Disabled"
  options={options}
  isDisabled
/>`;

export const requiredSnippet = `<Autocomplete
  label="Required Field"
  options={options}
  isRequired
/>`;

export const menuDisplaySnippet = `<Autocomplete
  label="Menu Style"
  displayMode="menu"
  options={options}
  placeholder="Select a language..."
/>`;

export const gridDisplaySnippet = `<Autocomplete
  label="Grid Layout"
  displayMode="grid"
  options={options}
  gridConfig={{ columns: 3, gap: 'var(--bui-space-2)' }}
  placeholder="Choose..."
/>`;

export const tagsDisplaySnippet = `<Autocomplete
  label="Tags Style"
  displayMode="tags"
  options={options}
  placeholder="Select..."
/>`;

export const tableDisplaySnippet = `<Autocomplete
  label="Service Selection"
  displayMode="table"
  options={services}
  tableColumns={[
    { key: 'label', label: 'Service', width: '2fr' },
    { key: 'type', label: 'Type', width: '1fr' },
    { key: 'status', label: 'Status', width: '1fr' },
  ]}
  placeholder="Search services..."
/>`;
