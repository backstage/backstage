import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const dialogPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogTriggerPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
};

export const dialogHeaderPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogBodyPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  height: {
    type: 'enum',
    values: ['number', 'string'],
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogFooterPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogClosePropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary', 'tertiary'],
    default: 'secondary',
    responsive: false,
  },
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogUsageSnippet = `import { 
  Dialog, 
  DialogTrigger, 
  DialogHeader, 
  DialogBody, 
  DialogFooter, 
  DialogClose 
} from '@backstage/ui';

<DialogTrigger>
  <Button>Open Dialog</Button>
  <Dialog>
    <DialogHeader>Title</DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogFooter>
      <DialogClose>Close</DialogClose>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogDefaultSnippet = `<DialogTrigger>
  <Button variant="secondary">Open Dialog</Button>
  <Dialog>
    <DialogHeader>Example Dialog</DialogHeader>
    <DialogBody>
      <Text>This is a basic dialog example with React Aria Components.</Text>
    </DialogBody>
    <DialogFooter>
        <DialogClose>Close</DialogClose>
        <DialogClose variant="primary">Save</DialogClose>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;

export const dialogScrollableSnippet = `<DialogTrigger>
  <Button variant="secondary">Scrollable Dialog</Button>
  <Dialog>
    <DialogHeader>Long Content Dialog</DialogHeader>
    <DialogBody height={200}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
        commodo consequat.
      </Text>
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
      <Text>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </Text>
    </DialogBody>
    <DialogFooter>
      <Flex gap="2" justify="end">
        <DialogClose>Cancel</DialogClose>
        <DialogClose variant="primary">Accept</DialogClose>
      </Flex>
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
        <Select label="Role">
          <SelectItem>Admin</SelectItem>
          <SelectItem>User</SelectItem>
          <SelectItem>Viewer</SelectItem>
        </Select>
      </Flex>
    </DialogBody>
    <DialogFooter>
      <Flex gap="2" justify="end">
        <DialogClose>Cancel</DialogClose>
        <DialogClose variant="primary">Create User</DialogClose>
      </Flex>
    </DialogFooter>
  </Dialog>
</DialogTrigger>`;
