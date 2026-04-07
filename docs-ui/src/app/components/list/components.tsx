'use client';

import {
  List,
  ListRow,
} from '../../../../../packages/ui/src/components/List/List';
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

const items = [
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
    icon: <RiReactjsLine />,
    tags: ['frontend', 'ui'],
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Typed superset of JavaScript',
    icon: <RiCodeLine />,
    tags: ['typed', 'js'],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web',
    icon: <RiJavascriptLine />,
    tags: ['web'],
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming with memory safety',
    icon: <RiShipLine />,
    tags: ['systems', 'fast'],
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Simple, fast, and reliable',
    icon: <RiTerminalLine />,
    tags: ['backend'],
  },
];

const menuItems = (
  <>
    <MenuItem iconStart={<RiEdit2Line />}>Edit</MenuItem>
    <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
    <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
      Delete
    </MenuItem>
  </>
);

export const Default = () => (
  <List aria-label="Programming languages" style={{ width: 380 }} items={items}>
    {item => (
      <ListRow
        id={item.id}
        icon={item.icon}
        menuItems={menuItems}
        customActions={
          <TagGroup aria-label={`Tags for ${item.label}`}>
            {item.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagGroup>
        }
      >
        {item.label}
      </ListRow>
    )}
  </List>
);

export const WithIcons = () => (
  <List aria-label="Programming languages" style={{ width: 280 }} items={items}>
    {item => (
      <ListRow id={item.id} icon={item.icon}>
        {item.label}
      </ListRow>
    )}
  </List>
);

export const WithDescription = () => (
  <List aria-label="Programming languages" style={{ width: 340 }} items={items}>
    {item => (
      <ListRow id={item.id} icon={item.icon} description={item.description}>
        {item.label}
      </ListRow>
    )}
  </List>
);

export const SelectionModeSingle = () => {
  const [selected, setSelected] = useState<Selection>(new Set(['react']));

  return (
    <List
      aria-label="Programming languages"
      style={{ width: 280 }}
      items={items}
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
  );
};

export const SelectionModeMultiple = () => {
  const [selected, setSelected] = useState<Selection>(
    new Set(['react', 'typescript']),
  );

  return (
    <List
      aria-label="Programming languages"
      style={{ width: 280 }}
      items={items}
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {item => <ListRow id={item.id}>{item.label}</ListRow>}
    </List>
  );
};

export const Disabled = () => (
  <List
    aria-label="Programming languages"
    style={{ width: 280 }}
    items={items}
    disabledKeys={['typescript', 'rust']}
  >
    {item => <ListRow id={item.id}>{item.label}</ListRow>}
  </List>
);
