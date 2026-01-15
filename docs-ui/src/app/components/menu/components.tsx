'use client';

import {
  MenuTrigger,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  SubmenuTrigger,
  MenuAutocomplete,
  MenuListBoxItem,
} from '../../../../../packages/ui/src/components/Menu/Menu';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { MemoryRouter } from 'react-router-dom';
import { RiFileLine, RiFolderLine, RiImageLine } from '@remixicon/react';

export const Preview = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button variant="secondary">Menu</Button>
      <Menu>
        <MenuItem>New File</MenuItem>
        <MenuItem>Open File</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem>Save As...</MenuItem>
      </Menu>
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewSubmenu = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button variant="secondary">Menu</Button>
      <Menu>
        <MenuItem>New File</MenuItem>
        <SubmenuTrigger>
          <MenuItem>Open Recent</MenuItem>
          <Menu>
            <MenuItem>File 1.txt</MenuItem>
            <MenuItem>File 2.txt</MenuItem>
            <MenuItem>File 3.txt</MenuItem>
          </Menu>
        </SubmenuTrigger>
        <MenuItem>Save</MenuItem>
      </Menu>
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewIcons = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button variant="secondary">Menu</Button>
      <Menu>
        <MenuItem icon={<RiFileLine />}>New File</MenuItem>
        <MenuItem icon={<RiFolderLine />}>New Folder</MenuItem>
        <MenuItem icon={<RiImageLine />}>New Image</MenuItem>
      </Menu>
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewLinks = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button variant="secondary">Menu</Button>
      <Menu>
        <MenuItem href="/home">Home</MenuItem>
        <MenuItem href="/about">About</MenuItem>
        <MenuItem href="/contact">Contact</MenuItem>
      </Menu>
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewSections = () => (
  <MemoryRouter>
    <MenuTrigger>
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
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewSeparators = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button variant="secondary">Menu</Button>
      <Menu>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuSeparator />
        <MenuItem>Save</MenuItem>
        <MenuItem>Save As...</MenuItem>
      </Menu>
    </MenuTrigger>
  </MemoryRouter>
);

export const PreviewAutocompleteMenu = () => (
  <MemoryRouter>
    <MenuAutocomplete label="Search" placeholder="Type to search...">
      <MenuItem>Option 1</MenuItem>
      <MenuItem>Option 2</MenuItem>
      <MenuItem>Option 3</MenuItem>
    </MenuAutocomplete>
  </MemoryRouter>
);

export const PreviewAutocompleteListbox = () => (
  <MemoryRouter>
    <MenuAutocomplete label="Select an option" placeholder="Type to filter...">
      <MenuListBoxItem>Option 1</MenuListBoxItem>
      <MenuListBoxItem>Option 2</MenuListBoxItem>
      <MenuListBoxItem>Option 3</MenuListBoxItem>
    </MenuAutocomplete>
  </MemoryRouter>
);

export const PreviewAutocompleteListboxMultiple = () => (
  <MemoryRouter>
    <MenuAutocomplete
      label="Select multiple options"
      placeholder="Type to filter..."
      selectionMode="multiple"
    >
      <MenuListBoxItem>Option 1</MenuListBoxItem>
      <MenuListBoxItem>Option 2</MenuListBoxItem>
      <MenuListBoxItem>Option 3</MenuListBoxItem>
    </MenuAutocomplete>
  </MemoryRouter>
);
