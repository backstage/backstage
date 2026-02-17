export const selectUsageSnippet = `import { Select } from '@backstage/ui';

<Select
    name="font"
    options={[
      { value: 'sans', label: 'Sans-serif' },
      { value: 'serif', label: 'Serif' },
      { value: 'mono', label: 'Monospace' },
      { value: 'cursive', label: 'Cursive' },
    ]}
/>`;

export const selectDefaultSnippet = `<Select name="font" label="Font Family" options={[
  { value: 'sans', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
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
  searchable
  searchPlaceholder="Search countries..."
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    // ... more options
  ]}
/>`;

export const selectMultipleSnippet = `<Select
  name="options"
  label="Select multiple options"
  selectionMode="multiple"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ]}
/>`;

export const selectSearchableMultipleSnippet = `<Select
  name="skills"
  label="Skills"
  searchable
  selectionMode="multiple"
  searchPlaceholder="Filter skills..."
  options={[
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    // ... more options
  ]}
/>`;

export const selectDisabledOptionsSnippet = `<Select
  name="font"
  label="Font Family"
  placeholder="Select a font"
  disabledKeys={['cursive', 'serif']}
  options={[
    { value: 'sans', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
  ]}
/>`;
