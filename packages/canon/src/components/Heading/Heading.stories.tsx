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
import { Heading } from './Heading';
import { Flex } from '../Flex';
import { Text } from '../Text';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: {
    children: 'Heading',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Title1: Story = {
  args: {
    children: 'Look mum, no hands!',
    variant: 'title1',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Flex>
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
    </Flex>
  ),
};

export const Responsive: Story = {
  args: {
    variant: {
      xs: 'title4',
      md: 'display',
    },
  },
};

export const CustomTag: Story = {
  args: {
    variant: 'title5',
    as: 'h2',
  },
};

export const Playground: Story = {
  render: () => (
    <Flex>
      <Text>All variants</Text>
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
      <Heading variant="title5">Title 5</Heading>
    </Flex>
  ),
};
