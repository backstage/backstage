import { childrenPropDefs, type PropDef } from '@/utils/propDefs';

const styleProps: Record<string, PropDef> = {
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
    description: 'Text size variant. Passed to the underlying Link or Text.',
  },
  color: {
    type: 'enum',
    values: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
    description:
      'Text colour. On Breadcrumbs it sets the default for all items; on Breadcrumb it overrides that default.',
  },
  weight: {
    type: 'enum',
    values: ['regular', 'bold'],
    description: 'Font weight. Same cascading behaviour as color.',
  },
};

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
  separator: {
    type: 'string',
    description:
      'Custom separator element rendered between breadcrumb items. Defaults to a right-chevron icon at 1em.',
  },
  ...styleProps,
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
  ...styleProps,
  ...childrenPropDefs,
};
