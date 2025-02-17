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
import { HeaderTabs } from './HeaderTabs';

export default {
  title: 'Layout/HeaderTabs',
  component: HeaderTabs,
};

export const SingleTab = (args: any) => <HeaderTabs {...args} />;
SingleTab.args = {
  tabs: [
    {
      id: 'tab1',
      label: 'Tab 1',
    },
  ],
};

export const MultipleTabs = (args: any) => <HeaderTabs {...args} />;

MultipleTabs.args = {
  tabs: [
    {
      id: 'tab1',
      label: 'Tab 1',
    },
    {
      id: 'tab2',
      label: 'Tab 2',
    },
    {
      id: 'tab3',
      label: 'Tab 3',
    },
    {
      id: 'tab4',
      label: 'Tab 4',
    },
    {
      id: 'tab5',
      label: 'Tab 5',
    },
  ],
};

export const SelectedTab = (args: any) => <HeaderTabs {...args} />;

SelectedTab.args = {
  tabs: [
    {
      id: 'tab1',
      label: 'Tab 1',
    },
    {
      id: 'tab2',
      label: 'Tab 2',
    },
    {
      id: 'tab3',
      label: 'Tab 3',
    },
    {
      id: 'tab4',
      label: 'Tab 4',
    },
    {
      id: 'tab5',
      label: 'Tab 5',
    },
  ],
  selectedIndex: 1,
};
