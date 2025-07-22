/*
 * Copyright 2025 The Backstage Authors
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
import { Avatar } from './index';
import { Flex } from '../..';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille',
  },
};

export const Fallback: Story = {
  args: {
    ...Default.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA',
  },
};

export const Sizes: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex>
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
    </Flex>
  ),
};
