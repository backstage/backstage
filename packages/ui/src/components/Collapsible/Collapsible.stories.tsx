/*
 * Copyright 2025 The Backstage Authors
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

import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from './Collapsible';
import { Button } from '../Button';
import { Box } from '../Box';
import { Text } from '../Text';
import { Icon } from '../Icon';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible.Root,
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bui-space-2)',
      alignItems: 'center',
    },
    children: (
      <>
        <Collapsible.Trigger
          render={(props, state) => (
            <Button
              variant="secondary"
              iconEnd={
                state.open ? (
                  <Icon name="chevron-up" />
                ) : (
                  <Icon name="chevron-down" />
                )
              }
              {...props}
            >
              {state.open ? 'Close Panel' : 'Open Panel'}
            </Button>
          )}
        />
        <Collapsible.Panel>
          <Box
            p="4"
            style={{
              border: '1px solid var(--bui-border)',
              backgroundColor: 'var(--bui-bg-surface-1)',
              color: 'var(--bui-fg-primary)',
              borderRadius: 'var(--bui-radius-2)',
              width: '460px',
            }}
          >
            <Text>
              It's the edge of the world and all of Western civilization
            </Text>
            <Text>
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
            <Text>It's understood that Hollywood sells Californication</Text>
          </Box>
        </Collapsible.Panel>
      </>
    ),
  },
};

export const Open: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
  },
};
