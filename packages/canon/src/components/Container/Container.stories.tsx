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
  title: 'Layout/Container',
  component: Container,
  argTypes: {
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const DecorativeBox = () => (
  <Box
    style={{
      height: '64px',
      background: '#eaf2fd',
      borderRadius: '4px',
      border: '1px solid #2563eb',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
    }}
  />
);

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: args => (
    <Container {...args}>
      <DecorativeBox />
    </Container>
  ),
};

export const Preview: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <DecorativeBox />
    </div>
  ),
};
