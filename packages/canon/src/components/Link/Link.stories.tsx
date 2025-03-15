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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { Flex } from '../Flex';
import { Text } from '../Text';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Link',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://canon.backstage.io',
    children: 'Sign up for Backstage',
  },
};

export const AllVariants: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link href="https://canon.backstage.io" variant="subtitle" {...args} />
      <Link href="https://canon.backstage.io" variant="body" {...args} />
      <Link href="https://canon.backstage.io" variant="caption" {...args} />
      <Link href="https://canon.backstage.io" variant="label" {...args} />
    </Flex>
  ),
};

export const AllWeights: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link weight="regular" style={{ maxWidth: '600px' }} {...args} />
      <Link weight="bold" style={{ maxWidth: '600px' }} {...args} />
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    variant: {
      xs: 'label',
      md: 'body',
    },
  },
};

export const Playground: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text>Subtitle</Text>
      <Link variant="subtitle" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body</Text>
      <Link variant="body" style={{ maxWidth: '600px' }} {...args} />
      <Text>Caption</Text>
      <Link variant="caption" style={{ maxWidth: '600px' }} {...args} />
      <Text>Label</Text>
      <Link variant="label" style={{ maxWidth: '600px' }} {...args} />
    </Flex>
  ),
};
