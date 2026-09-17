import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const dialogTriggerPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Trigger element and dialog content.',
  },
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
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Dialog content (DialogHeader, DialogBody, DialogFooter).',
  },
  isOpen: {
    type: 'boolean',
    description: 'Whether the overlay is open (controlled mode).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Initial open state (uncontrolled mode).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Called when the open state changes.',
  },
  width: {
    type: 'enum',
    values: ['number', 'string'],
    default: '400',
    description: 'Fixed width in pixels (number) or CSS units (string).',
  },
  height: {
    type: 'enum',
    values: ['number', 'string'],
    default: 'auto',
    description: 'Fixed height in pixels (number) or CSS units (string).',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogHeaderPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Dialog title text.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogBodyPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Main content of the dialog.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const dialogFooterPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Action buttons or footer content.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
