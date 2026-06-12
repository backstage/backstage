/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import preview from '../../../../../.storybook/preview';
import { Select } from './Select';
import { SelectItem, SelectItemProfile, SelectItemText } from './SelectItem';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { Form } from 'react-aria-components';
import { RiCheckLine, RiCloudLine } from '@remixicon/react';
import { useAsyncList } from '@backstage/ui';
import type { ReactNode } from 'react';

const meta = preview.meta({
  title: 'Backstage UI/Select',
  component: Select,
  args: {
    style: { width: 300 },
  },
});

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

export const Default = meta.story({
  args: {
    options: fontOptions,
    name: 'font',
  },
});

export const Searchable = meta.story({
  args: {
    label: 'Country',
    search: { placeholder: 'Search countries...' },
    options: countries,
  },
});

function SelectItemTypesColumn({ size }: { size: 'small' | 'medium' }) {
  return (
    <Flex direction="column" gap="4" style={{ width: 280 }}>
      <Text as="div" weight="bold">
        {size === 'small' ? 'Small' : 'Medium'}
      </Text>
      <Select
        size={size}
        label="Title items"
        placeholder="Select a status"
        style={{ width: '100%' }}
      >
        <SelectItemText id="active" title="Active" />
        <SelectItemText id="inactive" title="Inactive" />
      </Select>
      <Select
        size={size}
        label="Icon and title items"
        placeholder="Select a deployment target"
        style={{ width: '100%' }}
      >
        <SelectItemText
          id="cloud"
          title="Cloud"
          leadingIcon={<RiCloudLine />}
        />
        <SelectItemText
          id="private-cloud"
          title="Private cloud"
          leadingIcon={<RiCloudLine />}
        />
      </Select>
      <Select
        size={size}
        label="Title and description items"
        placeholder="Select a release channel"
        style={{ width: '100%' }}
      >
        <SelectItemText
          id="stable"
          title="Stable"
          description="Recommended for production workloads"
        />
        <SelectItemText
          id="beta"
          title="Beta"
          description="Preview upcoming features"
        />
      </Select>
      <Select
        size={size}
        label="Icon, title, and description items"
        placeholder="Select a deployment target"
        style={{ width: '100%' }}
      >
        <SelectItemText
          id="production-cloud"
          title="Production cloud"
          description="Runs production workloads"
          leadingIcon={<RiCloudLine />}
        />
        <SelectItemText
          id="staging-cloud"
          title="Staging cloud"
          description="Runs pre-production workloads"
          leadingIcon={<RiCloudLine />}
        />
      </Select>
      <Select
        size={size}
        label="Profile items"
        placeholder="Select an owner"
        style={{ width: '100%' }}
      >
        <SelectItemProfile
          id="ada"
          name="Ada Lovelace"
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
        />
        <SelectItemProfile id="grace" name="Grace Hopper" />
      </Select>
      <Select
        size={size}
        label="Custom items"
        placeholder="Select a custom item"
        style={{ width: '100%' }}
      >
        <SelectItem id="nightly" textValue="Nightly builds">
          {({ isSelected }) => (
            <Flex align="center" justify="between" gap="2">
              <Box style={{ flex: 1 }}>
                <Text as="div" weight="bold">
                  Nightly builds
                </Text>
                <Text as="div" variant="body-small" color="secondary">
                  Updated every night
                </Text>
              </Box>
              {isSelected && <RiCheckLine aria-label="Selected" />}
            </Flex>
          )}
        </SelectItem>
        <SelectItem id="canary" textValue="Canary builds">
          {({ isSelected }) => (
            <Flex align="center" justify="between" gap="2">
              <Box style={{ flex: 1 }}>
                <Text as="div" weight="bold">
                  Canary builds
                </Text>
                <Text as="div" variant="body-small" color="secondary">
                  Updated after every merge
                </Text>
              </Box>
              {isSelected && <RiCheckLine aria-label="Selected" />}
            </Flex>
          )}
        </SelectItem>
      </Select>
    </Flex>
  );
}

export const ItemTypes = meta.story({
  render: () => (
    <Flex align="start" gap="6">
      <SelectItemTypesColumn size="small" />
      <SelectItemTypesColumn size="medium" />
    </Flex>
  ),
});

export const ClientSearchShorthand = meta.story({
  args: {
    label: 'Country',
    search: true,
    options: countries,
  },
});

type ServerOwner = {
  id: string;
  name: string;
  role: string;
};

