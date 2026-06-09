import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  typographyAsValues,
  typographyVariantValues,
  typographyWeightValues,
  type PropDef,
} from '@/utils/propDefs';

const breadcrumbsTypographyStyleProps: Record<string, PropDef> = {
  variant: {
    type: 'enum',
    values: typographyVariantValues,
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
    values: typographyWeightValues,
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
    values: typographyAsValues,
    description:
      'HTML element to render for the last (current) breadcrumb. Use this when the current breadcrumb doubles as the page heading, e.g. currentAs="h1".',
  },
  separator: {
    type: 'enum',
    values: ['ReactNode'],
    description:
      'Custom separator element rendered between breadcrumb items. Defaults to a right-chevron icon at 1em.',
  },
  ...breadcrumbsTypographyStyleProps,
  ...classNamePropDefs,
  ...stylePropDefs,
  ...childrenPropDefs,
};

export const breadcrumbPropDefs: Record<string, PropDef> = {
  as: {
    type: 'enum',
    values: typographyAsValues,
    default: 'span',
    description:
      'The HTML element to render for non-link breadcrumbs. Ignored when href is provided and the item is not the current segment.',
  },
  href: {
    type: 'string',
    description:
      'URL the breadcrumb navigates to. Omit for plain text segments. The last breadcrumb always renders as text regardless of href.',
  },
  ...breadcrumbsTypographyStyleProps,
  ...classNamePropDefs,
  ...stylePropDefs,
  ...childrenPropDefs,
};
