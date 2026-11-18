/*
 * Copyright 2026 The Backstage Authors
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

import preview from '../../../../../.storybook/preview';
import {
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from './Sheet';
import { Button, Flex, Select, Text, TextField } from '@backstage/ui';
import { useArgs } from 'storybook/preview-api';

const meta = preview.meta({
  title: 'Backstage UI/Sheet',
  component: Sheet,
  args: {
    isOpen: undefined,
    defaultOpen: undefined,
    position: 'end',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    position: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right', 'start', 'end', 'center'],
    },
  },
});

export const Default = meta.story({
  render: args => (
    <SheetTrigger>
      <Button variant="secondary">Open Sheet</Button>
      <Sheet {...args}>
        <SheetHeader>Example Sheet</SheetHeader>
        <SheetBody>
          <Text>
            This is a basic sheet example. It can be dismissed by pressing
            Escape, clicking outside, or swiping toward the nearest edge.
          </Text>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" slot="close">
            Close
          </Button>
          <Button variant="primary" slot="close">
            Save
          </Button>
        </SheetFooter>
      </Sheet>
    </SheetTrigger>
  ),
});

export const Open = Default.extend({
  args: {
    defaultOpen: true,
  },
});

export const PositionStart = Default.extend({
  args: {
    defaultOpen: true,
    position: 'start',
  },
});

export const PositionBottom = Default.extend({
  args: {
    defaultOpen: true,
    position: 'bottom',
  },
});

export const PositionTop = Default.extend({
  args: {
    defaultOpen: true,
    position: 'top',
  },
});

export const PositionCenter = Default.extend({
  args: {
    defaultOpen: true,
    position: 'center',
  },
});

export const WithForm = meta.story({
  args: {
    defaultOpen: true,
  },
  render: args => (
    <Sheet {...args}>
      <SheetHeader>Create New User</SheetHeader>
      <SheetBody>
        <Flex direction="column" gap="3">
          <TextField label="Name" placeholder="Enter full name" />
          <TextField label="Email" placeholder="Enter email address" />
          <Select
            label="Role"
            options={[
              { id: 'admin', label: 'Admin' },
              { id: 'user', label: 'User' },
              { id: 'viewer', label: 'Viewer' },
            ]}
          />
        </Flex>
      </SheetBody>
      <SheetFooter>
        <Button variant="secondary" slot="close">
          Cancel
        </Button>
        <Button variant="primary" slot="close">
          Create User
        </Button>
      </SheetFooter>
    </Sheet>
  ),
});

export const SnapPoints = meta.story({
  args: {
    defaultOpen: true,
    position: 'bottom',
    snapPoints: [240],
    height: 560,
  },
  render: args => (
    <Sheet {...args}>
      <SheetHeader>Snap Points</SheetHeader>
      <SheetBody>
        <Flex direction="column" gap="3">
          <Text>
            This sheet opens at a partial height. Drag it up to reveal the rest
            of the content, or swipe down to dismiss it.
          </Text>
          {Array.from({ length: 12 }, (_, i) => (
            <Text key={i}>
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </Text>
          ))}
        </Flex>
      </SheetBody>
      <SheetFooter>
        <Button variant="secondary" slot="close">
          Dismiss
        </Button>
      </SheetFooter>
    </Sheet>
  ),
});

export const NoTrigger = meta.story({
  args: {
    isOpen: true,
  },
  render: args => {
    const [{ isOpen }, updateArgs] = useArgs();

    return (
      <Sheet
        {...args}
        isOpen={isOpen}
        onOpenChange={value => updateArgs({ isOpen: value })}
      >
        <SheetHeader>Controlled Sheet</SheetHeader>
        <SheetBody>
          <Text>This sheet is controlled by external state.</Text>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" slot="close">
            Close
          </Button>
        </SheetFooter>
      </Sheet>
    );
  },
});

export const OverflowWithoutHeight = meta.story({
  args: {
    defaultOpen: true,
  },
  render: args => (
    <Sheet {...args}>
      <SheetHeader>Overflow Without Height</SheetHeader>
      <SheetBody>
        <Flex direction="column" gap="3">
          {Array.from({ length: 20 }, (_, i) => (
            <Text key={i}>
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </Text>
          ))}
        </Flex>
      </SheetBody>
      <SheetFooter>
        <Button variant="secondary" slot="close">
          Cancel
        </Button>
        <Button variant="primary" slot="close">
          Confirm
        </Button>
      </SheetFooter>
    </Sheet>
  ),
});
