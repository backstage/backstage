import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const accordionPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode', '(state: { isExpanded: boolean }) => ReactNode'],
    description:
      'Content of the accordion. Can be a render function to access expanded state.',
  },
  defaultExpanded: {
    type: 'boolean',
    default: 'false',
    description: 'Whether the accordion is expanded on initial render.',
  },
  isExpanded: {
    type: 'boolean',
    description: 'Controls the expanded state (controlled mode).',
  },
  onExpandedChange: {
    type: 'enum',
    values: ['(isExpanded: boolean) => void'],
    description: 'Called when the expanded state changes.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionTriggerPropDefs: Record<string, PropDef> = {
  level: {
    type: 'enum',
    values: ['1', '2', '3', '4', '5', '6'],
    default: '3',
    description:
      'Heading level for accessibility (renders h1-h6). Match your page hierarchy.',
  },
  title: {
    type: 'string',
    description: 'Primary text displayed in the trigger.',
  },
  subtitle: {
    type: 'string',
    description: 'Secondary text displayed next to the title.',
  },
  iconStart: {
    type: 'enum',
    values: ['ReactNode'],
  },
  iconEnd: {
    type: 'enum',
    values: ['ReactNode'],
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description:
      'Custom trigger content. When provided, title and subtitle are ignored.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionPanelPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Content displayed when the accordion is expanded.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionGroupPropDefs: Record<string, PropDef> = {
  allowsMultiple: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether multiple accordions can be expanded at the same time.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Accordion components to group together.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
