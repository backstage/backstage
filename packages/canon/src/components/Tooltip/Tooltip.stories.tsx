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
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip.Root,
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Tooltip.Trigger
          render={props => (
            <Button {...props} size="small">
              Button
            </Button>
          )}
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10}>
            <Tooltip.Popup>Nice!</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </>
    ),
  },
};

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
};

export const WithArrow: Story = {
  args: {
    open: true,
    children: (
      <>
        <Tooltip.Trigger
          render={props => (
            <Button {...props} size="small">
              Button
            </Button>
          )}
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10}>
            <Tooltip.Popup>
              <Tooltip.Arrow />
              Nice!
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </>
    ),
  },
};
