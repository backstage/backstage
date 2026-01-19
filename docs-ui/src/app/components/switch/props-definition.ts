import { classNamePropDefs, stylePropDefs } from '@/utils/propDefs';
import type { PropDef } from '@/utils/propDefs';

export const switchPropDefs: Record<string, PropDef> = {
  autoFocus: {
    type: 'boolean',
  },
  defaultSelected: {
    type: 'boolean',
  },
  ...classNamePropDefs,
  isDisabled: {
    type: 'boolean',
  },
  isReadOnly: {
    type: 'boolean',
  },
  isSelected: {
    type: 'boolean',
  },
  label: {
    type: 'string',
  },
  name: {
    type: 'string',
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
  },
  onFocus: {
    type: 'enum',
    values: ['(e: FocusEvent<Target>) => void'],
  },
  onBlur: {
    type: 'enum',
    values: ['(e: FocusEvent<Target>) => void'],
  },
  onFocusChange: {
    type: 'enum',
    values: ['(isFocused: boolean) => void'],
  },
  onKeyDown: {
    type: 'enum',
    values: ['(e: KeyboardEvent) => void'],
  },
  onKeyUp: {
    type: 'enum',
    values: ['(e: KeyboardEvent) => void'],
  },
  onHoverStart: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
  },
  onHoverEnd: {
    type: 'enum',
    values: ['(e: HoverEvent) => void'],
  },
  onHoverChange: {
    type: 'enum',
    values: ['(isHovered: boolean) => void'],
  },
  ...stylePropDefs,
  value: {
    type: 'string',
  },
};
