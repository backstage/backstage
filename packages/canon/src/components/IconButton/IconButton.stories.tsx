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
  render: args => <IconButton {...args} icon={<Icon name="cloud" />} />,
};

export const Variants: Story = {
  render: args => (
    <Flex align="center" gap="2">
      <IconButton {...args} icon={<Icon name="cloud" />} variant="primary" />
      <IconButton {...args} icon={<Icon name="cloud" />} variant="secondary" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: args => (
    <Flex align="center" gap="2">
      <IconButton {...args} icon={<Icon name="cloud" />} size="small" />
      <IconButton {...args} icon={<Icon name="cloud" />} size="medium" />
    </Flex>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <Flex direction="row" gap="2">
      <IconButton {...args} icon={<Icon name="cloud" />} variant="primary" />
      <IconButton {...args} icon={<Icon name="cloud" />} variant="secondary" />
    </Flex>
  ),
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://canon.backstage.io',
    target: '_blank',
  },
  render: args => <IconButton {...args} icon={<Icon name="cloud" />} />,
};

export const AsComponent: Story = {
  render: () => {
    const Link = (props: { children?: React.ReactNode; to: string }) => (
      <a {...props} />
    );

    return <IconButton as={Link} to="/" icon={<Icon name="cloud" />} />;
  },
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
  render: args => <IconButton {...args} icon={<Icon name="cloud" />} />,
};

const variants: string[] = ['primary', 'secondary'];

export const Playground: Story = {
  render: args => (
    <Flex direction="column">
      {variants.map(variant => (
        <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {['small', 'medium'].map(size => (
            <Flex align="center" key={size}>
              <IconButton
                {...args}
                variant={variant as IconButtonProps<any>['variant']}
                size={size as IconButtonProps<any>['size']}
                icon={<Icon name="cloud" />}
              />
              <IconButton
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant as IconButtonProps<any>['variant']}
                size={size as IconButtonProps<any>['size']}
              />
              <IconButton
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant as IconButtonProps<any>['variant']}
                size={size as IconButtonProps<any>['size']}
              />
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
};
