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

import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { Toolbar } from './Toolbar';

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  {
    label: 'Overview',
  },
  {
    label: 'Checks',
  },
  {
    label: 'Tracks',
  },
  {
    label: 'Campaigns',
  },
  {
    label: 'Integrations',
  },
];

const options = [
  {
    label: 'Settings',
    value: 'settings',
  },
  {
    label: 'Invite new members',
    value: 'invite-new-members',
  },
];

// Extract layout decorator as a reusable constant
const layoutDecorator = [
  (Story: StoryFn) => (
    <>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          left: 8,
          top: 8,
          bottom: 8,
          backgroundColor: 'var(--canon-bg-surface-1',
          borderRadius: 'var(--canon-radius-2)',
          border: '1px solid var(--canon-border)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          paddingInline: '266px',
          minHeight: '200vh',
        }}
      >
        <Story />
      </div>
      <div
        style={{
          width: '250px',
          position: 'fixed',
          right: 8,
          top: 8,
          bottom: 8,
          backgroundColor: 'var(--canon-bg-surface-1',
          borderRadius: 'var(--canon-radius-2)',
          border: '1px solid var(--canon-border)',
          zIndex: 1,
        }}
      />
    </>
  ),
];

export const Default: Story = {
  args: {},
};

export const WithTabs: Story = {
  args: {
    tabs,
  },
};

export const WithOptions: Story = {
  args: {
    options,
  },
};

export const WithOptionsAndTabs: Story = {
  args: {
    options,
    tabs,
  },
};

export const WithLayout: Story = {
  args: {
    options,
    tabs,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
};
