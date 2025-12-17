/*
 * Copyright 2024 The Backstage Authors
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
import { useState } from 'react';
import { SearchField } from './SearchField';
import { Form } from 'react-aria-components';
import { Flex } from '../Flex';
import { FieldLabel } from '../FieldLabel';
import { ButtonIcon } from '../ButtonIcon';
import { RiCactusLine, RiEBike2Line } from '@remixicon/react';
import { Button } from '../Button';
import { Header } from '../Header';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/SearchField',
  component: SearchField,
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    icon: {
      control: 'object',
    },
    placeholder: {
      control: 'text',
    },
  },
});

export const Default = meta.story({
  args: {
    name: 'url',
    style: {
      maxWidth: '300px',
    },
    'aria-label': 'Search',
  },
});

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
  ),
});

export const DefaultValue = meta.story({
  args: {
    ...Default.input.args,
    defaultValue: 'https://example.com',
  },
});

export const WithLabel = meta.story({
  args: {
    ...Default.input.args,
    label: 'Label',
  },
});

export const WithDescription = meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Description',
  },
});

export const Required = meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true,
  },
});

export const Disabled = meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true,
  },
});

export const WithIcon = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <SearchField
      {...args}
      placeholder="Enter a URL"
      size="small"
      icon={<RiEBike2Line />}
    />
  ),
});

export const DisabledWithIcon = meta.story({
  args: {
    ...WithIcon.input.args,
    isDisabled: true,
  },
});

export const ShowError = meta.story({
  args: {
    ...WithLabel.input.args,
  },
  render: args => (
    <Form validationErrors={{ url: 'Invalid URL' }}>
      <SearchField {...args} />
    </Form>
  ),
});

export const Validation = meta.story({
  args: {
    ...WithLabel.input.args,
    validate: value => (value === 'admin' ? 'Nice try!' : null),
  },
});

export const CustomField = meta.story({
  render: () => (
    <>
      <FieldLabel
        htmlFor="custom-field"
        id="custom-field-label"
        label="Custom Field"
      />
      <SearchField
        id="custom-field"
        aria-labelledby="custom-field-label"
        name="custom-field"
        defaultValue="Custom Field"
      />
    </>
  ),
});

export const StartCollapsed = meta.story({
  args: {
    ...Default.input.args,
    startCollapsed: true,
  },

  render: args => (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <SearchField {...args} size="small" />
        <SearchField {...args} size="medium" />
      </Flex>
      <SearchField {...args} size="small" />
    </Flex>
  ),
});

export const StartCollapsedWithValue = meta.story({
  args: {
    ...StartCollapsed.input.args,
    defaultValue: 'https://example.com',
  },

  render: args => <SearchField {...args} size="small" />,
});

export const InHeader = meta.story({
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: args => (
    <>
      <Header
        title="Title"
        customActions={
          <>
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
            <SearchField aria-label="Search" {...args} size="small" />
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
          </>
        }
      />
    </>
  ),
});

export const StartCollapsedInHeader = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: args => (
    <>
      <Header
        title="Title"
        customActions={
          <>
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
            <SearchField {...args} size="small" />
            <ButtonIcon
              aria-label="Cactus icon button"
              icon={<RiCactusLine />}
              size="small"
              variant="secondary"
            />
          </>
        }
      />
    </>
  ),
});

export const StartCollapsedWithButtons = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  render: args => (
    <Flex direction="row" gap="2" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField {...args} size="small" />
      <ButtonIcon
        aria-label="Cactus icon button"
        icon={<RiCactusLine />}
        size="small"
        variant="secondary"
      />
      <Button size="small" variant="secondary">
        Hello world
      </Button>
      <SearchField {...args} size="medium" />
      <ButtonIcon
        aria-label="Cactus icon button"
        icon={<RiCactusLine />}
        size="medium"
        variant="secondary"
      />
      <Button size="medium" variant="secondary">
        Hello world
      </Button>
    </Flex>
  ),
});

export const StartCollapsedWithOnChange = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  render: args => {
    const handleChange = (value: string) => {
      console.log('Search value:', value);
    };

    return (
      <Flex
        direction="row"
        gap="2"
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <SearchField {...args} onChange={handleChange} size="small" />
      </Flex>
    );
  },
});

export const StartCollapsedControlledEmpty = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  render: function Render(args) {
    const [value, setValue] = useState('');

    return (
      <Flex
        direction="row"
        gap="2"
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>
    );
  },
});

export const StartCollapsedControlledWithValue = meta.story({
  args: {
    ...StartCollapsed.input.args,
  },
  render: function Render(args) {
    const [value, setValue] = useState('Component');

    return (
      <Flex
        direction="row"
        gap="2"
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <SearchField {...args} size="small" value={value} onChange={setValue} />
      </Flex>
    );
  },
});
