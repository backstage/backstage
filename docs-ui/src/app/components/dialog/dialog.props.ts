import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const dialogTriggerPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  isOpen: {
    type: 'boolean',
    description: 'Whether the overlay is open by default (controlled).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the overlay is open by default (uncontrolled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description:
      "Handler that is called when the overlay's open state changes.",
  },
};

export const dialogPropDefs: Record<string, PropDef> = {
  children: { type: 'enum', values: ['ReactNode'], responsive: false },
  isOpen: {
    type: 'boolean',
    description: 'Whether the overlay is open by default (controlled).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the overlay is open by default (uncontrolled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description:
      "Handler that is called when the overlay's open state changes.",
  },
  width: {
    type: 'enum',
    values: ['number', 'string'],
    responsive: false,
  },
  height: {
    type: 'enum',
    values: ['number', 'string'],
    responsive: false,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
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
  <Dialog>
    <DialogHeader>Long Content Dialog</DialogHeader>
    <DialogBody width={600} height={400}>
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
        <Select label="Role">
          <SelectItem>Admin</SelectItem>
          <SelectItem>User</SelectItem>
          <SelectItem>Viewer</SelectItem>
        </Select>
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
