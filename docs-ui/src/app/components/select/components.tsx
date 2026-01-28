'use client';

import { Select } from '../../../../../packages/ui/src/components/Select/Select';
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

const skills = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
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
    searchable
    searchPlaceholder="Search countries..."
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
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
    ]}
    name="multiple"
    style={{ width: 300 }}
  />
);

export const SearchableMultiple = () => (
  <Select
    label="Skills"
    searchable
    selectionMode="multiple"
    searchPlaceholder="Filter skills..."
    options={skills}
    name="skills"
    style={{ width: 300 }}
  />
);
