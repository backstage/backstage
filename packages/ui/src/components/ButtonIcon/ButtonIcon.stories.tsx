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
import { ButtonIcon } from './ButtonIcon';
import { Flex } from '../Flex';
import { Icon } from '../Icon';

const meta = {
  title: 'Backstage UI/ButtonIcon',
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
