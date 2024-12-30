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
import { Box } from '../Box/Box';
import { Container } from './Container';

const meta = {
  title: 'Container',
  component: Container,
  argTypes: {
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const FakeBox = () => (
  <Box
    borderRadius="xs"
    style={{ background: '#1f47ff', color: 'white', height: '400px' }}
  />
);

export const Default: Story = {
  args: {},
  render: args => (
    <Container {...args}>
      <FakeBox />
    </Container>
  ),
};
