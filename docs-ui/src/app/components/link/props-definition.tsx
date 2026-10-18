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
        Where to open the link. Ignored when <Chip>external</Chip> is set, as
        external links always open in a new tab.
      </>
    ),
  },
  external: {
    type: 'boolean',
    description: (
      <>
        Marks the link as leading outside of the application. Shows an external
        link icon after the link text and always opens the link in a new tab
        with <Chip>rel="noopener noreferrer"</Chip>.
      </>
    ),
    default: 'false',
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
    values: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
    default: 'primary',
    responsive: true,
    description:
      'Text color. Status colors (danger, warning, success) for contextual links.',
  },
  truncate: {
    type: 'boolean',
    description:
      'Truncates text with ellipsis when it overflows its container.',
    default: 'false',
  },
  noTrack: {
    type: 'boolean',
    description:
      'Suppresses the automatic analytics click event, e.g. if you already have custom tracking.',
  },
  standalone: {
    type: 'boolean',
    description: 'Removes underline by default. Underline appears on hover.',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};
