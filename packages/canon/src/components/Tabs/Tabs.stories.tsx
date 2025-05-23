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

import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Root,
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyles = {
  padding: 'var(--canon-space-3)',
  fontSize: 'var(--canon-font-size-2)',
};

export const Default: Story = {
  args: {
    children: (
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3 With long title</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel style={panelStyles}>Content for Tab 1</Tabs.Panel>
        <Tabs.Panel style={panelStyles}>Content for Tab 2</Tabs.Panel>
        <Tabs.Panel style={panelStyles}>Content for Tab 3</Tabs.Panel>
      </Tabs.Root>
    ),
  },
};
