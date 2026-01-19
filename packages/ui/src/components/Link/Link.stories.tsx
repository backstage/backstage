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
import type { StoryFn } from '@storybook/react-vite';
import { Link } from './Link';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Backstage UI/Link',
  component: Link,
  args: {
    children: 'Link',
  },
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
});

export const Default = meta.story({
  args: {
    href: '/',
    children: 'Sign up for Backstage',
  },
});

export const ExternalLink = meta.story({
  args: {
    href: 'https://backstage.io',
    children: 'Sign up for Backstage',
    target: '_blank',
  },
});

export const AllVariants = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Link href="https://ui.backstage.io" variant="title-large" {...args} />
      <Link href="https://ui.backstage.io" variant="title-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="title-small" {...args} />
      <Link href="https://ui.backstage.io" variant="title-x-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-large" {...args} />
      <Link href="https://ui.backstage.io" variant="body-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="body-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-x-small" {...args} />
    </Flex>
  ),
});

export const AllColors = meta.story({
  render: () => (
    <Flex gap="4" direction="column">
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="primary"
        children="I am primary"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="secondary"
        children="I am secondary"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="danger"
        children="I am danger"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="warning"
        children="I am warning"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        color="success"
        children="I am success"
      />
    </Flex>
  ),
});

export const AllWeights = meta.story({
  render: () => (
    <Flex gap="4" direction="column">
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="title-large"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="title-large"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="title-medium"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="title-medium"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="title-small"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="title-x-small"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="title-x-small"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="body-large"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="body-large"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="body-medium"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="body-medium"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="body-small"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="body-small"
          weight="bold"
          children="A turtle"
        />
      </Flex>
      <Flex>
        <Link
          href="https://ui.backstage.io"
          variant="body-x-small"
          weight="regular"
          children="A fox"
        />
        <Link
          href="https://ui.backstage.io"
          variant="body-x-small"
          weight="bold"
          children="A turtle"
        />
      </Flex>
    </Flex>
  ),
});

export const Truncate = meta.story({
  args: {
    children:
      "A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",
    href: '/',
    truncate: true,
    style: { width: '480px' },
  },
});

export const Responsive = meta.story({
  args: {
    ...Default.input.args,
    variant: {
      xs: 'title-x-small',
      md: 'body-x-small',
    },
  },
});

export const Playground = meta.story({
  args: {
    ...Default.input.args,
  },
  render: args => (
    <Flex gap="4" direction="column">
      <Text>Title X Small</Text>
      <Link variant="title-x-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body X Small</Text>
      <Link variant="body-x-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Small</Text>
      <Link variant="body-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Medium</Text>
      <Link variant="body-medium" style={{ maxWidth: '600px' }} {...args} />
      <Text>Body Large</Text>
      <Link variant="body-large" style={{ maxWidth: '600px' }} {...args} />
      <Text>Title Small</Text>
      <Link variant="title-small" style={{ maxWidth: '600px' }} {...args} />
      <Text>Title Medium</Text>
      <Link variant="title-medium" style={{ maxWidth: '600px' }} {...args} />
    </Flex>
  ),
});
