'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '../../../../../packages/ui/src/components/Sheet/Sheet';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Select } from '../../../../../packages/ui/src/components/Select/Select';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { TextField } from '../../../../../packages/ui/src/components/TextField/TextField';

export const Default = () => (
  <SheetTrigger>
    <Button variant="secondary">Open Sheet</Button>
    <Sheet position="end">
      <SheetHeader>Example Sheet</SheetHeader>
      <SheetBody>
        <Text>
          This is a basic sheet example. It can be dismissed by pressing Escape,
          clicking outside, or swiping toward the nearest edge.
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
);

export const Positions = () => (
  <Flex gap="2">
    <SheetTrigger>
      <Button variant="secondary">Start</Button>
      <Sheet position="start">
        <SheetHeader>Start Sheet</SheetHeader>
        <SheetBody>
          <Text>This sheet opens from the start edge of the viewport.</Text>
        </SheetBody>
        <SheetFooter>
          <Button slot="close">Close</Button>
        </SheetFooter>
      </Sheet>
    </SheetTrigger>
    <SheetTrigger>
      <Button variant="secondary">Bottom</Button>
      <Sheet position="bottom">
        <SheetHeader>Bottom Sheet</SheetHeader>
        <SheetBody>
          <Text>This sheet opens from the bottom edge of the viewport.</Text>
        </SheetBody>
        <SheetFooter>
          <Button slot="close">Close</Button>
        </SheetFooter>
      </Sheet>
    </SheetTrigger>
  </Flex>
);

export const WithForm = () => (
  <SheetTrigger>
    <Button variant="secondary">Create User</Button>
    <Sheet position="end">
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
  </SheetTrigger>
);

export const SnapPoints = () => (
  <SheetTrigger>
    <Button variant="secondary">Show Details</Button>
    <Sheet position="bottom" snapPoints={[240]}>
      <SheetHeader>Snap Points</SheetHeader>
      <SheetBody>
        <Flex direction="column" gap="3">
          <Text>
            This sheet opens at a partial height. Drag it up to reveal more
            content, or swipe down to dismiss it.
          </Text>
          {Array.from({ length: 10 }, (_, i) => (
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
  </SheetTrigger>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Open Sheet
      </Button>
      <Sheet isOpen={isOpen} onOpenChange={setIsOpen} position="end">
        <SheetHeader>Controlled Sheet</SheetHeader>
        <SheetBody>
          <Text>This sheet is controlled by external state.</Text>
        </SheetBody>
        <SheetFooter>
          <Button slot="close">Close</Button>
        </SheetFooter>
      </Sheet>
    </>
  );
};
