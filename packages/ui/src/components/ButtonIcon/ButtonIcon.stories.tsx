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
import { ButtonIcon } from './ButtonIcon';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
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
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ButtonIcon icon={<Icon name="cloud" />} />,
};

export const Variants: Story = {
  render: () => (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<Icon name="cloud" />} variant="primary" />
      <ButtonIcon icon={<Icon name="cloud" />} variant="secondary" />
      <ButtonIcon icon={<Icon name="cloud" />} variant="tertiary" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex align="center" gap="2">
      <ButtonIcon icon={<Icon name="cloud" />} size="small" />
      <ButtonIcon icon={<Icon name="cloud" />} size="medium" />
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="primary" />
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="secondary" />
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="tertiary" />
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    variant: {
      initial: 'primary',
      sm: 'secondary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
  render: args => <ButtonIcon {...args} icon={<Icon name="cloud" />} />,
};

const variants = ['primary', 'secondary'] as const;
const sizes = ['small', 'medium'] as const;

export const Playground: Story = {
  render: args => (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => (
            <Flex align="center" key={size}>
              <ButtonIcon
                {...args}
                variant={variant}
                size={size}
                icon={<Icon name="cloud" />}
              />
              <ButtonIcon
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant}
                size={size}
              />
              <ButtonIcon
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant}
                size={size}
              />
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
};
