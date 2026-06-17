'use client';

import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '../../../../../packages/ui/src/components/Tabs';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { MemoryRouter } from 'react-router-dom';

export const Default = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const DefaultSelectedKey = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const DisabledTabs = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};

export const Orientation = () => {
  return (
    <MemoryRouter>
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
    </MemoryRouter>
  );
};
