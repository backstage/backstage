import {
  classNamePropDefs,
  childrenPropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const tagGroupPropDefs: Record<string, PropDef> = {
  items: {
    type: 'enum',
    values: ['Iterable<T>'],
    description: 'Item objects in the collection.',
  },
  renderEmptyState: {
    type: 'enum',
    values: ['() => ReactNode'],
    description: 'Content to display when the collection is empty.',
  },
  selectionMode: {
    type: 'enum',
    values: ['none', 'single', 'multiple'],
    description: 'The type of selection allowed.',
  },
  selectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The currently selected keys (controlled).',
  },
  defaultSelectedKeys: {
    type: 'enum',
    values: ['all', 'Iterable<Key>'],
    description: 'The initial selected keys (uncontrolled).',
  },
  disabledKeys: {
    type: 'enum',
    values: ['Iterable<Key>'],
    description: 'Keys of tags that should be disabled.',
  },
  onRemove: {
    type: 'enum',
    values: ['(keys: Set<Key>) => void'],
    description: 'Handler called when a tag is removed.',
  },
  onSelectionChange: {
    type: 'enum',
    values: ['(keys: Selection) => void'],
    description: 'Handler called when the selection changes.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};

export const tagPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
    description: 'Unique identifier for the tag.',
  },
  textValue: {
    type: 'string',
    description:
      'Text value for accessibility. Derived from children if string.',
  },
  href: {
    type: 'string',
    description: 'URL to navigate to when the tag is clicked.',
  },
  icon: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Icon displayed before the tag text.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    description: (
      <>
        Visual size of the tag. Use <Chip>small</Chip> for inline or dense
        layouts, <Chip>medium</Chip> for standalone tags.
      </>
    ),
  },
  isDisabled: {
    type: 'boolean',
    description: 'Whether the tag is disabled.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
};
