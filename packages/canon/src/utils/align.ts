import {
  type OptionalResponsiveValue,
  mapResponsiveValue,
} from '../components/box/sprinkles.css';

export type Align = 'left' | 'center' | 'right';
export type AlignY = 'top' | 'center' | 'bottom';

const alignToFlexAlignLookup = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const;

export const alignToFlexAlign = (
  align: OptionalResponsiveValue<Align> | undefined,
) =>
  align
    ? mapResponsiveValue(align, value => alignToFlexAlignLookup[value])
    : undefined;

const alignYToFlexAlignLookup = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
} as const;

export const alignYToFlexAlign = (
  alignY: OptionalResponsiveValue<AlignY> | undefined,
) =>
  alignY
    ? mapResponsiveValue(alignY, value => alignYToFlexAlignLookup[value])
    : undefined;
