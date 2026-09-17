export const popoverUsageSnippet = `import { DialogTrigger, Popover, Button, Text } from '@backstage/ui';

<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>Popover content</Text>
  </Popover>
</DialogTrigger>`;

export const defaultSnippet = `<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>Popover content</Text>
  </Popover>
</DialogTrigger>`;

export const placementSnippet = `<Flex gap="4">
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
</Flex>`;

export const hideArrowSnippet = `<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover hideArrow>
    <Text>Popover without arrow</Text>
  </Popover>
</DialogTrigger>`;
