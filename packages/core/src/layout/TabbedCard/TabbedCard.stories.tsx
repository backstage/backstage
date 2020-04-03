/*
 * Copyright 2020 Spotify AB
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
import React, { useState } from 'react';
import { TabbedCard, CardTabPanel, CardTab, CardTabs, BottomLink } from '.';

export default {
  title: 'Tabbed Card',
  component: TabbedCard,
};

export const Default = () => {
  const [selectedTab, selectTab] = useState(0);

  const handleSelectTab = (_, newSelectedTab) => selectTab(newSelectedTab);

  return (
    <TabbedCard>
      <CardTabs onChange={handleSelectTab} value={selectedTab} title="Test">
        <CardTab label="Test 1" />
        <CardTab label="Test 2" />
        <CardTab label="Test 3" />
      </CardTabs>
      <CardTabPanel value={selectedTab} index={0}>
        Test 1
      </CardTabPanel>
      <CardTabPanel value={selectedTab} index={1}>
        Test 2
      </CardTabPanel>
      <CardTabPanel value={selectedTab} index={2}>
        Test 3
      </CardTabPanel>
    </TabbedCard>
  );
};

export const LinkInFooter = () => {
  const [selectedTab, selectTab] = useState(0);

  const handleSelectTab = (_, newSelectedTab) => selectTab(newSelectedTab);

  return (
    <TabbedCard>
      <CardTabs onChange={handleSelectTab} value={selectedTab} title="Test">
        <CardTab label="Test 1" />
        <CardTab label="Test 2" />
        <CardTab label="Test 3" />
      </CardTabs>
      <CardTabPanel value={selectedTab} index={0}>
        Test 1
      </CardTabPanel>
      <CardTabPanel value={selectedTab} index={1}>
        Test 2
      </CardTabPanel>
      <CardTabPanel value={selectedTab} index={2}>
        Test 3
      </CardTabPanel>
      <BottomLink title="Go to Location" link="#" />
    </TabbedCard>
  );
};
