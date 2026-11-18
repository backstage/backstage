export const sheetUsageSnippet = `import {
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@backstage/ui';

<SheetTrigger>
  <Button>Open Sheet</Button>
  <Sheet position="end">
    <SheetHeader>Title</SheetHeader>
    <SheetBody>Content</SheetBody>
    <SheetFooter>
      <Button slot="close">Close</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>`;

export const sheetDefaultSnippet = `<SheetTrigger>
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
      <Button variant="secondary" slot="close">Close</Button>
      <Button variant="primary" slot="close">Save</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>`;

export const sheetPositionsSnippet = `<SheetTrigger>
  <Button variant="secondary">Start</Button>
  <Sheet position="start">
    <SheetHeader>Start Sheet</SheetHeader>
    <SheetBody>This sheet opens from the start edge.</SheetBody>
    <SheetFooter>
      <Button slot="close">Close</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>

<SheetTrigger>
  <Button variant="secondary">Bottom</Button>
  <Sheet position="bottom">
    <SheetHeader>Bottom Sheet</SheetHeader>
    <SheetBody>This sheet opens from the bottom edge.</SheetBody>
    <SheetFooter>
      <Button slot="close">Close</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>`;

export const sheetWithFormSnippet = `<SheetTrigger>
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
      <Button variant="secondary" slot="close">Cancel</Button>
      <Button variant="primary" slot="close">Create User</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>`;

export const sheetSnapPointsSnippet = `<SheetTrigger>
  <Button variant="secondary">Show Details</Button>
  <Sheet position="bottom" snapPoints={[240]}>
    <SheetHeader>Snap Points</SheetHeader>
    <SheetBody>
      <Text>
        This sheet opens at a partial height. Drag it up to reveal more
        content, or swipe down to dismiss it.
      </Text>
      ...
    </SheetBody>
    <SheetFooter>
      <Button variant="secondary" slot="close">Dismiss</Button>
    </SheetFooter>
  </Sheet>
</SheetTrigger>`;

export const sheetControlledSnippet = `const [isOpen, setIsOpen] = useState(false);

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
</Sheet>`;

export const sheetCloseSnippet = `<Button slot="close">Close</Button>`;
