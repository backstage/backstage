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
import {
  ComboboxItem,
  ComboboxItemProfile,
  ComboboxItemText,
} from './ComboboxItem';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { Form } from 'react-aria-components';
import { RiCheckLine, RiCloudLine } from '@remixicon/react';
import { useAsyncList } from '@backstage/ui';
import { useState } from 'react';
import { expect, screen, waitFor } from 'storybook/test';

const meta = preview.meta({
  title: 'Backstage UI/Combobox',
  component: Combobox,
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

export const Default = meta.story({
  args: {
    label: 'Font Family',
    options: fontOptions,
    placeholder: 'Pick a font',
    name: 'font',
  },
});

export const WithClientSearch = meta.story({
  args: {
    label: 'Country',
    options: countries,
    placeholder: 'Search countries',
    search: true,
    name: 'country',
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

function ComboboxItemTypesColumn({ size }: { size: 'small' | 'medium' }) {
  return (
    <Flex direction="column" gap="4" style={{ width: 280 }}>
      <Text as="div" weight="bold">
        {size === 'small' ? 'Small' : 'Medium'}
      </Text>
      <Combobox
        size={size}
        label="Title items"
        placeholder="Select a status"
        style={{ width: '100%' }}
      >
        <ComboboxItemText id="active" title="Active" />
        <ComboboxItemText id="inactive" title="Inactive" />
      </Combobox>
      <Combobox
        size={size}
        label="Icon and title items"
        placeholder="Select a deployment target"
        style={{ width: '100%' }}
      >
        <ComboboxItemText
          id="cloud"
          title="Cloud"
          leadingIcon={<RiCloudLine />}
        />
        <ComboboxItemText
          id="private-cloud"
          title="Private cloud"
          leadingIcon={<RiCloudLine />}
        />
      </Combobox>
      <Combobox
        size={size}
        label="Title and description items"
        placeholder="Select a release channel"
        style={{ width: '100%' }}
      >
        <ComboboxItemText
          id="stable"
          title="Stable"
          description="Recommended for production workloads"
        />
        <ComboboxItemText
          id="beta"
          title="Beta"
          description="Preview upcoming features"
        />
      </Combobox>
      <Combobox
        size={size}
        label="Icon, title, and description items"
        placeholder="Select a deployment target"
        style={{ width: '100%' }}
      >
        <ComboboxItemText
          id="production-cloud"
          title="Production cloud"
          description="Runs production workloads"
          leadingIcon={<RiCloudLine />}
        />
        <ComboboxItemText
          id="staging-cloud"
          title="Staging cloud"
          description="Runs pre-production workloads"
          leadingIcon={<RiCloudLine />}
        />
      </Combobox>
      <Combobox
        size={size}
        label="Profile items"
        placeholder="Select an owner"
        style={{ width: '100%' }}
      >
        <ComboboxItemProfile
          id="ada"
          name="Ada Lovelace"
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
        />
        <ComboboxItemProfile id="grace" name="Grace Hopper" />
      </Combobox>
      <Combobox
        size={size}
        label="Custom items"
        placeholder="Select a custom item"
        style={{ width: '100%' }}
      >
        <ComboboxItem id="nightly" textValue="Nightly builds">
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
        </ComboboxItem>
        <ComboboxItem id="canary" textValue="Canary builds">
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
        </ComboboxItem>
      </Combobox>
    </Flex>
  );
}

export const ItemTypes = meta.story({
  render: () => (
    <Flex align="start" gap="6">
      <ComboboxItemTypesColumn size="small" />
      <ComboboxItemTypesColumn size="medium" />
    </Flex>
  ),
});

const owners = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
  },
  { id: 'grace', name: 'Grace Hopper' },
  { id: 'margaret', name: 'Margaret Hamilton' },
];

export const WithProfiles = meta.story({
  render: () => (
    <Combobox label="Owner" placeholder="Select an owner" items={owners}>
      {owner => <ComboboxItemProfile name={owner.name} src={owner.src} />}
    </Combobox>
  ),
});

type ServerOwner = {
  id: string;
  textValue: string;
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
].map(owner => ({ ...owner, textValue: owner.name }));

const serverOptions = serverOwners.map(owner => ({
  id: owner.id,
  label: owner.name,
}));

const paginatedServerOptions = Array.from({ length: 200 }, (_, index) => ({
  id: `owner-${index + 1}`,
  label: `Owner ${String(index + 1).padStart(3, '0')}`,
}));

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const serverDelay = 1_500;
const serverPageSize = 5;
const paginationServerDelay = 100;
const paginationServerPageSize = 10;

function readCount(element: HTMLElement) {
  return Number(element.textContent);
}

async function waitForRequestCountToStabilize(element: HTMLElement) {
  let previousCount = readCount(element);
  let stableChecks = 0;

  for (let index = 0; index < 20; index++) {
    await wait(250);
    const currentCount = readCount(element);

    if (currentCount === previousCount) {
      stableChecks += 1;
      if (stableChecks === 3) {
        return currentCount;
      }
    } else {
      previousCount = currentCount;
      stableChecks = 0;
    }
  }

  throw new Error('Request count did not stabilize');
}

function ServerBackedCombobox() {
  const [requestCount, setRequestCount] = useState(0);
  const list = useAsyncList({
    async load({ cursor, filterText }) {
      setRequestCount(count => count + 1);
      await wait(paginationServerDelay);

      const query = filterText.toLocaleLowerCase();
      const filteredOptions = paginatedServerOptions.filter(option =>
        option.label.toLocaleLowerCase().includes(query),
      );
      const startIndex = cursor ? Number(cursor) : 0;
      const endIndex = startIndex + paginationServerPageSize;

      return {
        items: filteredOptions.slice(startIndex, endIndex),
        cursor:
          endIndex < filteredOptions.length ? String(endIndex) : undefined,
      };
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div>
        <div>
          Requests:{' '}
          <output aria-label="Combobox request count">{requestCount}</output>
        </div>
        <div>
          Results:{' '}
          <output aria-label="Combobox result count">
            {list.items.length}
          </output>
        </div>
        <Combobox
          label="Owner"
          placeholder="Search owners"
          options={list}
          search={{ mode: 'server' }}
          style={{ width: 300 }}
        />
      </div>
    </div>
  );
}

export const ServerBackedOptions = meta.story({
  render: () => <ServerBackedCombobox />,
  parameters: {
    layout: 'fullscreen',
  },
  play: async ({ canvas, userEvent }) => {
    const requestCount = canvas.getByLabelText('Combobox request count');
    const resultCount = canvas.getByLabelText('Combobox result count');

    await waitFor(() =>
      expect(readCount(resultCount)).toBe(paginationServerPageSize),
    );
    await userEvent.click(canvas.getByRole('button'));

    const listbox = await screen.findByRole('listbox');
    const scrollElement = listbox.closest('.bui-PopoverContent');

    expect(scrollElement).toBeTruthy();
    expect(window.getComputedStyle(listbox).maxHeight).toBe('none');

    await waitFor(
      () =>
        expect(scrollElement!.scrollHeight).toBeGreaterThan(
          scrollElement!.clientHeight,
        ),
      { timeout: 5_000 },
    );

    const stabilizedRequestCount = await waitForRequestCountToStabilize(
      requestCount,
    );

    expect(stabilizedRequestCount).toBeLessThan(
      paginatedServerOptions.length / paginationServerPageSize,
    );
    expect(readCount(resultCount)).toBeLessThan(paginatedServerOptions.length);

    listbox.focus();
    await userEvent.keyboard('{End}');
    const bottomScrollTop =
      scrollElement!.scrollHeight - scrollElement!.clientHeight;
    scrollElement!.scrollTop = bottomScrollTop;
    await waitFor(() =>
      expect(scrollElement!.scrollTop).toBeGreaterThanOrEqual(
        bottomScrollTop - 1,
      ),
    );

    await waitFor(
      () =>
        expect(readCount(requestCount)).toBeGreaterThan(stabilizedRequestCount),
      { timeout: 5_000 },
    );
  },
});

function ServerBackedCustomCombobox() {
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
    <Combobox
      label="Owner"
      placeholder="Search names and roles"
      items={list}
      search={{ mode: 'server' }}
      style={{ width: 300 }}
    >
      {owner => (
        <ComboboxItem textValue={owner.textValue}>
          <Text as="div" weight="bold">
            {owner.name}
          </Text>
          <Text as="div" variant="body-small" color="secondary">
            {owner.role}
          </Text>
        </ComboboxItem>
      )}
    </Combobox>
  );
}

export const ServerBackedCustomItems = meta.story({
  render: () => <ServerBackedCustomCombobox />,
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
