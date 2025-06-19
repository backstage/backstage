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
  render: () => <IconButton icon={<Icon name="cloud" />} />,
};

export const Variants: Story = {
  render: () => (
    <Flex align="center" gap="2">
      <IconButton icon={<Icon name="cloud" />} variant="primary" />
      <IconButton icon={<Icon name="cloud" />} variant="secondary" />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex align="center" gap="2">
      <IconButton icon={<Icon name="cloud" />} size="small" />
      <IconButton icon={<Icon name="cloud" />} size="medium" />
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex direction="row" gap="2">
      <IconButton isDisabled icon={<Icon name="cloud" />} variant="primary" />
      <IconButton isDisabled icon={<Icon name="cloud" />} variant="secondary" />
    </Flex>
  ),
};

export const AsLink: Story = {
  render: () => (
    <IconButton
      as="a"
      href="https://canon.backstage.io"
      target="_blank"
      icon={<Icon name="cloud" />}
    />
  ),
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
              <IconButton
                {...args}
                variant={variant}
                size={size}
                icon={<Icon name="cloud" />}
              />
              <IconButton
                {...args}
                icon={<Icon name="chevron-right" />}
                aria-label="Chevron right icon button"
                variant={variant}
                size={size}
              />
              <IconButton
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
