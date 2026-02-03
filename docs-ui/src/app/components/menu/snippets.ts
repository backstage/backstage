export const usage = `import { MenuTrigger, Menu, MenuItem } from '@backstage/ui';

<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    <MenuItem>Item 1</MenuItem>
    <MenuItem>Item 2</MenuItem>
  </Menu>
</MenuTrigger>`;

export const preview = `<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Duplicate</MenuItem>
    <MenuItem>Rename</MenuItem>
    <MenuSeparator />
    <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
    <MenuItem iconStart={<RiChat1Line />}>Feedback</MenuItem>
    <MenuSeparator />
    <SubmenuTrigger>
      <MenuItem iconStart={<RiSettingsLine />}>Settings</MenuItem>
      <Menu placement="right top">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Rename</MenuItem>
      </Menu>
    </SubmenuTrigger>
  </Menu>
</MenuTrigger>`;

export const submenu = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem>New File</MenuItem>
    <SubmenuTrigger>
      <MenuItem>Open Recent</MenuItem>
      <Menu placement="right top">
        <MenuItem>File 1.txt</MenuItem>
        <MenuItem>File 2.txt</MenuItem>
      </Menu>
    </SubmenuTrigger>
    <MenuItem>Save</MenuItem>
  </Menu>
</MenuTrigger>`;

export const icons = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem iconStart={<RiFileLine />}>New File</MenuItem>
    <MenuItem iconStart={<RiFolderLine />}>New Folder</MenuItem>
    <MenuItem iconStart={<RiImageLine />}>New Image</MenuItem>
  </Menu>
</MenuTrigger>`;

export const sections = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuSection title="File">
      <MenuItem>New</MenuItem>
      <MenuItem>Open</MenuItem>
    </MenuSection>
    <MenuSection title="Edit">
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </MenuSection>
  </Menu>
</MenuTrigger>`;

export const separators = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem>New</MenuItem>
    <MenuItem>Open</MenuItem>
    <MenuSeparator />
    <MenuItem>Save</MenuItem>
    <MenuItem>Save As...</MenuItem>
  </Menu>
</MenuTrigger>`;

export const links = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem href="/home">Home</MenuItem>
    <MenuItem href="/about">About</MenuItem>
    <MenuItem href="/contact">Contact</MenuItem>
  </Menu>
</MenuTrigger>`;

export const autocomplete = `<MenuTrigger>
  <Button variant="secondary">Search</Button>
  <MenuAutocomplete placeholder="Type to search...">
    <MenuItem>Option 1</MenuItem>
    <MenuItem>Option 2</MenuItem>
    <MenuItem>Option 3</MenuItem>
  </MenuAutocomplete>
</MenuTrigger>`;

export const autocompleteListbox = `<MenuTrigger>
  <Button variant="secondary">Select</Button>
  <MenuAutocompleteListbox placeholder="Type to filter...">
    <MenuListBoxItem>Option 1</MenuListBoxItem>
    <MenuListBoxItem>Option 2</MenuListBoxItem>
    <MenuListBoxItem>Option 3</MenuListBoxItem>
  </MenuAutocompleteListbox>
</MenuTrigger>`;

export const autocompleteListboxMultiple = `<MenuTrigger>
  <Button variant="secondary">Multi-select</Button>
  <MenuAutocompleteListbox
    placeholder="Type to filter..."
    selectionMode="multiple"
  >
    <MenuListBoxItem>Option 1</MenuListBoxItem>
    <MenuListBoxItem>Option 2</MenuListBoxItem>
    <MenuListBoxItem>Option 3</MenuListBoxItem>
  </MenuAutocompleteListbox>
</MenuTrigger>`;
