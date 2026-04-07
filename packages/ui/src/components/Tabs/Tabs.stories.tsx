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
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Box } from '../Box';
import { Text } from '../Text';

const meta = preview.meta({
  title: 'Backstage UI/Tabs',
  component: Tabs,
});

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <BUIProvider>
      <Story />
    </BUIProvider>
  </MemoryRouter>
);

export const Default = meta.story({
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
});

export const WithTabPanels = meta.story({
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
});

export const WithMockedURLTab2 = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/tab2']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL is mocked to be: <strong>/tab2</strong>
          </Text>
          <Text as="p">
            Notice how the "Tab 2" tab is selected (highlighted) because it
            matches the current path.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const WithMockedURLTab3 = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/tab3']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL is mocked to be: <strong>/tab3</strong>
          </Text>
          <Text as="p">
            Notice how the "Tab 3 With long title" tab is selected (highlighted)
            because it matches the current path.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const WithMockedURLNoMatch = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/some-other-page']}>
      <BUIProvider>
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
          <Text as="p">
            Current URL is mocked to be: <strong>/some-other-page</strong>
          </Text>
          <Text as="p">
            No tab is selected because the current path doesn't match any tab's
            href.
          </Text>
          <Text as="p">
            Tabs without href (like "Tab 1", "Tab 2", "Tab 3 With long title")
            fall back to React Aria's internal state.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

// New stories for testing match strategies

export const ExactMatchingDefault = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/mentorship/events']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="mentorship" href="/mentorship">
              Mentorship
            </Tab>
            <Tab id="events" href="/mentorship/events">
              Events
            </Tab>
            <Tab id="catalog" href="/catalog">
              Catalog
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/mentorship/events</strong>
          </Text>
          <Text as="p">
            Using default exact matching, only the "Events" tab is active
            because it exactly matches the URL.
          </Text>
          <Text as="p">
            The "Mentorship" tab is NOT active even though the URL contains
            "/mentorship".
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const PrefixMatchingForNestedRoutes = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/mentorship/events']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="mentorship" href="/mentorship" matchStrategy="prefix">
              Mentorship
            </Tab>
            <Tab id="events" href="/mentorship/events">
              Events
            </Tab>
            <Tab id="catalog" href="/catalog" matchStrategy="prefix">
              Catalog
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/mentorship/events</strong>
          </Text>
          <Text as="p">
            The "Mentorship" tab uses prefix matching and IS active because
            "/mentorship/events" starts with "/mentorship".
          </Text>
          <Text as="p">
            The "Events" tab uses exact matching and is also active because it
            exactly matches.
          </Text>
          <Text as="p">
            The "Catalog" tab uses prefix matching but is NOT active because the
            URL doesn't start with "/catalog".
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const PrefixMatchingDeepNesting = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/catalog/users/john/details']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="home" href="/home">
              Home
            </Tab>
            <Tab id="catalog" href="/catalog" matchStrategy="prefix">
              Catalog
            </Tab>
            <Tab id="mentorship" href="/mentorship" matchStrategy="prefix">
              Mentorship
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/catalog/users/john/details</strong>
          </Text>
          <Text as="p">
            The "Catalog" tab is active because it uses prefix matching and the
            URL starts with "/catalog".
          </Text>
          <Text as="p">
            This works for any level of nesting under "/catalog".
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const MixedMatchingStrategies = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/dashboard/analytics/reports']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="overview" href="/dashboard">
              Overview
            </Tab>
            <Tab
              id="analytics"
              href="/dashboard/analytics"
              matchStrategy="prefix"
            >
              Analytics
            </Tab>
            <Tab
              id="settings"
              href="/dashboard/settings"
              matchStrategy="prefix"
            >
              Settings
            </Tab>
            <Tab id="help" href="/help">
              Help
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/dashboard/analytics/reports</strong>
          </Text>
          <Text as="p">
            • "Overview" tab: exact matching, NOT active (doesn't exactly match
            "/dashboard")
          </Text>
          <Text as="p">
            • "Analytics" tab: prefix matching, IS active (URL starts with
            "/dashboard/analytics")
          </Text>
          <Text as="p">
            • "Settings" tab: prefix matching, NOT active (URL doesn't start
            with "/dashboard/settings")
          </Text>
          <Text as="p">
            • "Help" tab: exact matching, NOT active (doesn't exactly match
            "/help")
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const PrefixMatchingEdgeCases = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/foobar']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="foo" href="/foo" matchStrategy="prefix">
              Foo
            </Tab>
            <Tab id="foobar" href="/foobar">
              Foobar
            </Tab>
            <Tab id="foo-exact" href="/foo">
              Foo (exact)
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/foobar</strong>
          </Text>
          <Text as="p">
            • "Foo" tab (prefix): NOT active - prevents "/foo" from matching
            "/foobar"
          </Text>
          <Text as="p">
            • "Foobar" tab (exact): IS active - exactly matches "/foobar"
          </Text>
          <Text as="p">
            • "Foo (exact)" tab: NOT active - doesn't exactly match "/foobar"
          </Text>
          <Text as="p">
            This shows that prefix matching properly requires a "/" separator to
            prevent false matches.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const PrefixMatchingWithSlash = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/foo/bar']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="foo" href="/foo" matchStrategy="prefix">
              Foo
            </Tab>
            <Tab id="foobar" href="/foobar">
              Foobar
            </Tab>
            <Tab id="bar" href="/bar" matchStrategy="prefix">
              Bar
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/foo/bar</strong>
          </Text>
          <Text as="p">
            • "Foo" tab (prefix): IS active - "/foo/bar" starts with "/foo/"
          </Text>
          <Text as="p">
            • "Foobar" tab (exact): NOT active - doesn't exactly match "/foobar"
          </Text>
          <Text as="p">
            • "Bar" tab (prefix): NOT active - "/foo/bar" doesn't start with
            "/bar"
          </Text>
          <Text as="p">
            This demonstrates proper prefix matching with the "/" separator.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const RootPathMatching = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab id="home" href="/">
              Home
            </Tab>
            <Tab id="home-prefix" href="/" matchStrategy="prefix">
              Home (prefix)
            </Tab>
            <Tab id="catalog" href="/catalog" matchStrategy="prefix">
              Catalog
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/</strong>
          </Text>
          <Text as="p">
            • "Home" tab (exact): IS active - exactly matches "/"
          </Text>
          <Text as="p">• "Home (prefix)" tab: IS active - "/" matches "/"</Text>
          <Text as="p">
            • "Catalog" tab (prefix): NOT active - "/" doesn't start with
            "/catalog"
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const HrefWithQueryParams = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/cost-insights/dashboard?group=bar']}>
      <BUIProvider>
        <Tabs>
          <TabList>
            <Tab
              id="dashboard"
              href="/cost-insights/dashboard?group=foo"
              matchStrategy="prefix"
            >
              Dashboard
            </Tab>
            <Tab
              id="alerts"
              href="/cost-insights/alerts?group=foo"
              matchStrategy="prefix"
            >
              Alerts
            </Tab>
          </TabList>
        </Tabs>
        <Box mt="6" pl="2">
          <Text as="p">
            Current URL: <strong>/cost-insights/dashboard?group=bar</strong>
          </Text>
          <Text as="p">
            Tab hrefs include query params (e.g., ?group=foo) but the current
            URL has different query params (?group=bar).
          </Text>
          <Text as="p">
            • "Dashboard" tab: IS active — matching ignores query params and
            compares only the pathname.
          </Text>
          <Text as="p">
            • "Alerts" tab: NOT active — pathname /cost-insights/alerts doesn't
            match /cost-insights/dashboard.
          </Text>
        </Box>
      </BUIProvider>
    </MemoryRouter>
  ),
});

