import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const textPropDefs: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: [
      'title-large',
      'title-medium',
      'title-small',
      'title-x-small',
      'body-large',
      'body-medium',
      'body-small',
      'body-x-small',
    ],
    default: 'body-medium',
    responsive: true,
    description:
      'Typography style. Title variants for headings, body for paragraph text.',
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
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
    values: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
      'label',
      'div',
      'strong',
      'em',
      'small',
      'legend',
    ],
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
