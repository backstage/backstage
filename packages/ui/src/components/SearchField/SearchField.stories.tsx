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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField } from './SearchField';
import { Form } from 'react-aria-components';
import { Flex } from '../Flex';
import { FieldLabel } from '../FieldLabel';
import { ButtonIcon } from '../ButtonIcon';
import { RiCactusLine, RiEBike2Line } from '@remixicon/react';
import { Button } from '../Button';
import { Header } from '../Header';
import { MemoryRouter } from 'react-router-dom';

const meta = {
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
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'url',
    style: {
      maxWidth: '300px',
    },
    'aria-label': 'Search',
  },
};

export const Sizes: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex direction="row" gap="4" style={{ width: '100%', maxWidth: '600px' }}>
      <SearchField {...args} size="small" />
      <SearchField {...args} size="medium" />
    </Flex>
  ),
};

export const DefaultValue: Story = {
  args: {
    ...Default.args,
    defaultValue: 'https://example.com',
  },
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Label',
  },
};

export const WithDescription: Story = {
  args: {
    ...WithLabel.args,
    description: 'Description',
  },
};

export const Required: Story = {
  args: {
    ...WithLabel.args,
    isRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <SearchField
      {...args}
      placeholder="Enter a URL"
      size="small"
      icon={<RiEBike2Line />}
    />
  ),
};

export const DisabledWithIcon: Story = {
  args: {
    ...WithIcon.args,
    isDisabled: true,
  },
};

export const ShowError: Story = {
  args: {
    ...WithLabel.args,
  },
  render: args => (
    <Form validationErrors={{ url: 'Invalid URL' }}>
      <SearchField {...args} />
    </Form>
  ),
};

export const Validation: Story = {
  args: {
    ...WithLabel.args,
    validate: value => (value === 'admin' ? 'Nice try!' : null),
  },
};

export const CustomField: Story = {
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
};

export const StartCollapsed: Story = {
  args: {
    ...Default.args,
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
};

export const InHeader: Story = {
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
};

export const StartCollapsedInHeader: Story = {
  args: {
    ...StartCollapsed.args,
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
};

export const StartCollapsedWithButtons: Story = {
  args: {
    ...StartCollapsed.args,
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
};

export const StartCollapsedWithOnChange: Story = {
  args: {
    ...StartCollapsed.args,
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
};
