'use client';

import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '../../../../../packages/ui/src/components/Tabs';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { DocsRouterProvider } from '@/utils/backstage-router-provider';

export const Default = () => {
  return (
    <DocsRouterProvider>
      <Tabs>
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
      </Tabs>
    </DocsRouterProvider>
  );
};

export const DefaultSelectedKey = () => {
  return (
    <DocsRouterProvider>
      <Tabs defaultSelectedKey="tab2">
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
      </Tabs>
    </DocsRouterProvider>
  );
};

export const DisabledTabs = () => {
  return (
    <DocsRouterProvider>
      <Tabs>
        <TabList>
          <Tab id="tab1">Tab 1</Tab>
          <Tab id="tab2" isDisabled>
            Tab 2 (Disabled)
          </Tab>
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
      </Tabs>
    </DocsRouterProvider>
  );
};

export const Orientation = () => {
  return (
    <DocsRouterProvider>
      <Tabs orientation="vertical">
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
      </Tabs>
    </DocsRouterProvider>
  );
};
