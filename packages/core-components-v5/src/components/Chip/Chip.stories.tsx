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
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import EditIcon from '@material-ui/icons/Edit';
import Chip, { ChipProps } from '@material-ui/core/Chip';

const icons = {
  AddIcon: <AddIcon />,
  WarningIcon: <WarningIcon />,
  EditIcon: <EditIcon />,
  None: null,
};

const defaultArgs = {
  label: 'Label',
  size: 'medium',
  variant: 'default',
  icon: 'None',
};

export default {
  title: 'Data Display/Chip',
  component: Chip,
  argTypes: {
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
    },
    variant: {
      options: ['default', 'outlined'],
      control: { type: 'select' },
    },
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
      },
    },
  },
};

export const Default = (args: ChipProps) => <Chip {...args} />;
Default.args = defaultArgs;

export const Deleteable = (args: ChipProps) => (
  <Chip {...args} onDelete={() => ({})} />
);
Deleteable.args = defaultArgs;
