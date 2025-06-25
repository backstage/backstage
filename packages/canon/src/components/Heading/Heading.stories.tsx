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
import { Heading } from './Heading';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Components/Heading',
  component: Heading,
  args: {
    children: 'Heading',
  },
});

export const Default = meta.story();

export const Title1 = meta.story({
  args: {
    children: 'Look mum, no hands!',
    variant: 'title1',
  },
});

export const AllVariants = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
      <Heading variant="title5">Title 5</Heading>
    </Flex>
  ),
});

export const AllColors = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Heading color="primary" {...args} />
      <Heading color="secondary" {...args} />
    </Flex>
  ),
});

export const Truncate = meta.story({
  args: {
    ...Title1.input.args,
    truncate: true,
    style: { maxWidth: '400px' },
  },
});

export const Responsive = meta.story({
  args: {
    variant: {
      xs: 'title4',
      md: 'display',
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
    as: 'h4',
  },
});

export const Playground = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Heading variant="display">Display</Heading>
      <Heading variant="title1">Title 1</Heading>
      <Heading variant="title2">Title 2</Heading>
      <Heading variant="title3">Title 3</Heading>
      <Heading variant="title4">Title 4</Heading>
      <Heading variant="title5">Title 5</Heading>
    </Flex>
  ),
});
