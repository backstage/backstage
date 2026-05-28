import { childrenPropDefs, type PropDef } from '@/utils/propDefs';

export const breadcrumbsPropDefs: Record<string, PropDef> = {
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
