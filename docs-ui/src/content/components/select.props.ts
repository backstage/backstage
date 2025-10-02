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
    type: 'string',
    responsive: false,
  },
  defaultValue: {
    type: 'string',
    responsive: false,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
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
    values: ['string[]'],
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
  selectedKey: {
    type: 'string',
    responsive: false,
  },
  defaultSelectedKey: {
    type: 'string',
    responsive: false,
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    responsive: false,
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(key: Key | null) => void'],
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
