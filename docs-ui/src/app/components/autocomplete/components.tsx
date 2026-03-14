'use client';

import { Autocomplete } from '../../../../../packages/ui/src/components/Autocomplete/Autocomplete';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import {
  RiSearchLine,
  RiCodeLine,
  RiDatabase2Line,
  RiServerLine,
  RiGlobalLine,
} from '@remixicon/react';

const programmingLanguages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: <RiCodeLine />,
    description: 'Dynamic scripting',
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    icon: <RiCodeLine />,
    description: 'Typed superset of JS',
  },
  {
    value: 'python',
    label: 'Python',
    icon: <RiCodeLine />,
    description: 'General purpose',
  },
  {
    value: 'java',
    label: 'Java',
    icon: <RiCodeLine />,
    description: 'Enterprise ready',
  },
  {
    value: 'csharp',
    label: 'C#',
    icon: <RiCodeLine />,
    description: '.NET framework',
  },
  {
    value: 'go',
    label: 'Go',
    icon: <RiCodeLine />,
    description: 'Compiled, concurrent',
  },
  {
    value: 'rust',
    label: 'Rust',
    icon: <RiCodeLine />,
    description: 'Memory safe',
  },
  {
    value: 'kotlin',
    label: 'Kotlin',
    icon: <RiCodeLine />,
    description: 'Modern JVM',
  },
  {
    value: 'swift',
    label: 'Swift',
    icon: <RiCodeLine />,
    description: 'iOS development',
  },
  {
    value: 'ruby',
    label: 'Ruby',
    icon: <RiCodeLine />,
    description: 'Web frameworks',
  },
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
];

const services = [
  {
    value: 'api',
    label: 'API Service',
    icon: <RiServerLine />,
    type: 'Backend',
    status: 'Running',
    uptime: '99.9%',
  },
  {
    value: 'web',
    label: 'Web Frontend',
    icon: <RiGlobalLine />,
    type: 'Frontend',
    status: 'Running',
    uptime: '99.8%',
  },
  {
    value: 'database',
    label: 'Database',
    icon: <RiDatabase2Line />,
    type: 'Storage',
    status: 'Healthy',
    uptime: '100%',
  },
];

export const Basic = () => {
  return (
    <Autocomplete
      label="Programming Language"
      options={programmingLanguages}
      placeholder="Type to search..."
      style={{ maxWidth: '300px' }}
    />
  );
};

export const WithIcon = () => {
  return (
    <Autocomplete
      label="Country"
      icon={<RiSearchLine />}
      options={countries}
      placeholder="Type to search..."
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Sizes = () => {
  return (
    <Flex
      direction="column"
      gap="4"
      style={{ width: '100%', maxWidth: '300px' }}
    >
      <Autocomplete
        size="small"
        label="Small"
        options={programmingLanguages}
        placeholder="Type to search..."
      />
      <Autocomplete
        size="medium"
        label="Medium"
        options={programmingLanguages}
        placeholder="Type to search..."
      />
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <Autocomplete
      label="Country"
      description="Select your country of residence"
      options={countries}
      placeholder="Type to search..."
      style={{ maxWidth: '300px' }}
    />
  );
};

export const CustomValue = () => {
  return (
    <Autocomplete
      label="Custom Value"
      description="Type your own value or select from list"
      options={programmingLanguages}
      allowsCustomValue
      placeholder="Type to search or enter custom..."
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Disabled = () => {
  return (
    <Autocomplete
      label="Disabled"
      options={programmingLanguages}
      isDisabled
      style={{ maxWidth: '300px' }}
    />
  );
};

export const Required = () => {
  return (
    <Autocomplete
      label="Required Field"
      options={countries}
      isRequired
      style={{ maxWidth: '300px' }}
    />
  );
};

export const MenuDisplay = () => {
  return (
    <Autocomplete
      label="Menu Style"
      displayMode="menu"
      options={programmingLanguages}
      placeholder="Select a language..."
      style={{ maxWidth: '400px' }}
    />
  );
};

export const GridDisplay = () => {
  return (
    <Autocomplete
      label="Grid Layout"
      displayMode="grid"
      options={programmingLanguages.slice(0, 6)}
      gridConfig={{ columns: 3, gap: 'var(--bui-space-2)' }}
      placeholder="Choose..."
      style={{ maxWidth: '500px' }}
    />
  );
};

export const TagsDisplay = () => {
  return (
    <Autocomplete
      label="Tags Style"
      displayMode="tags"
      options={countries.slice(0, 8)}
      placeholder="Select country..."
      style={{ maxWidth: '400px' }}
    />
  );
};

export const TableDisplay = () => {
  return (
    <Autocomplete
      label="Service Selection"
      displayMode="table"
      options={services}
      tableColumns={[
        { key: 'label', label: 'Service', width: '2fr' },
        { key: 'type', label: 'Type', width: '1fr' },
        { key: 'status', label: 'Status', width: '1fr' },
        { key: 'uptime', label: 'Uptime', width: '1fr' },
      ]}
      placeholder="Search services..."
      style={{ maxWidth: '600px' }}
    />
  );
};
