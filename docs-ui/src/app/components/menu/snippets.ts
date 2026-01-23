export const usage = `import { MenuTrigger, Menu, MenuItem } from '@backstage/ui';

<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    <MenuItem>Item 1</MenuItem>
    <MenuItem>Item 2</MenuItem>
  </Menu>
</MenuTrigger>`;

export const preview = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem>New File</MenuItem>
    <MenuItem>Open File</MenuItem>
    <MenuItem>Save</MenuItem>
    <MenuItem>Save As...</MenuItem>
  </Menu>
</MenuTrigger>`;

export const submenu = `<MenuTrigger>
  <Button variant="secondary">Menu</Button>
  <Menu>
    <MenuItem>New File</MenuItem>
    <SubmenuTrigger>
      <MenuItem>Open Recent</MenuItem>
      <Menu>
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
    <MenuItem icon={<RiFileLine />}>New File</MenuItem>
    <MenuItem icon={<RiFolderLine />}>New Folder</MenuItem>
    <MenuItem icon={<RiImageLine />}>New Image</MenuItem>
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

export const autocomplete = `<MenuAutocomplete label="Search" placeholder="Type to search...">
  <MenuItem>Option 1</MenuItem>
  <MenuItem>Option 2</MenuItem>
  <MenuItem>Option 3</MenuItem>
</MenuAutocomplete>`;

export const autocompleteListbox = `<MenuAutocomplete label="Select an option" placeholder="Type to filter...">
  <MenuListBoxItem>Option 1</MenuListBoxItem>
  <MenuListBoxItem>Option 2</MenuListBoxItem>
  <MenuListBoxItem>Option 3</MenuListBoxItem>
</MenuAutocomplete>`;

export const autocompleteListboxMultiple = `<MenuAutocomplete
  label="Select multiple options"
  placeholder="Type to filter..."
  selectionMode="multiple"
>
  <MenuListBoxItem>Option 1</MenuListBoxItem>
  <MenuListBoxItem>Option 2</MenuListBoxItem>
  <MenuListBoxItem>Option 3</MenuListBoxItem>
</MenuAutocomplete>`;
