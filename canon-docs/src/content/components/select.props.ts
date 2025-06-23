import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const selectPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
    default: 'Select an option',
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
  value: {
    type: 'string',
    responsive: false,
  },
  defaultValue: {
    type: 'string',
    responsive: false,
  },
  placeholder: {
    type: 'string',
    responsive: false,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'medium',
    responsive: true,
  },
  onValueChange: {
    type: 'enum',
    values: ['(value: string) => void'],
    responsive: false,
  },
  onOpenChange: {
    type: 'enum',
    values: ['(open: boolean) => void'],
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const selectUsageSnippet = `import { Select } from '@backstage/canon';

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