const serverOwners: ServerOwner[] = [
  { id: 'ada', name: 'Ada Lovelace', role: 'Software Engineer' },
  { id: 'grace', name: 'Grace Hopper', role: 'Computer Scientist' },
  { id: 'margaret', name: 'Margaret Hamilton', role: 'Software Engineer' },
  { id: 'katherine', name: 'Katherine Johnson', role: 'Mathematician' },
  { id: 'annie', name: 'Annie Easley', role: 'Computer Scientist' },
  { id: 'mary', name: 'Mary Jackson', role: 'Aerospace Engineer' },
  { id: 'dorothy', name: 'Dorothy Vaughan', role: 'Mathematician' },
  { id: 'radia', name: 'Radia Perlman', role: 'Network Engineer' },
  { id: 'barbara', name: 'Barbara Liskov', role: 'Computer Scientist' },
  { id: 'frances', name: 'Frances Allen', role: 'Computer Scientist' },
  { id: 'evelyn', name: 'Evelyn Boyd Granville', role: 'Mathematician' },
  {
    id: 'mary-keller',
    name: 'Mary Kenneth Keller',
    role: 'Computer Scientist',
  },
  { id: 'hedy', name: 'Hedy Lamarr', role: 'Inventor' },
  { id: 'joan', name: 'Joan Clarke', role: 'Cryptanalyst' },
  { id: 'mary-ross', name: 'Mary Golda Ross', role: 'Aerospace Engineer' },
  { id: 'ellen', name: 'Ellen Ochoa', role: 'Aerospace Engineer' },
  { id: 'rebecca', name: 'Rebecca Lee Crumpler', role: 'Physician' },
  { id: 'chiyome', name: 'Chiyome Fukino', role: 'Physician' },
  { id: 'susan', name: 'Susan Kare', role: 'Designer' },
  { id: 'mary-coombs', name: 'Mary Coombs', role: 'Programmer' },
];

const serverOptions = serverOwners.map(owner => ({
  id: owner.id,
  label: owner.name,
}));

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const serverDelay = 1_500;
const serverPageSize = 5;

function ConstrainedSelectList({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`.bui-SelectList { max-height: 9rem; }`}</style>
      {children}
    </>
  );
}

function ServerBackedSelect() {
  const list = useAsyncList({
    async load({ cursor, filterText }) {
      await wait(serverDelay);

      const query = filterText.toLocaleLowerCase();
      const filteredOptions = serverOptions.filter(option =>
        option.label.toLocaleLowerCase().includes(query),
      );
      const startIndex = cursor ? Number(cursor) : 0;
      const endIndex = startIndex + serverPageSize;

      return {
        items: filteredOptions.slice(startIndex, endIndex),
        cursor:
          endIndex < filteredOptions.length ? String(endIndex) : undefined,
      };
    },
  });

  return (
    <ConstrainedSelectList>
      <Select
        label="Owner"
        placeholder="Select an owner"
        options={list}
        search={{ mode: 'server', placeholder: 'Search owners...' }}
        style={{ width: 300 }}
      />
    </ConstrainedSelectList>
  );
}

export const ServerBackedOptions = meta.story({
  render: () => <ServerBackedSelect />,
});

function ServerBackedCustomSelect() {
  const list = useAsyncList<ServerOwner>({
    async load({ cursor, filterText }) {
      await wait(serverDelay);

      const query = filterText.toLocaleLowerCase();
      const filteredOwners = serverOwners.filter(owner =>
        `${owner.name} ${owner.role}`.toLocaleLowerCase().includes(query),
      );
      const startIndex = cursor ? Number(cursor) : 0;
      const endIndex = startIndex + serverPageSize;

      return {
        items: filteredOwners.slice(startIndex, endIndex),
        cursor: endIndex < filteredOwners.length ? String(endIndex) : undefined,
      };
    },
  });

  return (
    <ConstrainedSelectList>
      <Select
        label="Owner"
        placeholder="Select an owner"
        items={list}
        search={{ mode: 'server', placeholder: 'Search names and roles...' }}
        style={{ width: 300 }}
      >
        {owner => (
          <SelectItem textValue={owner.name}>
            <Text as="div" weight="bold">
              {owner.name}
            </Text>
            <Text as="div" variant="body-small" color="secondary">
              {owner.role}
            </Text>
          </SelectItem>
        )}
      </Select>
    </ConstrainedSelectList>
  );
}

export const ServerBackedCustomItems = meta.story({
  render: () => <ServerBackedCustomSelect />,
});

export const MultipleSelection = meta.story({
  args: {
    label: 'Select multiple options',
    selectionMode: 'multiple',
    options: [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
      { id: 'option3', label: 'Option 3' },
      { id: 'option4', label: 'Option 4' },
    ],
  },
});

export const SearchableMultiple = meta.story({
  args: {
    label: 'Skills',
    search: { placeholder: 'Filter skills...' },
    selectionMode: 'multiple',
    options: skills,
  },
});

const sectionedOptions = [
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

export const WithSections = meta.story({
  args: {
    label: 'Font Family',
    options: sectionedOptions,
    name: 'font',
  },
});

export const SearchableWithSections = meta.story({
  args: {
    label: 'Font Family',
    search: { placeholder: 'Search fonts...' },
    options: sectionedOptions,
    name: 'font',
  },
});

export const Preview = meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: { maxWidth: 260 },
  },
});

export const WithLabel = meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
  },
});

export const WithFullWidth = meta.story({
  args: {
    ...Default.input.args,
    label: 'Font Family',
    style: { width: '100%' },
  },
});

export const WithLabelAndDescription = meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Choose a font family for your document',
  },
});

export const WithIcon = meta.story({
  args: {
    ...WithLabel.input.args,
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />,
});

export const Sizes = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: args => (
    <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
  ),
});

