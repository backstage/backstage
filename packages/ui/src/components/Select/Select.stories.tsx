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
import { Flex } from '../Flex';
import { Form } from 'react-aria-components';
import { RiCloudLine } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Select',
  component: Select,
  args: {
    style: { width: 300 },
  },
});

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

export const Default = meta.story({
  args: {
    options: fontOptions,
    name: 'font',
  },
});

export const Searchable = meta.story({
  args: {
    label: 'Country',
    searchable: true,
    searchPlaceholder: 'Search countries...',
    options: countries,
  },
});

export const MultipleSelection = meta.story({
  args: {
    label: 'Select multiple options',
    selectionMode: 'multiple',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
    ],
  },
});

export const SearchableMultiple = meta.story({
  args: {
    label: 'Skills',
    searchable: true,
    selectionMode: 'multiple',
    searchPlaceholder: 'Filter skills...',
    options: skills,
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
    selectedKey: 'mono',
    defaultSelectedKey: 'serif',
  },
});

export const WithDefaultValue = meta.story({
  args: {
    ...Preview.input.args,
    defaultSelectedKey: 'serif',
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
    value: label.toLocaleLowerCase('en-US').replaceAll(' ', '-'),
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
        value: 'annual-report-2024',
        label:
          'Annual Financial Report and Strategic Planning Document for Fiscal Year 2024 with Comprehensive Analysis of Market Trends, Competitive Landscape, Financial Performance Metrics, Revenue Projections, Cost Optimization Strategies, Risk Assessment, and Long-term Growth Initiatives Across All Business Units and Geographical Regions',
      },
      {
        value: 'product-roadmap',
        label:
          'Comprehensive Product Development Roadmap and Feature Implementation Timeline Including Detailed Technical Specifications, Resource Allocation Plans, Cross-functional Team Dependencies, Milestone Tracking, Quality Assurance Procedures, User Acceptance Testing Protocols, and Post-launch Support Strategy for All Product Lines and Service Offerings',
      },
      {
        value: 'user-guide',
        label:
          'Detailed User Guide and Technical Documentation for Advanced System Features Covering Installation Procedures, Configuration Settings, Security Protocols, Troubleshooting Guidelines, Best Practices, Common Use Cases, Performance Optimization Tips, Integration Methods, API Documentation, and Frequently Asked Questions with Step-by-Step Solutions',
      },
      {
        value: 'marketing-plan',
        label:
          'Integrated Marketing Strategy and Campaign Planning Document for Q3 2024 Encompassing Target Audience Analysis, Channel Selection Criteria, Budget Allocation Framework, Creative Development Process, Content Calendar, Social Media Strategy, Email Marketing Campaigns, SEO Optimization, Paid Advertising Plans, and ROI Measurement Methodology',
      },
      {
        value: 'research-paper',
        label:
          'Scientific Research Paper on Advanced Machine Learning Techniques and Applications Including Literature Review, Methodology Description, Experimental Setup, Data Collection Procedures, Analysis Techniques, Results Interpretation, Comparative Studies, Limitations Discussion, Future Research Directions, and Practical Implementation Guidelines',
      },
    ],
    placeholder: 'Select a document template',
    name: 'template',
    style: { maxWidth: 400 },
    defaultSelectedKey: 'annual-report-2024',
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
