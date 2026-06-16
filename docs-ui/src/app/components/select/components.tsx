'use client';

import { Select } from '../../../../../packages/ui/src/components/Select/Select';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiCloudLine } from '@remixicon/react';

const fontOptions = [
  { id: 'sans', label: 'Sans-serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Monospace' },
  { id: 'cursive', label: 'Cursive' },
];

const countries = [
  { id: 'us', label: 'United States' },
  { id: 'ca', label: 'Canada' },
  { id: 'mx', label: 'Mexico' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany' },
  { id: 'it', label: 'Italy' },
  { id: 'es', label: 'Spain' },
  { id: 'jp', label: 'Japan' },
  { id: 'cn', label: 'China' },
  { id: 'in', label: 'India' },
  { id: 'br', label: 'Brazil' },
  { id: 'au', label: 'Australia' },
];

const skills = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
];

const sectionedFonts = [
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
  {
    title: 'Monospace Fonts',
    options: [
      { id: 'courier', label: 'Courier New' },
      { id: 'consolas', label: 'Consolas' },
      { id: 'fira', label: 'Fira Code' },
    ],
  },
];

export const Preview = () => (
  <Select
    label="Font Family"
    options={fontOptions}
    placeholder="Select a font"
    name="font"
    style={{ maxWidth: 260 }}
  />
);

export const WithLabelAndDescription = () => (
  <Select
    label="Font Family"
    description="Choose a font family for your document"
    options={fontOptions}
    name="font"
    style={{ width: 300 }}
  />
);

export const Sizes = () => (
  <Flex direction="row" gap="2">
    <Select
      label="Small"
      size="small"
      options={fontOptions}
      name="font-small"
      placeholder="Select a font"
      style={{ maxWidth: 260 }}
    />
    <Select
      label="Medium"
      size="medium"
      options={fontOptions}
      name="font-medium"
      placeholder="Select a font"
      style={{ maxWidth: 260 }}
    />
  </Flex>
);

export const WithIcon = () => (
  <Select
    label="Font Family"
    options={fontOptions}
    name="font"
    icon={<RiCloudLine />}
    style={{ width: 300 }}
  />
);

export const Disabled = () => (
  <Select
    label="Font Family"
    options={fontOptions}
    name="font"
    isDisabled
    style={{ width: 300 }}
  />
);

export const DisabledOption = () => (
  <Select
    label="Select an option"
    options={fontOptions}
    name="font"
    disabledKeys={['serif']}
    style={{ width: 300 }}
  />
);

export const Searchable = () => (
  <Select
    label="Country"
    search={{ placeholder: 'Search countries...' }}
    options={countries}
    name="country"
    style={{ width: 300 }}
  />
);

export const MultipleSelection = () => (
  <Select
    label="Select multiple options"
    selectionMode="multiple"
    options={[
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
      { id: 'option3', label: 'Option 3' },
      { id: 'option4', label: 'Option 4' },
    ]}
    name="multiple"
    style={{ width: 300 }}
  />
);

export const SearchableMultiple = () => (
  <Select
    label="Skills"
    selectionMode="multiple"
    search={{ placeholder: 'Filter skills...' }}
    options={skills}
    name="skills"
    style={{ width: 300 }}
  />
);

export const WithSections = () => (
  <Select
    label="Font Family"
    options={sectionedFonts}
    name="font"
    style={{ width: 300 }}
  />
);

export const SearchableWithSections = () => (
  <Select
    label="Font Family"
    search={{ placeholder: 'Search fonts...' }}
    options={sectionedFonts}
    name="font"
    style={{ width: 300 }}
  />
);
