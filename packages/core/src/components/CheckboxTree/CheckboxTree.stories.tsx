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

import React from 'react';
import { CheckboxTree } from '.';

const CHECKBOX_TREE_ITEMS = [
  {
    label: 'Genereic subcategory name 1',
    options: [
      {
        label: 'Option 1',
        value: 1,
      },
      {
        label: 'Option 2',
        value: 2,
      },
    ],
  },
  {
    label: 'Genereic subcategory name 2',
    options: [
      {
        label: 'Option 1',
        value: 1,
      },
      {
        label: 'Option 2',
        value: 2,
      },
    ],
  },
  {
    label: 'Genereic subcategory name 3',
    options: [
      {
        label: 'Option 1',
        value: 1,
      },
      {
        label: 'Option 2',
        value: 2,
      },
    ],
  },
];

export default {
  title: 'Inputs/CheckboxTree',
  component: CheckboxTree,
};

export const Default = () => (
  <CheckboxTree
    onChange={() => {}}
    label="default"
    subCategories={CHECKBOX_TREE_ITEMS}
  />
);
