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
import { HeaderActionMenu, HeaderActionMenuProps } from './HeaderActionMenu';

export default {
  title: 'Layout/HeaderActionMenu',
  component: HeaderActionMenu,
};

export const Default = (args: HeaderActionMenuProps) => (
  <HeaderActionMenu {...args} />
);
Default.args = {
  actionItems: [
    {
      label: 'Item 1',
      secondaryLabel: 'Item 1 secondary label',
      disabled: false,
    },
    {
      label: 'Item 2',
      secondaryLabel: 'Item 2 secondary label',
      disabled: true,
    },
    {
      label: 'Item 3',
      secondaryLabel: 'Item 3 secondary label',
      disabled: true,
    },
  ],
};
