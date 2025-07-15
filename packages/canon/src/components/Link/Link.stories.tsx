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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Link',
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/home',
    children: 'Sign up for Backstage',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://backstage.io',
    children: 'Sign up for Backstage',
    target: '_blank',
  },
};

export const AllVariants: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link href="https://ui.backstage.io" variant="title-large" {...args} />
      <Link href="https://ui.backstage.io" variant="title-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="title-small" {...args} />
      <Link href="https://ui.backstage.io" variant="title-x-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-large" {...args} />
      <Link href="https://ui.backstage.io" variant="body-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="body-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-x-small" {...args} />
    </Flex>
  ),
};

export const AllColors: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="primary"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="secondary"
        {...args}
      />
    </Flex>
  ),
};

export const AllWeights: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link
        href="https://ui.backstage.io"
        variant="title-large"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-large"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-medium"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-medium"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-x-small"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-x-small"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-large"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-large"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-medium"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-medium"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-small"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-small"
        weight="bold"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-x-small"
        weight="regular"
        {...args}
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-x-small"
        weight="bold"
        {...args}
      />
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    ...Default.args,
    variant: {
      xs: 'title-x-small',
      md: 'body-x-small',
    },
  },
};

export const Playground: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text>Title X Small</Text>
      <Link variant="title-x-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body X Small</Text>
      <Link variant="body-x-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Small</Text>
      <Link variant="body-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Medium</Text>
      <Link variant="body-medium" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Large</Text>
      <Link variant="body-large" style={{ maxWidth: '600px' }} {...args} />
      <Text>Title Small</Text>
      <Link variant="title-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Title Medium</Text>
      <Link variant="title-medium" style={{ maxWidth: '600px' }} {...args} />
    </Flex>
  ),
};
