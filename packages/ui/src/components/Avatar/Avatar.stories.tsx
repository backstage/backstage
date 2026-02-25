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
import preview from '../../../../../.storybook/preview';
import { Avatar } from './index';
import { Flex, Text } from '../..';

const meta = preview.meta({
  title: 'Backstage UI/Avatar',
  component: Avatar,
});

export const Default = meta.story({
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille',
  },
});

export const Fallback = meta.story({
  args: {
    ...Default.input.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA',
  },
});

export const Sizes = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="column" gap="6">
      <Flex>
        <Avatar {...args} size="x-small" />
        <Avatar {...args} size="small" />
        <Avatar {...args} size="medium" />
        <Avatar {...args} size="large" />
        <Avatar {...args} size="x-large" />
      </Flex>
      <Flex>
        <Avatar {...args} size="x-small" src="" />
        <Avatar {...args} size="small" src="" />
        <Avatar {...args} size="medium" src="" />
        <Avatar {...args} size="large" src="" />
        <Avatar {...args} size="x-large" src="" />
      </Flex>
    </Flex>
  ),
});

export const Purpose = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Informative (default)</Text>
        <Text variant="body-medium">
          Use when avatar appears alone. Announced as "{args.name}" to screen
          readers:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="informative" />
        </Flex>
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Decoration</Text>
        <Text variant="body-medium">
          Use when name appears adjacent to avatar. Hidden from screen readers
          to avoid redundancy:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="decoration" />
          <Text>{args.name}</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
});
