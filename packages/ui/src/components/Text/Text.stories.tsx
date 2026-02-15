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

import preview from '../../../../../.storybook/preview';
import { Text } from './Text';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Backstage UI/Text',
  component: Text,
  args: {
    children: 'Text',
  },
});

export const Default = meta.story({
  args: {
    children:
      "A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",
  },
});

export const AllVariants = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="6" direction="column">
      <Text {...args} variant="title-large" style={{ maxWidth: '1160px' }} />
      <Text {...args} variant="title-medium" style={{ maxWidth: '760px' }} />
      <Text {...args} variant="title-small" style={{ maxWidth: '580px' }} />
      <Text {...args} variant="title-x-small" style={{ maxWidth: '480px' }} />
      <Text {...args} variant="body-large" style={{ maxWidth: '380px' }} />
      <Text {...args} variant="body-medium" style={{ maxWidth: '320px' }} />
      <Text {...args} variant="body-small" style={{ maxWidth: '264px' }} />
      <Text {...args} variant="body-x-small" style={{ maxWidth: '224px' }} />
    </Flex>
  ),
});

export const AllWeights = meta.story({
  render: () => (
    <Flex gap="4" direction="column">
      <Flex>
        <Text variant="title-large" weight="regular" children="A fox" />
        <Text variant="title-large" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="title-medium" weight="regular" children="A fox" />
        <Text variant="title-medium" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="title-small" weight="regular" children="A fox" />
        <Text variant="title-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="title-x-small" weight="regular" children="A fox" />
        <Text variant="title-x-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="body-large" weight="regular" children="A fox" />
        <Text variant="body-large" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="body-medium" weight="regular" children="A fox" />
        <Text variant="body-medium" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="body-small" weight="regular" children="A fox" />
        <Text variant="body-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Text variant="body-x-small" weight="regular" children="A fox" />
        <Text variant="body-x-small" weight="bold" children="A turtle" />
      </Flex>
    </Flex>
  ),
});

export const AllColors = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text {...args} color="primary" children="I am primary" />
      <Text {...args} color="secondary" children="I am secondary" />
      <Text {...args} color="danger" children="I am danger" />
      <Text {...args} color="warning" children="I am warning" />
      <Text {...args} color="success" children="I am success" />
      <Text {...args} color="info" children="I am info" />
    </Flex>
  ),
});

export const Truncate = meta.story({
  args: {
    ...Default.input.args,
    truncate: true,
    as: 'p',
    style: { width: '480px' },
  },
});

export const Responsive = meta.story({
  args: {
    ...Default.input.args,
    variant: {
      xs: 'title-x-small',
      md: 'body-large',
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
    as: 'label',
  },
});

export const Playground = meta.story({
  render: () => (
    <Flex gap="4" direction="column">
      <Text>Subtitle</Text>
      <Text variant="title-large" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Body</Text>
      <Text variant="body-medium" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Caption</Text>
      <Text variant="body-x-small" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
      <Text>Label</Text>
      <Text variant="title-x-small" style={{ maxWidth: '600px' }}>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Flex>
  ),
});
