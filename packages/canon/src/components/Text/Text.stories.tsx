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
import { Text } from './Text';
import { Stack } from '../Stack';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'Text',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      "A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",
    style: { maxWidth: '600px' },
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="md">
      <Text variant="subtitle" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="body" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="caption" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text variant="label" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <Stack gap="md">
      <Text weight="regular" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text weight="bold" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
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
  render: () => (
    <Stack>
      <Text>Subtitle</Text>
      <Text variant="subtitle" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Body</Text>
      <Text variant="body" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Caption</Text>
      <Text variant="caption" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Label</Text>
      <Text variant="label" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Stack>
  ),
};
