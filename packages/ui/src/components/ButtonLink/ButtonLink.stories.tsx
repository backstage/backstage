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

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { ButtonLink } from './ButtonLink';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Backstage UI/ButtonLink',
  component: ButtonLink,
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Variants: Story = {
  render: () => (
    <Flex align="center">
      <ButtonLink
        iconStart={<Icon name="cloud" />}
        variant="primary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
      <ButtonLink
        iconStart={<Icon name="cloud" />}
        variant="secondary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
      <ButtonLink
        iconStart={<Icon name="cloud" />}
        variant="tertiary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
    </Flex>
  ),
};

export const Sizes: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <Flex align="center">
      <ButtonLink size="small" iconStart={<Icon name="cloud" />}>
        Small
      </ButtonLink>
      <ButtonLink size="medium" iconStart={<Icon name="cloud" />}>
        Medium
      </ButtonLink>
    </Flex>
  ),
};

export const WithIcons: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex align="center">
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} />
      <ButtonLink {...args} iconEnd={<Icon name="chevron-right" />} />
      <ButtonLink
        {...args}
        iconStart={<Icon name="cloud" />}
        iconEnd={<Icon name="chevron-right" />}
      />
    </Flex>
  ),
};

export const FullWidth: Story = {
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex direction="column" gap="4" style={{ width: '300px' }}>
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} />
      <ButtonLink {...args} iconEnd={<Icon name="chevron-right" />} />
      <ButtonLink
        {...args}
        iconStart={<Icon name="cloud" />}
        iconEnd={<Icon name="chevron-right" />}
      />
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex direction="row" gap="4">
      <ButtonLink variant="primary" isDisabled>
        Primary
      </ButtonLink>
      <ButtonLink variant="secondary" isDisabled>
        Secondary
      </ButtonLink>
      <ButtonLink variant="tertiary" isDisabled>
        Tertiary
      </ButtonLink>
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    children: 'Button',
    variant: {
      initial: 'primary',
      sm: 'secondary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
};

const variants = ['primary', 'secondary'] as const;
const sizes = ['small', 'medium'] as const;

export const Playground: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => (
            <Flex align="center" key={size}>
              <ButtonLink variant={variant} size={size}>
                Button
              </ButtonLink>
              <ButtonLink
                iconStart={<Icon name="cloud" />}
                variant={variant}
                size={size}
              >
                Button
              </ButtonLink>
              <ButtonLink
                iconEnd={<Icon name="chevron-right" />}
                variant={variant}
                size={size}
              >
                Button
              </ButtonLink>
              <ButtonLink
                iconStart={<Icon name="cloud" />}
                iconEnd={<Icon name="chevron-right" />}
                style={{ width: '200px' }}
                variant={variant}
                size={size}
              >
                Button
              </ButtonLink>
              <ButtonLink variant={variant} size={size} isDisabled>
                Button
              </ButtonLink>
              <ButtonLink
                iconStart={<Icon name="cloud" />}
                variant={variant}
                size={size}
                isDisabled
              >
                Button
              </ButtonLink>
              <ButtonLink
                iconEnd={<Icon name="chevron-right" />}
                variant={variant}
                size={size}
                isDisabled
              >
                Button
              </ButtonLink>
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
};
