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
import { Button, Flex, Text } from '@backstage/ui';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DialogHeader>Hello</DialogHeader>
        <DialogBody>
          <Text>Hello world</Text>
        </DialogBody>
        <DialogFooter>
          <Flex gap="2" align="center" justify="end">
            <DialogClose>Close</DialogClose>
            <DialogClose variant="primary" onPress={() => console.log('Save')}>
              Save
            </DialogClose>
          </Flex>
        </DialogFooter>
      </>
    ),
  },
  render: args => (
    <DialogTrigger>
      <Button size="small" variant="secondary">
        Open Dialog
      </Button>
      <Dialog {...args} />
    </DialogTrigger>
  ),
};

export const CustomBodyMaxHeight: Story = {
  args: {
    children: (
      <>
        <DialogHeader> Hello</DialogHeader>
        <DialogBody height={400}>
          {Array.from({ length: 40 }).map((_, index) => (
            <Text key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </Text>
          ))}
        </DialogBody>
        <DialogFooter>
          <Flex gap="2" align="center" justify="end">
            <DialogClose>Close</DialogClose>
            <DialogClose variant="primary" onPress={() => console.log('Save')}>
              Save
            </DialogClose>
          </Flex>
        </DialogFooter>
      </>
    ),
  },
  render: args => (
    <DialogTrigger>
      <Button size="small" variant="secondary">
        Open Dialog
      </Button>
      <Dialog {...args} />
    </DialogTrigger>
  ),
};
