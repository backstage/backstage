/*
 * Copyright 2026 The Backstage Authors
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
import { Combobox } from './Combobox';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { Form } from 'react-aria-components';
import { RiCloudLine } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Combobox',
  component: Combobox,
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

const sectionedOptions = [
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

export const Default = meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Pick a font',
    name: 'font',
  },
});

export const WithIcon = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => <Combobox {...args} icon={<RiCloudLine />} />,
});

export const WithSections = meta.story({
  args: {
    label: 'Font Family',
    options: sectionedOptions,
    placeholder: 'Pick a font',
    name: 'font',
  },
});

export const AllowsCustomValue = meta.story({
  args: {
    label: 'Country',
    options: countries,
    placeholder: 'Type any country',
    allowsCustomValue: true,
    name: 'country',
  },
});

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="row" gap="2">
      <Combobox {...args} size="small" icon={<RiCloudLine />} />
      <Combobox {...args} size="medium" icon={<RiCloudLine />} />
    </Flex>
  ),
});

export const Required = meta.story({
  args: {
    ...Default.input.args,
    isRequired: true,
  },
});

export const Disabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
});

export const WithLabelAndDescription = meta.story({
  args: {
    ...Default.input.args,
    description: 'Choose a font family for your document',
  },
});

export const WithDefaultValue = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'serif',
  },
});

export const WithFullWidth = meta.story({
  args: {
    ...Default.input.args,
    style: { width: '100%' },
  },
});

export const NoOptions = meta.story({
  args: {
    ...Default.input.args,
    options: undefined,
  },
});

export const DisabledOption = meta.story({
  args: {
    ...Default.input.args,
    disabledKeys: ['cursive', 'serif'],
  },
});

export const WithValue = meta.story({
  args: {
    ...Default.input.args,
    value: 'mono',
    defaultValue: 'serif',
  },
});

export const WithError = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Form validationErrors={{ font: 'Invalid font family' }}>
      <Combobox {...args} />
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
        Combobox automatically detects its parent bg context and increments the
        neutral level by 1. No prop is needed — it's fully automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex mt="2" style={{ maxWidth: '300px' }}>
          <Combobox options={fontOptions} aria-label="Font family" />
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex mt="2" style={{ maxWidth: '300px' }}>
            <Combobox options={fontOptions} aria-label="Font family" />
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex mt="2" style={{ maxWidth: '300px' }}>
              <Combobox options={fontOptions} aria-label="Font family" />
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
        <Combobox
          {...args}
          label={undefined}
          aria-label="Choose font family"
          placeholder="Select a font family"
          name="font-aria"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: 8 }}>With aria-labelledby</h3>
        <div
          id="combobox-font-label"
          style={{ marginBottom: 8, fontWeight: 600 }}
        >
          Font Family Selection
        </div>
        <Combobox
          {...args}
          label={undefined}
          aria-labelledby="combobox-font-label"
          placeholder="Select a font family"
          name="font-labelledby"
        />
      </div>
    </Flex>
  ),
});
