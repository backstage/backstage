import { childrenPropDefs, type PropDef } from '@/utils/propDefs';

export const breadcrumbsPropDefs: Record<string, PropDef> = {
  'aria-label': {
    type: 'string',
    default: '"Breadcrumbs"',
    description:
      'Accessible label for the nav landmark. Set a unique label when rendering multiple Breadcrumbs on the same page so screen readers can distinguish them.',
  },
  currentAs: {
    type: 'enum',
    values: [
      'span',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'div',
      'label',
      'strong',
      'em',
      'small',
      'legend',
    ],
    description:
      'HTML element to render for the last (current) breadcrumb. Use this when the current breadcrumb doubles as the page heading, e.g. currentAs="h1".',
  },
  ...childrenPropDefs,
};

export const breadcrumbPropDefs: Record<string, PropDef> = {
  as: {
    type: 'enum',
    values: [
      'span',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'div',
      'label',
      'strong',
      'em',
      'small',
      'legend',
    ],
    default: 'span',
    description:
      'The HTML element to render for non-link breadcrumbs. Ignored when href is provided and the item is not the current segment.',
  },
  href: {
    type: 'string',
    description:
      'URL the breadcrumb navigates to. Omit for plain text segments. The last breadcrumb always renders as text regardless of href.',
  },
  ...childrenPropDefs,
};
