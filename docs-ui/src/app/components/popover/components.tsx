'use client';

import { Popover } from '../../../../../packages/ui/src/components/Popover/Popover';
import { DialogTrigger } from '../../../../../packages/ui/src/components/Dialog/Dialog';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';

export const Default = () => {
  return (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover>
        <Text>Popover content</Text>
      </Popover>
    </DialogTrigger>
  );
};

export const Placement = () => {
  return (
    <Flex gap="4">
      <DialogTrigger>
        <Button>Top</Button>
        <Popover placement="top">
          <Text>Content above trigger</Text>
        </Popover>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Right</Button>
        <Popover placement="right">
          <Text>Content to the right</Text>
        </Popover>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Bottom</Button>
        <Popover placement="bottom">
          <Text>Content below trigger</Text>
        </Popover>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Left</Button>
        <Popover placement="left">
          <Text>Content to the left</Text>
        </Popover>
      </DialogTrigger>
    </Flex>
  );
};

export const HideArrow = () => {
  return (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover hideArrow>
        <Text>Popover without arrow</Text>
      </Popover>
    </DialogTrigger>
  );
};
