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
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { Flex } from '../Flex';
import { Form } from 'react-aria-components';
import { RiCloudLine } from '@remixicon/react';

const meta = {
  title: 'Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const fontOptions = [
  { value: 'sans', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
];

export const Default: Story = {
  args: {
    options: fontOptions,
    name: 'font',
  },
};

export const Preview: Story = {
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Select a font',
    name: 'font',
    style: { maxWidth: 260 },
  },
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Font Family',
  },
};

export const WithFullWidth: Story = {
  args: {
    ...Default.args,
    label: 'Font Family',
    style: { width: '100%' },
  },
};

export const WithLabelAndDescription: Story = {
  args: {
    ...WithLabel.args,
    description: 'Choose a font family for your document',
  },
};

export const WithIcon: Story = {
  args: {
    ...WithLabel.args,
  },
  render: args => <Select {...args} icon={<RiCloudLine />} />,
};

export const Sizes: Story = {
  args: {
    ...Preview.args,
  },
  render: args => (
    <Flex direction="row" gap="2">
      <Select {...args} size="small" icon={<RiCloudLine />} />
      <Select {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
  ),
};

export const Required: Story = {
  args: {
    ...Preview.args,
    isRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Preview.args,
    isDisabled: true,
  },
};

export const DisabledOption: Story = {
  args: {
    ...Preview.args,
    disabledKeys: ['cursive', 'serif'],
  },
};

export const NoOptions: Story = {
  args: {
    ...Preview.args,
    options: undefined,
  },
};

export const WithValue: Story = {
  args: {
    ...Preview.args,
    selectedKey: 'mono',
    defaultSelectedKey: 'serif',
  },
};

export const WithDefaultValue: Story = {
  args: {
    ...Preview.args,
    defaultSelectedKey: 'serif',
    options: fontOptions,
    name: 'font',
  },
};

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

export const WithManyOptions: Story = {
  args: {
    label: 'Font Family',
    options: generateOptions(),
    name: 'font',
  },
};

export const WithError: Story = {
  args: {
    ...WithLabel.args,
    name: 'font',
  },
  render: args => (
    <Form validationErrors={{ font: 'Invalid font family' }}>
      <Select {...args} />
    </Form>
  ),
};

export const WithLongNames: Story = {
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
};

export const WithLongNamesAndPadding: Story = {
  args: {
    ...WithLongNames.args,
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ padding: 128 }}>
        <Story {...args} />
      </div>
    ),
  ],
};