export const Required = meta.story({
  args: {
    ...Preview.input.args,
    isRequired: true,
  },
});

export const Disabled = meta.story({
  args: {
    ...Preview.input.args,
    isDisabled: true,
  },
});

export const DisabledOption = meta.story({
  args: {
    ...Preview.input.args,
    disabledKeys: ['cursive', 'serif'],
  },
});

export const NoOptions = meta.story({
  args: {
    ...Preview.input.args,
    options: undefined,
  },
});

export const WithValue = meta.story({
  args: {
    ...Preview.input.args,
    value: 'mono',
  },
});

export const WithDefaultValue = meta.story({
  args: {
    ...Preview.input.args,
    defaultValue: 'serif',
    options: fontOptions,
    name: 'font',
  },
});

const generateOptions = (count = 100) => {
  const firstWords = [
    'Moon',
    'Sun',
    'Star',
    'Cosmic',
    'Globe',
    'Flux',
    'Nova',
    'Echo',
    'Pulse',
    'Vertex',
    'Nexus',
    'Orbit',
    'Prism',
    'Quantum',
    'Zenith',
    'Aura',
    'Crystal',
    'Shadow',
    'Phantom',
    'Azure',
    'Ember',
    'Frost',
    'Horizon',
    'Mystic',
    'Raven',
    'Solstice',
    'Tempest',
    'Vortex',
    'Whisper',
    'Zephyr',
  ];

  const secondWords = [
    'green',
    'blue',
    'red',
    'black',
    'white',
    'silver',
    'gold',
    'copper',
    'bronze',
    'steel',
    'flow',
    'light',
    'dark',
    'dream',
    'stream',
    'life',
    'sight',
    'mind',
    'craft',
    'blend',
    'wave',
    'swift',
    'sharp',
    'soft',
    'bold',
    'clear',
    'deep',
    'lift',
    'shift',
    'grace',
  ];

  const thirdWords = [
    'Sans',
    'Serif',
    'Mono',
    'Script',
    'Display',
    'Slab',
    'Round',
    'Thin',
    'Bold',
    'Italic',
    'Pro',
    'Neo',
    'Prime',
    'Plus',
    'One',
    'Two',
    'Nova',
    'Ultra',
    'Elite',
    'Max',
    'Type',
    'Text',
    'View',
    'Graph',
    'Print',
    'Read',
    'Write',
    'Book',
    'Note',
    'Letter',
  ];

  const randomElement = <T extends any>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  const uniqueRandomNames = Array.from({ length: count })
    .map(() => {
      const firstName = randomElement(firstWords);
      const secondName = randomElement(secondWords);
      const thirdName = randomElement(thirdWords);
      return `${firstName}${secondName} ${thirdName}`;
    })
    .reduce((accSet, label) => {
      accSet.add(label);
      return accSet;
    }, new Set<string>())
    .values();

  return Array.from(uniqueRandomNames).map(label => ({
    id: label.toLocaleLowerCase('en-US').replaceAll(' ', '-'),
    label,
  }));
};

export const WithManyOptions = meta.story({
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font',
  },
});

export const WithError = meta.story({
  args: {
    ...WithLabel.input.args,
    name: 'font',
  },
  render: args => (
    <Form validationErrors={{ font: 'Invalid font family' }}>
      <Select {...args} />
    </Form>
  ),
});

export const WithLongNames = meta.story({
  args: {
    label: 'Document Template',
    options: [
      {
        id: 'annual-report-2024',
        label:
          'Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions',
      },
      {
        id: 'product-roadmap',
        label:
          'Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings',
      },
      {
        id: 'user-guide',
        label:
          'Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions',
      },
      {
        id: 'marketing-plan',
        label:
          'Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology',
      },
      {
        id: 'research-paper',
        label:
          'Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines',
      },
    ],
    placeholder: 'Select a document template',
    name: 'template',
    style: { maxWidth: 400 },
    defaultValue: 'annual-report-2024',
  },
});

export const WithLongNamesAndPadding = meta.story({
  args: {
    ...WithLongNames.input.args,
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ padding: 128 }}>
        <Story {...args} />
      </div>
    ),
  ],
});

export const AutoBg = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <div style={{ maxWidth: '600px' }}>
        Select automatically detects its parent bg context and increments the
        neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{ maxWidth: '300px' }}>
          <Select options={fontOptions} aria-label="Font family" />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{ maxWidth: '300px' }}>
            <Select options={fontOptions} aria-label="Font family" />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{ maxWidth: '300px' }}>
              <Select options={fontOptions} aria-label="Font family" />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  ),
});

export const WithAccessibilityProps = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="column" gap="4">
      <div>
        <h3 style={{ marginBottom: 8 }}>With aria-label</h3>
        <Select
          {...args}
          aria-label="Choose font family"
          placeholder="Select a font family"
          name="font-aria"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 8 }}>With aria-labelledby</h3>
        <div id="font-label" style={{ marginBottom: 8, fontWeight: 600 }}>
          Font Family Selection
        </div>
        <Select
          {...args}
          aria-labelledby="font-label"
          placeholder="Select a font family"
          name="font-labelledby"
        />
      </div>
    </Flex>
  ),
});
