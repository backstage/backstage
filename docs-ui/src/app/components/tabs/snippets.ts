export const tabsUsageSnippet = `import { Tabs, TabList, Tab, TabPanel } from '@backstage/ui';

<Tabs>
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>`;

export const defaultSnippet = `<Tabs>
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
    <Tab id="tab3">Tab 3</Tab>
  </TabList>
  <TabPanel id="tab1">
    <Text>Content for Tab 1</Text>
  </TabPanel>
  <TabPanel id="tab2">
    <Text>Content for Tab 2</Text>
  </TabPanel>
  <TabPanel id="tab3">
    <Text>Content for Tab 3</Text>
  </TabPanel>
</Tabs>`;

export const defaultSelectedKeySnippet = `<Tabs defaultSelectedKey="tab2">
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
    <Tab id="tab3">Tab 3</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
  <TabPanel id="tab3">Content 3</TabPanel>
</Tabs>`;

export const disabledTabsSnippet = `<Tabs>
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2" isDisabled>Tab 2 (Disabled)</Tab>
    <Tab id="tab3">Tab 3</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
  <TabPanel id="tab3">Content 3</TabPanel>
</Tabs>`;

export const orientationSnippet = `<Tabs orientation="vertical">
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
    <Tab id="tab3">Tab 3</Tab>
  </TabList>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
  <TabPanel id="tab3">Content 3</TabPanel>
</Tabs>`;
