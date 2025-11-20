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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { IAvatar } from './index';
import { Flex, Text } from '../..';

const meta = {
  title: 'Backstage UI/IAvatar',
  component: IAvatar,
} satisfies Meta<typeof IAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://Avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille',
  },
};

export const Fallback: Story = {
  args: {
    ...Default.args,
    src: 'https://Avatars.githubusercontent.com/u/15406AAAAAAAAA',
  },
};

export const Sizes: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex direction="column" gap="6">
      <Flex>
        <IAvatar {...args} size="x-small" />
        <IAvatar {...args} size="small" />
        <IAvatar {...args} size="medium" />
        <IAvatar {...args} size="large" />
        <IAvatar {...args} size="x-large" />
      </Flex>
      <Flex>
        <IAvatar {...args} size="x-small" src="" />
        <IAvatar {...args} size="small" src="" />
        <IAvatar {...args} size="medium" src="" />
        <IAvatar {...args} size="large" src="" />
        <IAvatar {...args} size="x-large" src="" />
      </Flex>
    </Flex>
  ),
};

export const Purpose: Story = {
  args: {
    ...Default.args,
  },
  render: args => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Informative (default)</Text>
        <Text variant="body-medium">
          Use when IAvatar appears alone. Announced as "{args.name}" to screen
          readers:
        </Text>
        <Flex gap="2" align="center">
          <IAvatar {...args} purpose="informative" />
        </Flex>
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Decoration</Text>
        <Text variant="body-medium">
          Use when name appears adjacent to IAvatar. Hidden from screen readers
          to avoid redundancy:
        </Text>
        <Flex gap="2" align="center">
          <IAvatar {...args} purpose="decoration" />
          <Text>{args.name}</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};
