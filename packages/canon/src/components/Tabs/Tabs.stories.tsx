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

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { MemoryRouter } from 'react-router-dom';
import { Box } from '../Box';
import { Text } from '../Text';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export const Default: Story = {
  args: {
    children: '',
  },
  decorators: [withRouter],
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
        <Tab id="tab3">Tab 3 With long title</Tab>
      </TabList>
    </Tabs>
  ),
};

export const WithTabPanels: Story = {
  args: {
    children: '',
  },
  decorators: [withRouter],
  render: () => (
    <Tabs>
      <TabList>
        <Tab id="tab1">Settings</Tab>
        <Tab id="tab2">Profile</Tab>
        <Tab id="tab3">Preferences</Tab>
      </TabList>
      <TabPanel id="tab1">
        <Text>Settings panel content goes here</Text>
      </TabPanel>
      <TabPanel id="tab2">
        <Text>Profile panel content goes here</Text>
      </TabPanel>
      <TabPanel id="tab3">
        <Text>Preferences panel content goes here</Text>
      </TabPanel>
    </Tabs>
  ),
};

export const WithMockedURLTab2: Story = {
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/tab2']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL is mocked to be: <strong>/tab2</strong>
        </Text>
        <Text>
          Notice how the "Tab 2" tab is selected (highlighted) because it
          matches the current path.
        </Text>
      </Box>
    </MemoryRouter>
  ),
};

export const WithMockedURLTab3: Story = {
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/tab3']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL is mocked to be: <strong>/tab3</strong>
        </Text>
        <Text>
          Notice how the "Tab 3 With long title" tab is selected (highlighted)
          because it matches the current path.
        </Text>
      </Box>
    </MemoryRouter>
  ),
};

export const WithMockedURLNoMatch: Story = {
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/some-other-page']}>
      <Tabs>
        <TabList>
          <Tab id="tab1" href="/tab1">
            Tab 1
          </Tab>
          <Tab id="tab2" href="/tab2">
            Tab 2
          </Tab>
          <Tab id="tab3" href="/tab3">
            Tab 3 With long title
          </Tab>
        </TabList>
      </Tabs>
      <Box mt="6" pl="2">
        <Text>
          Current URL is mocked to be: <strong>/some-other-page</strong>
        </Text>
        <Text>
          No tab is selected because the current path doesn't match any tab's
          href.
        </Text>
        <Text>
          Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title")
          fall back to React Aria's internal state.
        </Text>
      </Box>
    </MemoryRouter>
  ),
};
