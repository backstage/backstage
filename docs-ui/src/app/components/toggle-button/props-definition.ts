import { classNamePropDefs, type PropDef } from '@/utils/propDefs';

export const toggleButtonPropDefs: Record<string, PropDef> = {
  isSelected: {
    type: 'boolean',
    description:
      'Whether the button is selected. Controls the visual pressed state.',
  },
  defaultSelected: {
    type: 'boolean',
    description: 'The default selected state (uncontrolled).',
  },
  onChange: {
    type: 'enum',
    values: ['(isSelected: boolean) => void'],
    description: 'Handler called when the button is pressed.',
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    default: 'small',
    responsive: true,
    description:
      'Visual weight. Use small for compact layouts, medium for emphasis.',
  },
  iconStart: {
    type: 'enum',
    values: ['ReactElement'],
    description:
      'Icon displayed before the button text. Sized to match button.',
  },
  iconEnd: {
    type: 'enum',
    values: ['ReactElement'],
    description: 'Icon displayed after the button text. Sized to match button.',
  },
  isDisabled: {
    type: 'boolean',
    default: 'false',
    description: 'Prevents interaction and dims the button.',
  },
  onSurface: {
    type: 'enum',
    values: ['Surface'],
    responsive: true,
    description:
      'Surface the button is placed on. Defaults to context surface.',
  },
  children: {
    type: 'enum',
    values: ['ReactNode', '(renderProps) => ReactNode'],
    description: 'Button label. Can be a function for dynamic content.',
  },
  ...classNamePropDefs,
};
