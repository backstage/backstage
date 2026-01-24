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
import { ButtonLink } from './ButtonLink';
import { Flex } from '../Flex';
import { MemoryRouter } from 'react-router-dom';
import { RiArrowRightSLine, RiCloudLine } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/ButtonLink',
  component: ButtonLink,
  decorators: [
    (Story: StoryFn) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
});

export const Default = meta.story({
  args: {
    children: 'Button',
  },
});

export const Variants = meta.story({
  render: () => (
    <Flex align="center">
      <ButtonLink
        iconStart={<RiCloudLine />}
        variant="primary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
      <ButtonLink
        iconStart={<RiCloudLine />}
        variant="secondary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
      <ButtonLink
        iconStart={<RiCloudLine />}
        variant="tertiary"
        href="https://ui.backstage.io"
        target="_blank"
      >
        Button
      </ButtonLink>
    </Flex>
  ),
});

export const Sizes = meta.story({
  args: {
    children: 'Button',
  },
  render: () => (
    <Flex align="center">
      <ButtonLink size="small" iconStart={<RiCloudLine />}>
        Small
      </ButtonLink>
      <ButtonLink size="medium" iconStart={<RiCloudLine />}>
        Medium
      </ButtonLink>
    </Flex>
  ),
});

export const WithIcons = meta.story({
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink
        {...args}
        iconStart={<RiCloudLine />}
        iconEnd={<RiArrowRightSLine />}
      />
    </Flex>
  ),
});

export const FullWidth = meta.story({
  args: {
    children: 'Button',
  },
  render: args => (
    <Flex direction="column" gap="4" style={{ width: '300px' }}>
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink
        {...args}
        iconStart={<RiCloudLine />}
        iconEnd={<RiArrowRightSLine />}
      />
    </Flex>
  ),
});

export const Disabled = meta.story({
  render: () => (
    <Flex direction="row" gap="4">
      <ButtonLink variant="primary" isDisabled>
        Primary
      </ButtonLink>
      <ButtonLink variant="secondary" isDisabled>
        Secondary
      </ButtonLink>
      <ButtonLink variant="tertiary" isDisabled>
        Tertiary
      </ButtonLink>
    </Flex>
  ),
});

export const Responsive = meta.story({
  args: {
    children: 'Button',
    variant: {
      initial: 'primary',
      sm: 'secondary',
    },
    size: {
      xs: 'small',
      sm: 'medium',
    },
  },
});
