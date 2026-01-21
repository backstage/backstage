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
import {
  RiChat1Line,
  RiFileLine,
  RiFolderLine,
  RiImageLine,
  RiSettingsLine,
  RiShareBoxLine,
} from '@remixicon/react';

export const Preview = () => (
  <MemoryRouter>
    <MenuTrigger>
      <Button aria-label="Menu">Menu</Button>
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
        <MenuItem iconStart={<RiFileLine />}>New File</MenuItem>
        <MenuItem iconStart={<RiFolderLine />}>New Folder</MenuItem>
        <MenuItem iconStart={<RiImageLine />}>New Image</MenuItem>
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
    <MenuAutocomplete placeholder="Type to search...">
      <MenuItem>Option 1</MenuItem>
      <MenuItem>Option 2</MenuItem>
      <MenuItem>Option 3</MenuItem>
    </MenuAutocomplete>
  </MemoryRouter>
);

export const PreviewAutocompleteListbox = () => (
  <MemoryRouter>
    <MenuAutocomplete placeholder="Type to filter...">
      <MenuListBoxItem>Option 1</MenuListBoxItem>
      <MenuListBoxItem>Option 2</MenuListBoxItem>
      <MenuListBoxItem>Option 3</MenuListBoxItem>
    </MenuAutocomplete>
  </MemoryRouter>
);

export const PreviewAutocompleteListboxMultiple = () => (
  <MemoryRouter>
    <MenuAutocomplete placeholder="Type to filter..." selectionMode="multiple">
      <MenuListBoxItem>Option 1</MenuListBoxItem>
      <MenuListBoxItem>Option 2</MenuListBoxItem>
      <MenuListBoxItem>Option 3</MenuListBoxItem>
    </MenuAutocomplete>
  </MemoryRouter>
);
