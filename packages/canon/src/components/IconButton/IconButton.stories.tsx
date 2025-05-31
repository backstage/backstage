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

import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { IconButtonProps } from './types';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
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
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Icon name="cloud" />,
  },
};

export const Variants: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex align="center" gap="2">
      <IconButton {...args} variant="primary" />
      <IconButton {...args} variant="secondary" />
    </Flex>
  ),
};

export const Sizes: Story = {
  args: {
    icon: <Icon name="cloud" />,
  },
  render: args => (
    <Flex align="center" gap="2">
      <IconButton {...args} size="small" />
      <IconButton {...args} size="medium" />
    </Flex>
  ),
};

export const Disabled: Story = {
  args: {
    icon: <Icon name="cloud" />,
    disabled: true,
    'aria-label': 'Cloud icon button',
  },
  render: args => (
    <Flex direction="row" gap="2">
      <IconButton {...args} variant="primary" />
      <IconButton {...args} variant="secondary" />
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    icon: <Icon name="cloud" />,
    'aria-label': 'Cloud icon button',
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

const variants: string[] = ['primary', 'secondary'];

export const Playground: Story = {
  args: {
    icon: <Icon name="cloud" />,
    'aria-label': 'Cloud icon button',
  },
  render: args => (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {['small', 'medium'].map(size => (
            <Flex align="center" key={size}>
              <IconButton
                {...args}
                variant={variant as IconButtonProps['variant']}
                size={size as IconButtonProps['size']}
              />
              <IconButton
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant as IconButtonProps['variant']}
                size={size as IconButtonProps['size']}
              />
              <IconButton
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant as IconButtonProps['variant']}
                size={size as IconButtonProps['size']}
              />
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
};
