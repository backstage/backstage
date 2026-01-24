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
