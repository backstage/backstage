/*
 * Copyright 2020 The Backstage Authors
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
import { SelectComponent as Select, SelectProps } from './Select';

export default {
  title: 'Inputs/Select',
  component: Select,
};

const SELECT_ITEMS = [
  {
    label: 'test 1',
    value: 'test_1',
  },
  {
    label: 'test 2',
    value: 'test_2',
  },
  {
    label: 'test 3',
    value: 'test_3',
  },
];

export const Default = () => (
  <Select
    onChange={() => {}}
    placeholder="All results"
    label="Default"
    items={SELECT_ITEMS}
  />
);

export const Multiple = () => (
  <Select
    placeholder="All results"
    label="Multiple"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);

export const Disabled = (args: SelectProps) => <Select {...args} />;

Disabled.args = {
  placeholder: 'All results',
  label: 'Disabled',
  items: SELECT_ITEMS,
  disabled: true,
};

export const Selected = (args: SelectProps) => <Select {...args} />;

Selected.args = {
  placeholder: 'All results',
  label: 'Selected',
  items: SELECT_ITEMS,
  disabled: false,
  selected: 'test_2',
};

export const Native = (args: SelectProps) => <Select {...args} />;

Native.args = {
  placeholder: 'All results',
  label: 'Native',
  items: SELECT_ITEMS,
  disabled: false,
  selected: 'test_2',
  native: true,
};

export const MarginDense = (args: SelectProps) => <Select {...args} />;

MarginDense.args = {
  placeholder: 'All results',
  label: 'Margin Dense',
  items: SELECT_ITEMS,
  disabled: false,
  selected: 'test_2',
  margin: 'dense',
};
