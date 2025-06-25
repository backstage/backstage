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
import preview from '../../../.storybook/preview';
import { Select } from './Select';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Components/Select',
  component: Select,
});

const fontOptions = [
  { value: 'sans', label: 'Sans-serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
];

export const Default = meta.story({
  args: {
    options: fontOptions,
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

export const WithDescription = meta.story({
  args: {
    ...Preview.input.args,
    description: 'Choose a font family for your document',
  },
});

export const Sizes = meta.story({
  args: {
    ...Preview.input.args,
  },
  render: args => (
    <Flex direction="row" gap="2" style={{ width: '100%', maxWidth: 540 }}>
      <Select {...args} size="small" />
      <Select {...args} size="medium" />
    </Flex>
  ),
});

export const Required = meta.story({
  args: {
    ...Preview.input.args,
    required: true,
  },
});

export const Disabled = meta.story({
  args: {
    ...Preview.input.args,
    disabled: true,
  },
});

export const DisabledOption = meta.story({
  args: {
    ...Preview.input.args,
    options: [
      ...fontOptions,
      { value: 'comic-sans', label: 'Comic sans', disabled: true },
    ],
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
    defaultValue: 'serif',
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

export const WithErrorAndDescription = meta.story({
  args: {
    ...Preview.input.args,
    error: 'Invalid font family',
  },
});

export const WithLongOptionNames = meta.story({
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
    value: 'annual-report-2024',
  },
});
