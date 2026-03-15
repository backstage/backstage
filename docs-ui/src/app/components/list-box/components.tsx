'use client';

import {
  ListBox,
  ListBoxItem,
} from '../../../../../packages/ui/src/components/ListBox/ListBox';
import { MenuItem } from '../../../../../packages/ui/src/components/Menu/Menu';
import {
  TagGroup,
  Tag,
} from '../../../../../packages/ui/src/components/TagGroup/TagGroup';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import {
  RiJavascriptLine,
  RiReactjsLine,
  RiShipLine,
  RiTerminalLine,
  RiCodeLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiShareBoxLine,
} from '@remixicon/react';

const itemTags: Record<string, string[]> = {
  react: ['frontend', 'ui'],
  typescript: ['typed', 'js'],
  javascript: ['web'],
  rust: ['systems', 'fast'],
  go: ['backend'],
};

const items = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
];

const itemsWithDescription = [
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Typed superset of JavaScript',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web',
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming with memory safety',
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Simple, fast, and reliable',
  },
];

const itemIcons: Record<string, React.ReactNode> = {
  react: <RiReactjsLine />,
  typescript: <RiCodeLine />,
  javascript: <RiJavascriptLine />,
  rust: <RiShipLine />,
  go: <RiTerminalLine />,
};

export const Default = () => (
  <ListBox aria-label="Programming languages" style={{ width: 380 }}>
    {items.map(item => (
      <ListBoxItem
        key={item.id}
        id={item.id}
        icon={itemIcons[item.id]}
        menuItems={
          <>
            <MenuItem iconStart={<RiEdit2Line />}>Edit</MenuItem>
            <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
            <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
              Delete
            </MenuItem>
          </>
        }
        customActions={
          <TagGroup aria-label={`Tags for ${item.label}`}>
            {itemTags[item.id].map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagGroup>
        }
      >
        {item.label}
      </ListBoxItem>
    ))}
  </ListBox>
);

export const WithIcons = () => (
  <ListBox aria-label="Programming languages" style={{ width: 280 }}>
    {items.map(item => (
      <ListBoxItem key={item.id} id={item.id} icon={itemIcons[item.id]}>
        {item.label}
      </ListBoxItem>
    ))}
  </ListBox>
);

export const WithDescription = () => (
  <ListBox aria-label="Programming languages" style={{ width: 340 }}>
    {itemsWithDescription.map(item => (
      <ListBoxItem
        key={item.id}
        id={item.id}
        icon={itemIcons[item.id]}
        description={item.description}
      >
        {item.label}
      </ListBoxItem>
    ))}
  </ListBox>
);

export const SelectionModeSingle = () => {
  const [selected, setSelected] = useState<Selection>(new Set(['react']));

  return (
    <ListBox
      aria-label="Programming languages"
      style={{ width: 280 }}
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {items.map(item => (
        <ListBoxItem key={item.id} id={item.id}>
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  );
};

export const SelectionModeMultiple = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set(['react', 'typescript']),
  );

  return (
    <ListBox
      aria-label="Programming languages"
      style={{ width: 280 }}
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {items.map(item => (
        <ListBoxItem key={item.id} id={item.id}>
          {item.label}
        </ListBoxItem>
      ))}
    </ListBox>
  );
};

export const Disabled = () => (
  <ListBox
    aria-label="Programming languages"
    style={{ width: 280 }}
    disabledKeys={['typescript', 'rust']}
  >
    {items.map(item => (
      <ListBoxItem key={item.id} id={item.id}>
        {item.label}
      </ListBoxItem>
    ))}
  </ListBox>
);
