import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';
import { Chip } from '@/components/Chip';

export const linkPropDefs: Record<string, PropDef> = {
  href: {
    type: 'string',
    description:
      'URL the link navigates to. Supports internal and external URLs.',
  },
  target: {
    type: 'enum',
    values: ['_self', '_blank', '_parent', '_top'],
    description: (
      <>
        Where to open the link. Use <Chip>_blank</Chip> for external links that
        open in new tabs.
      </>
    ),
  },
  title: {
    type: 'string',
    description: 'Tooltip text shown on hover. Useful for accessibility.',
  },
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
    default: 'body',
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
      'Text color. Status colors (danger, warning, success) for contextual links.',
  },
  truncate: {
    type: 'boolean',
    description:
      'Truncates text with ellipsis when it overflows its container.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