export const AutoSelectionOfTabs = meta.story({
  args: {
    children: '',
  },
  render: () => (
    <MemoryRouter initialEntries={['/random-page']}>
      <BUIProvider>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Text style={{ fontSize: '16px', color: '#666' }}>
            Current URL: <strong>/random-page</strong>
          </Text>

          {/* Without hrefs */}
          <Text>
            {' '}
            <strong>Case 1: Without hrefs</strong>
          </Text>
          <Tabs>
            <TabList>
              <Tab id="settings">Settings</Tab>
              <Tab id="preferences">Preferences</Tab>
              <Tab id="advanced">Advanced</Tab>
            </TabList>
            <TabPanel id="settings">
              <Text>Settings content - React Aria manages this selection</Text>
            </TabPanel>
            <TabPanel id="preferences">
              <Text>Preferences content - works normally</Text>
            </TabPanel>
            <TabPanel id="advanced">
              <Text>Advanced content - local state only</Text>
            </TabPanel>
          </Tabs>

          {/* With hrefs */}
          <Text as="p">
            <strong>Case 2: With hrefs</strong>
          </Text>
          <Text as="p">
            By default no selection is shown because the URL doesn't match any
            tab's href.
          </Text>
          <Tabs>
            <TabList>
              <Tab id="catalog" href="/catalog">
                Catalog
              </Tab>
              <Tab id="create" href="/create">
                Create
              </Tab>
              <Tab id="docs" href="/docs">
                Docs
              </Tab>
            </TabList>
          </Tabs>
        </div>
      </BUIProvider>
    </MemoryRouter>
  ),
});
