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
import preview from '../../../.storybook/preview';
import { Text } from './Text';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'Text',
  },
});

export const Default = meta.story({
  args: {
    children:
      "A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",
    style: { maxWidth: '600px' },
  },
});

export const AllVariants = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text variant="subtitle" {...args} />
      <Text variant="body" {...args} />
      <Text variant="caption" {...args} />
      <Text variant="label" {...args} />
    </Flex>
  ),
});

export const AllWeights = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text weight="regular" {...args} />
      <Text weight="bold" {...args} />
    </Flex>
  ),
});

export const AllColors = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text color="primary" {...args} />
      <Text color="secondary" {...args} />
      <Text color="danger" {...args} />
      <Text color="warning" {...args} />
      <Text color="success" {...args} />
    </Flex>
  ),
});

export const Truncate = meta.story({
  args: {
    ...Default.input.args,
    truncate: true,
  },
});

export const Responsive = meta.story({
  args: {
    ...Default.input.args,
    variant: {
      xs: 'label',
      md: 'body',
    },
  },
});

export const WrappedInLink = meta.story({
  args: {
    ...Default.input.args,
  },
  decorators: [
    Story => (
      <a href="/">
        <Story />
      </a>
    ),
  ],
});

export const CustomRender = meta.story({
  args: {
    ...Default.input.args,
    as: 'span',
  },
});

export const Playground = meta.story({
  render: () => (
    <Flex gap="4" direction="column">
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
    </Flex>
  ),
});
