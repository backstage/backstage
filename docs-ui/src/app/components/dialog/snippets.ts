export const dialogUsageSnippet = `import { 
  Dialog, 
  DialogTrigger, 
  DialogHeader, 
  DialogBody, 
  DialogFooter, 
} from '@backstage/ui';

<DialogTrigger>
  <Button>Open Dialog</Button>
  <Dialog>
    <DialogHeader>Title</DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogFooter>
      <Button variant="secondary" slot="close">Close</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogDefaultSnippet = `<DialogTrigger>
  <Button variant="secondary">Open Dialog</Button>
  <Dialog>
    <DialogHeader>Example Dialog</DialogHeader>
    <DialogBody>
      <Text>This is a basic dialog example.</Text>
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" slot="close">Close</Button>
      <Button variant="primary" slot="close">Save</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogFixedWidthAndHeightSnippet = `<DialogTrigger>
  <Button variant="secondary">Scrollable Dialog</Button>
  <Dialog width={600} height={400}>
    <DialogHeader>Long Content Dialog</DialogHeader>
    <DialogBody>
      ...
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" slot="close">Cancel</Button>
      <Button variant="primary" slot="close">Accept</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogWithFormSnippet = `<DialogTrigger>
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
      <Button variant="secondary" slot="close">Cancel</Button>
      <Button variant="primary" slot="close">Create User</Button>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogWithNoTriggerSnippet = `const [isOpen, setIsOpen] = useState(false);

<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
  <DialogHeader>Create New User</DialogHeader>
  <DialogBody>
    Your content
  </DialogBody>
  <DialogFooter>
    <Button variant="secondary" slot="close">Cancel</Button>
    <Button variant="primary" slot="close">Create User</Button>
  </DialogFooter>
</Dialog>`;

export const dialogCloseSnippet = `<Button slot="close">Close</Button>`;
