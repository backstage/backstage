import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const selectPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    responsive: false,
  },
  description: {
    type: 'string',
    responsive: false,
  },
  name: {
    type: 'string',
    responsive: false,
    required: true,
  },
  options: {
    type: 'enum',
    values: ['Array<{ value: string, label: string }>'],
    required: true,
  },
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    default: 'single',
    responsive: false,
  },
  placeholder: {
    type: 'string',
    default: 'Select an item',
    responsive: false,
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    responsive: false,
  },
  value: {
    type: 'enum',
    values: ['string', 'string[]'],
    responsive: false,
    description:
      'Selected value (controlled). String for single selection, array for multiple.',
  },
  defaultValue: {
    type: 'enum',
    values: ['string', 'string[]'],
    responsive: false,
    description:
      'Initial value (uncontrolled). String for single selection, array for multiple.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
  },
  isOpen: {
    type: 'boolean',
    responsive: false,
  },
  defaultOpen: {
    type: 'boolean',
    responsive: false,
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    responsive: false,
  },
  isDisabled: {
    type: 'boolean',
    responsive: false,
  },
  isRequired: {
    type: 'boolean',
    responsive: false,
  },
  isInvalid: {
    type: 'boolean',
    responsive: false,
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    responsive: false,
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key | null) => void', '(keys: Selection) => void'],
    responsive: false,
    description:
      'Handler called when selection changes. Single mode: receives Key | null. Multiple mode: receives Selection.',
  },
  searchable: {
    type: 'boolean',
    default: 'false',
    responsive: false,
  },
  searchPlaceholder: {
    type: 'string',
    default: 'Search...',
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

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
  disabled
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
