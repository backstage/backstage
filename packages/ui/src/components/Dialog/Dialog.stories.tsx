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
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogClose,
} from './Dialog';
import { Button, Flex, Text, TextField, Select } from '@backstage/ui';
import { useArgs } from 'storybook/preview-api';

const meta = {
  title: 'Backstage UI/Dialog',
  component: Dialog,
  args: {
    isOpen: undefined,
    defaultOpen: undefined,
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    return (
      <DialogTrigger {...args}>
        <Button variant="secondary">Open Dialog</Button>
        <Dialog>
          <DialogHeader>Example Dialog</DialogHeader>
          <DialogBody>
            <Text>This is a basic dialog example.</Text>
          </DialogBody>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <DialogClose variant="primary">Save</DialogClose>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
    );
  },
};

export const Open: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
  },
  render: Default.render,
};

export const NoTrigger: Story = {
  args: {
    isOpen: true,
  },
  render: args => {
    const [{ isOpen }, updateArgs] = useArgs();

    return (
      <Dialog
        {...args}
        isOpen={isOpen}
        onOpenChange={value => updateArgs({ isOpen: value })}
      >
        <DialogHeader>Example Dialog</DialogHeader>
        <DialogBody>
          <Text>This is a basic dialog example.</Text>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <DialogClose variant="primary">Save</DialogClose>
        </DialogFooter>
      </Dialog>
    );
  },
};

export const Scrollable: Story = {
  args: {
    isOpen: true,
  },
  render: args => (
    <DialogTrigger {...args}>
      <Button variant="secondary">Scrollable Dialog</Button>
      <Dialog>
        <DialogHeader>Long Content Dialog</DialogHeader>
        <DialogBody height={200}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="primary">Accept</DialogClose>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  ),
};

export const Confirmation: Story = {
  args: {
    isOpen: true,
  },
  render: args => (
    <DialogTrigger {...args}>
      <Button variant="secondary">Delete Item</Button>
      <Dialog>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          <Text>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="primary">Delete</DialogClose>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  ),
};

export const WithForm: Story = {
  args: {
    isOpen: true,
  },
  render: args => (
    <DialogTrigger {...args}>
      <Button variant="secondary">Create User</Button>
      <Dialog>
        <DialogHeader>Create New User</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="3">
            <TextField label="Name" placeholder="Enter full name" />
            <TextField label="Email" placeholder="Enter email address" />
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
          </Flex>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="primary">Create User</DialogClose>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  ),
};

export const PreviewScrollable: Story = {
  args: {
    ...Scrollable.args,
    isOpen: false,
  },
  render: Scrollable.render,
};

export const PreviewWithForm: Story = {
  args: {
    ...WithForm.args,
    isOpen: false,
  },
  render: WithForm.render,
};
