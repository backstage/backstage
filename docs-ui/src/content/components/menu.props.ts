import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

const placementValues = [
  'bottom',
  'bottom left',
  'bottom right',
  'bottom start',
  'bottom end',
  'top',
  'top left',
  'top right',
  'top start',
  'top end',
  'left',
  'left top',
  'left bottom',
  'start',
  'start top',
  'start bottom',
  'right',
  'right top',
  'right bottom',
  'end',
  'end top',
  'end bottom',
];

export const menuTriggerPropDefs: Record<string, PropDef> = {
  isOpen: {
    type: 'boolean',
  },
  defaultOpen: {
    type: 'boolean',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
  },
};

export const submenuTriggerPropDefs: Record<string, PropDef> = {
  delay: {
    type: 'number',
    default: '200',
  },
};

export const menuPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  placement: {
    type: 'enum',
    values: placementValues,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuListBoxPropDefs: Record<string, PropDef> = {
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
  },
  placement: {
    type: 'enum',
    values: placementValues,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuAutocompletePropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: placementValues,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuAutocompleteListboxPropDefs: Record<string, PropDef> = {
  placement: {
    type: 'enum',
    values: placementValues,
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
  },
  value: {
    type: 'string',
  },
  textValue: {
    type: 'string',
  },
  isDisabled: {
    type: 'boolean',
  },
  href: {
    type: 'string',
  },
  onAction: {
    type: 'enum',
    values: ['(event) => void'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuListBoxItemPropDefs: Record<string, PropDef> = {
  id: {
    type: 'enum',
    values: ['Key'],
  },
  value: {
    type: 'string',
  },
  textValue: {
    type: 'string',
  },
  isDisabled: {
    type: 'boolean',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuSectionPropDefs: Record<string, PropDef> = {
  title: {
    type: 'string',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuSeparatorPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const usage = `import { MenuTrigger, Menu, MenuItem } from '@backstage/ui';

<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    <MenuItem id="apple">Apple</MenuItem>
    <MenuItem id="banana">Banana</MenuItem>
    <MenuItem id="blueberry">Blueberry</MenuItem>
    <MenuSeparator />
    <SubmenuTrigger>
      <MenuItem>Vegetables</MenuItem>
      <Menu>
        <MenuItem id="carrot">Carrot</MenuItem>
        <MenuItem id="tomato">Tomato</MenuItem>
        <MenuItem id="potato">Potato</MenuItem>
      </Menu>
    </SubmenuTrigger>
  </Menu>
</MenuTrigger>`;

export const preview = `<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    {options.map(option => (
      <MenuItem key={option.value}>{option.label}</MenuItem>
    ))}
  </Menu>
</MenuTrigger>`;

export const submenu = `<MenuTrigger>
  <Button aria-label="Menu">Menu</Button>
  <Menu>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Duplicate</MenuItem>
    <SubmenuTrigger>
      <MenuItem>Submenu</MenuItem>
      <Menu placement="right top">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem>Share</MenuItem>
        <MenuItem>Move</MenuItem>
        <MenuSeparator />
        <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
      </Menu>
    </SubmenuTrigger>
  </Menu>
</MenuTrigger>`;

export const icons = `<MenuTrigger>
  <Button aria-label="Menu">Menu</Button>
  <Menu>
    <MenuItem iconStart={<RiFileCopyLine />}>Copy</MenuItem>
    <MenuItem iconStart={<RiEdit2Line />}>Rename</MenuItem>
    <MenuItem iconStart={<RiChat1Line />}>Send feedback</MenuItem>
  </Menu>
</MenuTrigger>`;

export const sections = `<MenuTrigger>
  <Button aria-label="Menu">Menu</Button>
  <Menu>
    <MenuSection title="My Account">
      <MenuItem iconStart={<RiUserLine />}>Profile</MenuItem>
      <MenuItem iconStart={<RiSettingsLine />}>Settings</MenuItem>
    </MenuSection>
    <MenuSection title="Support">
      <MenuItem iconStart={<RiQuestionLine />}>Help Center</MenuItem>
      <MenuItem iconStart={<RiCustomerService2Line />}>
        Contact Support
      </MenuItem>
      <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
    </MenuSection>
  </Menu>
</MenuTrigger>`;

export const separators = `<MenuTrigger>
  <Button aria-label="Menu">Menu</Button>
  <Menu>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Duplicate</MenuItem>
    <MenuItem>Rename</MenuItem>
    <MenuSeparator />
    <MenuItem>Share</MenuItem>
    <MenuItem>Move</MenuItem>
    <MenuSeparator />
    <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
  </Menu>
</MenuTrigger>`;

export const links = `<MenuTrigger>
  <Button aria-label="Menu">Menu</Button>
  <Menu>
    <MenuItem href="/home">Internal link</MenuItem>
    <MenuItem href="https://www.google.com" target="_blank">
      External link
    </MenuItem>
    <MenuItem href="mailto:test@test.com">Email link</MenuItem>
  </Menu>
</MenuTrigger>`;

export const autocomplete = `<MenuTrigger isOpen>
  <Button aria-label="Menu">Menu</Button>
  <MenuAutocomplete placeholder="Filter">
    <MenuItem>Create new file...</MenuItem>
    <MenuItem>Create new folder...</MenuItem>
    <MenuItem>Assign to...</MenuItem>
    <MenuItem>Assign to me</MenuItem>
    <MenuItem>Change status...</MenuItem>
    <MenuItem>Change priority...</MenuItem>
    <MenuItem>Add label...</MenuItem>
    <MenuItem>Remove label...</MenuItem>
  </MenuAutocomplete>
</MenuTrigger>`;

export const autocompleteListbox = `const [selected, setSelected] = useState<Selection>(
  new Set(['blueberry']),
);

<Flex direction="column" gap="2" align="start">
  <Text>Selected: {Array.from(selected).join(', ')}</Text>
  <MenuTrigger>
    <Button aria-label="Menu">Menu</Button>
    <MenuAutocompleteListbox
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {options.map(option => (
        <MenuListBoxItem key={option.value} id={option.value}>
          {option.label}
        </MenuListBoxItem>
      ))}
    </MenuAutocompleteListbox>
  </MenuTrigger>
</Flex>`;

export const autocompleteListboxMultiple = `const [selected, setSelected] = useState<Selection>(
  new Set(['blueberry', 'cherry']),
);

<Flex direction="column" gap="2" align="start">
  <Text>Selected: {Array.from(selected).join(', ')}</Text>
  <MenuTrigger>
    <Button aria-label="Menu">Menu</Button>
    <MenuAutocompleteListbox
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {options.map(option => (
        <MenuListBoxItem key={option.value} id={option.value}>
          {option.label}
        </MenuListBoxItem>
      ))}
    </MenuAutocompleteListbox>
  </MenuTrigger>
</Flex>`;
