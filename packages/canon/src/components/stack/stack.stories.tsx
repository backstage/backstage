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
import { Stack } from './stack';
import { Box } from '../box/box';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

const FakeBox = () => (
  <Box
    background="background"
    paddingX="large"
    paddingY="medium"
    borderRadius="small"
  >
    Fake Box
  </Box>
);

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {
  render: () => (
    <Stack gap="medium" direction="column">
      <FakeBox />
      <FakeBox />
      <FakeBox />
    </Stack>
  ),
};

export const Row: Story = {
  render: () => (
    <Stack gap="medium" direction="row">
      <FakeBox />
      <FakeBox />
      <FakeBox />
    </Stack>
  ),
};
