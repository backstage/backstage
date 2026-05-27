'use client';

import { Combobox } from '../../../../../packages/ui/src/components/Combobox/Combobox';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiCloudLine } from '@remixicon/react';

const fontOptions = [
  { value: 'sans', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
];

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'au', label: 'Australia' },
];

const sectionedFonts = [
  {
    title: 'Serif Fonts',
    options: [
      { value: 'times', label: 'Times New Roman' },
      { value: 'georgia', label: 'Georgia' },
      { value: 'garamond', label: 'Garamond' },
    ],
  },
  {
    title: 'Sans-Serif Fonts',
    options: [
      { value: 'arial', label: 'Arial' },
      { value: 'helvetica', label: 'Helvetica' },
      { value: 'verdana', label: 'Verdana' },
    ],
  },
  {
    title: 'Monospace Fonts',
    options: [
      { value: 'courier', label: 'Courier New' },
      { value: 'consolas', label: 'Consolas' },
      { value: 'fira', label: 'Fira Code' },
    ],
  },
];

export const Preview = () => (
  <Combobox
    label="Font Family"
    options={fontOptions}
    placeholder="Pick a font"
    name="font"
    style={{ maxWidth: 260 }}
  />
);

export const WithLabelAndDescription = () => (
  <Combobox
    label="Font Family"
    description="Choose a font family for your document"
    options={fontOptions}
    placeholder="Pick a font"
    name="font"
    style={{ width: 300 }}
  />
);

export const Sizes = () => (
  <Flex direction="row" gap="2">
    <Combobox
      label="Small"
      size="small"
      options={fontOptions}
      name="font-small"
      placeholder="Pick a font"
      style={{ maxWidth: 260 }}
    />
    <Combobox
      label="Medium"
      size="medium"
      options={fontOptions}
      name="font-medium"
      placeholder="Pick a font"
      style={{ maxWidth: 260 }}
    />
  </Flex>
);

export const WithIcon = () => (
  <Combobox
    label="Font Family"
    options={fontOptions}
    placeholder="Pick a font"
    name="font"
    icon={<RiCloudLine />}
    style={{ width: 300 }}
  />
);

export const Disabled = () => (
  <Combobox
    label="Font Family"
    options={fontOptions}
    placeholder="Pick a font"
    name="font"
    isDisabled
    style={{ width: 300 }}
  />
);

export const AllowsCustomValue = () => (
  <Combobox
    label="Country"
    options={countries}
    placeholder="Type any country"
    allowsCustomValue
    name="country"
    style={{ width: 300 }}
  />
);

export const DisabledOption = () => (
  <Combobox
    label="Font Family"
    options={fontOptions}
    placeholder="Pick a font"
    name="font"
    disabledKeys={['serif']}
    style={{ width: 300 }}
  />
);

export const WithSections = () => (
  <Combobox
    label="Font Family"
    options={sectionedFonts}
    placeholder="Pick a font"
    name="font"
    style={{ width: 300 }}
  />
);
