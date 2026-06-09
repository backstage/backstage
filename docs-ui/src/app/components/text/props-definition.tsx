import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  typographyAsValues,
  typographyVariantValues,
  typographyWeightValues,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const textPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: typographyVariantValues,
    default: 'body-medium',
    responsive: true,
    description:
      'Typography style. Title variants for headings, body for paragraph text.',
  },
  weight: {
    type: 'enum',
    values: typographyWeightValues,
    default: 'regular',
    responsive: true,
    description: (
      <>
        Font weight. Use <Chip>bold</Chip> for emphasis.
      </>
    ),
  },
  color: {
    type: 'enum',
    values: ['primary', 'secondary', 'danger', 'warning', 'success'],
    default: 'primary',
    responsive: true,
    description:
      'Text color. Status colors (danger, warning, success) for contextual messaging.',
  },
  as: {
    type: 'enum',
    values: typographyAsValues,
    default: 'span',
    description:
      'HTML element to render. Use heading tags for semantic structure.',
  },
  truncate: {
    type: 'boolean',
    default: 'false',
    description: (
      <>
        Truncates text with ellipsis when it overflows its container. Requires{' '}
        <Chip>display: block</Chip> to work.
      </>
    ),
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
