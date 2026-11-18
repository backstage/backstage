import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const sheetTriggerPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Trigger element and sheet content.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Whether the sheet is open (controlled).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the sheet is open by default (uncontrolled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: "Handler that is called when the sheet's open state changes.",
  },
};

export const sheetPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Sheet content (SheetHeader, SheetBody, SheetFooter).',
  },
  position: {
    type: 'enum',
    values: ['top', 'bottom', 'left', 'right', 'start', 'end', 'center'],
    default: 'bottom',
    description:
      'The edge of the viewport the sheet is anchored to. Start and end are mirrored in right-to-left layouts.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Whether the sheet is open (controlled).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the sheet is open by default (uncontrolled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description: 'Called when the open state changes.',
  },
  width: {
    type: 'enum',
    values: ['number', 'string'],
    description:
      'Width of the sheet panel in pixels (number) or CSS units (string).',
  },
  height: {
    type: 'enum',
    values: ['number', 'string'],
    description:
      'Height of the sheet panel in pixels (number) or CSS units (string).',
  },
  snapPoints: {
    type: 'enum',
    values: ['(number | string)[]'],
    description:
      'Snap points the sheet stops at, expressed as the amount of the sheet that is visible.',
  },
  swipeDirection: {
    type: 'enum',
    values: [
      'bottom',
      'top',
      'left',
      'right',
      'start',
      'end',
      'vertical',
      'horizontal',
    ],
    description: 'The direction the sheet can be swiped to dismiss.',
  },
  preventDismissal: {
    type: 'boolean',
    default: 'false',
    description:
      'Prevents dismissal by swiping, pressing Escape, or interacting outside the sheet.',
  },
  overscrollPadding: {
    type: 'boolean',
    default: 'true',
    description:
      'Adds padding to the sheet so that it appears to continue outside the viewport.',
  },
  'aria-label': {
    type: 'string',
    description:
      'Accessible label for the sheet when no SheetHeader title is rendered.',
  },
  'aria-labelledby': {
    type: 'string',
    description:
      'ID of an element that labels the sheet when no SheetHeader title is rendered.',
  },
  swipeAnimation: {
    type: 'string',
    description:
      'CSS keyframes name for the animation that occurs while the user swipes.',
  },
  stackAnimation: {
    type: 'string',
    default: 'bui-sheet-stack',
    description:
      'CSS keyframes name for the animation applied to a parent sheet when a nested sheet is opened.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const sheetHeaderPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Sheet title text.',
  },
  level: {
    type: 'number',
    default: '3',
    description: 'The heading level of the sheet title.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const sheetBodyPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Main content of the sheet.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const sheetFooterPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode'],
    description: 'Action buttons or footer content.',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};
