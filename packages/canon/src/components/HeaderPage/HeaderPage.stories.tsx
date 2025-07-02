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
import { HeaderPage } from './HeaderPage';
import { HeaderPageOption, HeaderPageTab } from './types';

const meta = {
  title: 'Components/HeaderPage',
  component: HeaderPage,
} satisfies Meta<typeof HeaderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs: HeaderPageTab[] = [
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

const options: HeaderPageOption[] = [
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
  args: {
    title: 'Header Page',
  },
};

export const WithDescription: Story = {
  args: {
    ...Default.args,
    description: 'Header Page Description',
  },
};

export const WithTabs: Story = {
  args: {
    ...Default.args,
    tabs,
  },
};

export const WithOptions: Story = {
  args: {
    ...Default.args,
    options,
  },
};

export const WithEverything: Story = {
  args: {
    ...Default.args,
    description: 'Header Page Description',
    tabs,
    options,
  },
};

export const WithLayout: Story = {
  args: {
    ...WithEverything.args,
  },
  decorators: layoutDecorator,
  parameters: {
    layout: 'fullscreen',
  },
};
