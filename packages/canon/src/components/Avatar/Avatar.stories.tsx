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
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { Inline } from '../Inline';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    src: 'https://backstage.io/img/logo-gradient-on-dark.svg',
  },
};

export const Sizes: Story = {
  args: {
    src: 'https://backstage.io/img/logo-gradient-on-dark.svg',
  },
  render: args => (
    <Inline alignY="center">
      <Avatar size="small" src={args.src} />
      <Avatar size="medium" src={args.src} />
      <Avatar size="large" src={args.src} />
    </Inline>
  ),
};

export const Status: Story = {
  args: {
    src: 'https://backstage.io/img/logo-gradient-on-dark.svg',
  },
  render: args => (
    <Inline alignY="center">
      <Avatar status="online" src={args.src} />
      <Avatar status="offline" src={args.src} />
      <Avatar status="away" src={args.src} />
      <Avatar status="busy" src={args.src} />
    </Inline>
  ),
};

export const Placeholder: Story = {
  args: {
    text: 'PG',
  },
};

export const Radius: Story = {
  args: {
    src: 'https://backstage.io/img/logo-gradient-on-dark.svg',
  },
  render: args => (
    <Inline alignY="center">
      <Avatar radius="0" src={args.src} />
      <Avatar radius="25%" src={args.src} />
      <Avatar radius="100%" src={args.src} />
    </Inline>
  ),
};

export const Group: Story = {
  args: {
    src: 'https://backstage.io/img/logo-gradient-on-dark.svg',
    size: 'small',
  },
  render: args => (
    <AvatarGroup>
      <Avatar src={args.src} size={args.size} />
      <Avatar src={args.src} size={args.size} />
      <Avatar src={args.src} size={args.size} />
      <Avatar src={args.src} size={args.size} />
    </AvatarGroup>
  ),
};
