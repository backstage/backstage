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
import { Stack } from './Stack';
import { Box } from '../Box/Box';

const meta = {
  title: 'Components/Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const FakeBox = () => (
  <Box
    paddingX="xl"
    paddingY="md"
    borderRadius="small"
    style={{ background: '#1f47ff', color: 'white' }}
  >
    Fake Box
  </Box>
);

export const Default: Story = {
  args: {
    children: (
      <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
    ),
  },
};

export const LargeGap: Story = {
  args: {
    ...Default.args,
    gap: 'xl',
  },
};
